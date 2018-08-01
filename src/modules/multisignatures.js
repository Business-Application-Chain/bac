var util = require('util');
var extend = require('extend');
var async = require('async');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var crypto = require('crypto');
var ed = require('ed25519');
var ByteBuffer = require('bytebuffer');
var TransactionTypes = require('../utils/transaction-types.js');
var Diff = require('../utils/diff.js');

// private objects
var modules_loaded, library, self, privated = {}, shared = {}, genesisblock = null;

privated.unconfirmedSignatures = {};

function Multisignature() {

    this.calculateFee = function (txObj, sender) {
        return ((txObj.asset.multisignature.keysgroup.length + 1) * 5) * constants.fixedPoint;
    };

    this.create = function (data, txObj) {
        txObj.recipientId = null;
        txObj.amount = 0;
        txObj.asset.multisignature = {
            min: data.min,
            lifetime: data.lifetime,
            keysgroup: data.keysgroup
        };

        return txObj;
    };

    this.objectNormalize = function (txObj) {

    };

    this.getBytes = function (txObj) {

    };

    this.ready = function (txObj, sender) {

    };

    this.process = function (txObj, sender, cb) {

    };

    this.verify = function (txObj, sender, cb) {

    };

    this.apply = function (txObj, blockObj, sender, cb) {

    };

    this.undo = function (txObj, blockObj, sender, cb) {

    };

    this.applyUnconfirmed = function (txObj, sender, cb) {

    };

    this.undoUnconfirmed = function (txObj, sender, cb) {

    };

    this.load = function (raw) {
        if (!raw.m_keysgroup) {
            return null;
        } else {
            var multisignature = {
                min: raw.m_min,
                lifetime: raw.m_lifetime,
                keysgroup: raw.m_keysgroup.split(',')
            };

            return {multisignature: multisignature};
        }
    };

    this.save = function (txObj, cb) {

    };
}

// constructor
function Multisignatures(cb, scope) {
    library = scope;
    genesisblock = library.genesisblock;
    self = this;
    self.__private = privated;

    library.base.transaction.attachAssetType(TransactionTypes.MULTI, new Multisignature());

    setImmediate(cb, null, self);
}

// public methods
Multisignatures.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

Multisignatures.prototype.callApi = function (call, args, cb) {
    var callArgs = [args, cb];
    // execute
    shared[call].apply(null, callArgs);
};

// Events
Multisignatures.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};


shared.pending = function (req, cb) {
    var query = req.body;

    library.schema.validate(query, {
        type: "object",
        properties: {
            publicKey: {
                type: "string",
                format: "publicKey"
            }
        },
        required: ['publicKey']
    }, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        var transactions = modules.transactions.getUnconfirmedTransactionList();

        var pendings = [];
        async.eachSeries(transactions, function (item, cb) {
            var signed = false;

            if (!verify && item.signatures && item.signatures.length > 0) {
                var verify = false;

                for (var i in item.signatures) {
                    var signature = item.signatures[i];

                    try {
                        verify = library.base.transaction.verifySignature(item, query.publicKey, item.signatures[i]);
                    } catch (e) {
                        verify = false;
                    }

                    if (verify) {
                        break;
                    }
                }

                if (verify) {
                    signed = true;
                }
            }


            if (!signed && item.senderPublicKey == query.publicKey) {
                signed = true;
            }

            modules.accounts.getAccount({
                publicKey: item.senderPublicKey
            }, function (err, sender) {
                if (err) {
                    return cb(err);
                }

                if (!sender) {
                    return cb("Invalid sender");
                }

                if ((sender.publicKey == query.publicKey && sender.u_multisignatures.length > 0) || sender.u_multisignatures.indexOf(query.publicKey) >= 0 || sender.multisignatures.indexOf(query.publicKey) >= 0) {
                    var min = sender.u_multimin || sender.multimin;
                    var lifetime = sender.u_multilifetime || sender.multilifetime;
                    var signatures = sender.u_multisignatures.length;

                    pendings.push({
                        max: signatures.length,
                        min: min,
                        lifetime: lifetime,
                        signed: signed,
                        transaction: item
                    });
                }

                return cb();
            });
        }, function () {
            return cb(null, {transactions: pendings});
        });
    });
};

shared.sign = function (req, cb) {
    var body = req.body;
    library.schema.validate(body, {
        type: "object",
        properties: {
            secret: {
                type: "string",
                minLength: 1,
                maxLength: 100
            },
            secondSecret: {
                type: "string",
                minLength: 1,
                maxLength: 100
            },
            publicKey: {
                type: "string",
                format: "publicKey"
            },
            transactionHash: {
                type: "string"
            }
        },
        required: ['transactionHash', 'secret']
    }, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        var transaction = modules.transactions.getUnconfirmedTransaction(body.transactionHash);

        if (!transaction) {
            return cb("Transaction not found");
        }

        var hash = crypto.createHash('sha256').update(body.secret, 'utf8').digest();
        var keypair = ed.MakeKeypair(hash);

        if (body.publicKey) {
            if (keypair.publicKey.toString('hex') != body.publicKey) {
                return cb("Invalid passphrase");
            }
        }

        var sign = library.base.transaction.multisign(keypair, transaction);

        function done(cb) {
            library.balancesSequence.add(function (cb) {
                var transaction = modules.transactions.getUnconfirmedTransaction(body.transactionHash);

                if (!transaction) {
                    return cb("Transaction not found");
                }

                transaction.signatures = transaction.signatures || [];
                transaction.signatures.push(sign);

                library.bus.message('signature', {
                    signature: sign,
                    transaction: transaction.hash
                }, true);
                cb();
            }, function (err) {
                if (err) {
                    return cb(err.toString());
                }

                cb(null, {transactionHash: transaction.hash});
            });
        }

        if (transaction.type == TransactionTypes.MULTI) {
            if (transaction.asset.multisignature.keysgroup.indexOf("+" + keypair.publicKey.toString('hex')) == -1 || (transaction.signatures && transaction.signatures.indexOf(sign.toString('hex')) != -1)) {
                return cb("Permission to sign transaction denied");
            }
            done(cb);
        } else {
            modules.accounts.getAccount({
                address: transaction.senderId
            }, function (err, account) {
                if (err) {
                    return cb("Multisignature account not found");
                }

                if (!account) {
                    return cb("Account not found");
                }

                if (!transaction.requesterPublicKey) {
                    if (account.multisignatures.indexOf(keypair.publicKey.toString('hex')) < 0) {
                        return cb("Permission to sign transaction denied");
                    }
                } else {
                    if (account.publicKey != keypair.publicKey.toString('hex') || transaction.senderPublicKey != keypair.publicKey.toString('hex')) {
                        return cb("Permission to sign transaction denied");
                    }
                }

                if (transaction.signatures && transaction.signatures.indexOf(sign) != -1) {
                    return cb("Permission to sign transaction denied");
                }
                done(cb);
            });
        }
    });
};


// export
module.exports = Multisignatures;