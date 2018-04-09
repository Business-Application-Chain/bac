var async = require('async');
var constants = require('../utils/constants.js');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var crypto = require('crypto');
var ed = require('ed25519');
var ByteBuffer = require('bytebuffer');
var slots = require('../utils/slots.js');
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
        var report = library.schema.validate(txObj.asset.multisignature, {
            type: 'object',
            properties: {
                min: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 15
                },
                keysgroup: {
                    type: 'array',
                    minLength: 1,
                    maxLength: 16
                },
                lifetime: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 24
                }
            },
            required: ['min', 'keysgroup', 'lifetime']
        });

        if (!report) {
            throw new Error(report.getLastError());
        }

        return txObj;
    };

    this.getBytes = function (txObj) {
        var keysgroupBuffer = new Buffer(txObj.asset.multisignature.keysgroup.join(''), 'utf8');

        var bb = new ByteBuffer(1 + 1 + keysgroupBuffer.length, true);
        bb.writeByte(txObj.asset.multisignature.min);
        bb.writeByte(txObj.asset.multisignature.lifetime);
        for (var i = 0; i < keysgroupBuffer.length; i++) {
            bb.writeByte(keysgroupBuffer[i]);
        }
        bb.flip();

        return bb.toBuffer();
    };

    this.ready = function (txObj, sender) {
        if (!txObj.signatures) {
            return false;
        }

        if (!sender.multisignatures.length) {
            return txObj.signatures.length == txObj.asset.multisignature.keysgroup.length;
        } else {
            return txObj.signatures.length >= sender.multimin - 1;
        }
    };

    this.process = function (txObj, sender, cb) {
        setImmediate(cb, null, txObj);
    };

    this.verify = function (txObj, sender, cb) {
        if (!txObj.asset.multisignature) {
            return setImmediate(cb, "Invalid transaction asset: " + txObj.id);
        }

        if (!util.isArray(txObj.asset.multisignature.keysgroup)) {
            return setImmediate(cb, "Invalid transaction asset: " + txObj.id);
        }

        if (txObj.asset.multisignature.keysgroup.length === 0) {
            return setImmediate(cb, "Multisignature group must contains at least one member");
        }

        if (txObj.asset.multisignature.min <= 1 || txObj.asset.multisignature.min > 16) {
            return setImmediate(cb, "Invalid transaction asset: " + txObj.id);
        }

        if (txObj.asset.multisignature.min > txObj.asset.multisignature.keysgroup.length + 1) {
            return setImmediate(cb, "Invalid multisignature min");
        }

        // If it's ready
        if (this.ready(txObj, sender)) {
            try {
                for (var s = 0; s < txObj.asset.multisignature.keysgroup.length; s++) {
                    var verify = false;
                    if (txObj.signatures) {
                        for (var d = 0; d < txObj.signatures.length && !verify; d++) {
                            if (txObj.asset.multisignature.keysgrou[s][0] != '-' && txObj.asset.multisignature.keysgroup[s][0] != '+') {
                                verify = false;
                            } else {
                                verify = library.base.transaction.verifySignature(txObj, txObj.asset.multisignature.keysgroup[s].substring(1), txObj.signatures[d]);
                            }
                        }
                    }

                    if (!verify) {
                        return setImmediate(cb, "Failed to verify multisignature: " + txObj.id);
                    }
                }
            } catch (err) {
                return setImmediate(cb, "Failed to verify multisignature: " + txObj.id);
            }
        }

        if (txObj.asset.multisignature.keysgroup.indexOf("+" + sender.master_pub) != -1) {
            return setImmediate(cb, "Unable to sign transaction using own public key");
        }

        async.eachSeries(txObj.asset.multisignature.keysgroup, function (key, cb) {
            var math = key[0];
            var publicKey = key.slice(1);

            if (math != '+') {
                return cb("Invalid math operator");
            }

            // Check that there is a publicKey
            try {
                var b = new Buffer(publicKey, 'hex');
                if (b.length != 32) {
                    return cb("Invalid public key");
                }
            } catch (err) {
                return cb("Invalid public key");
            }

            return setImmediate(cb);
        }, function (err) {
            if (err) {
                return cb(err);
            }

            var keysgroup = txObj.asset.multisignature.keysgroup.reduce(function (p, c) {
                if (p.indexOf(c) < 0) p.push(c);
                return p;
            }, []);

            if (keysgroup.length != txObj.asset.multisignature.keysgroup.length) {
                return setImmediate(cb, "Multisignature group contains non-unique public keys");
            }

            setImmediate(cb, null, txObj);
        });
    };

    this.apply = function (txObj, blockObj, sender, cb) {
        privated.unconfirmedSignatures[sender.master_address] = false;

        this.scope.account.merge(sender.master_address, {
            multisignatures: txObj.asset.multisignature.keysgroup,
            multimin: txObj.asset.multisignature.min,
            multilifetime: txObj.asset.multisignature.lifetime,
            blockId: blockObj.id,
            round: library.modules.calc(blockObj.height)
        }, function (err) {
            if (err) {
                return cb(err);
            }

            // Get public keys
            async.eachSeries(txObj.asset.multisignature.keysgroup, function (keyitem, cb) {
                var key = keyitem.substring(1);
                var address = library.modules.accounts.generateAddressByPublicKey(key);

                // Create accounts
                library.modules.accounts.setAccountAndGet({
                    master_address: address,
                    master_pub: key
                }, function (err) {
                    cb(err);
                });
            }, cb);
        });
    };

    this.undo = function (txObj, blockObj, sender, cb) {
        var multiInvert = Diff.reverse(txObj.asset.multisignature.keysgroup);

        privated.unconfirmedSignatures[sender.master_address] = true;
        this.scope.account.merge(sender.master_address, {
            multisignatures: multiInvert,
            multimin: -txObj.asset.multisignature.min,
            multilifetime: -txObj.asset.multisignature.lifetime,
            blockId: blockObj.id,
            round: library.modules.round.calc(blockObj.height)
        }, function (err) {
            cb(err);
        });
    };

    this.applyUnconfirmed = function (txObj, sender, cb) {
        if (privated.unconfirmedSignatures[sender.master_address]) {
            return setImmediate(cb, "Signature on this account is pending confirmation");
        }

        if (sender.multisignatures.length) {
            return setImmediate(cb, "Account already has multisignatures enabled");
        }

        privated.unconfirmedSignatures[sender.master_address] = true;

        this.scope.account.merge(sender.master_address, {
            multisignatures_unconfirmed: txObj.asset.multisignature.keysgroup,
            multimin_unconfirmed: txObj.asset.multisignature.min,
            multilifetime_unconfirmed: txObj.asset.multisignature.lifetime
        }, function (err) {
            cb(err);
        });
    };

    this.undoUnconfirmed = function (txObj, sender, cb) {
        var multiInvert = Diff.reverse(txObj.asset.multisignature.keysgroup);

        privated.unconfirmedSignatures[sender.master_address] = false;
        this.scope.account.merge(sender.master_address, {
            multisignatures_unconfirmed: multiInvert,
            multimin_unconfirmed: -txObj.asset.multisignature.min,
            multilifetime_unconfirmed: -txObj.asset.multisignature.lifetime
        }, function (err) {
            cb(err);
        });
    };

    this.load = function (raw) {
        if (!raw.m_keysgroup) {
            return null;
        } else {
            var multisignature = {
                min: raw.m_min,
                lifetime: raw.m_lifetime,
                keysgroup: raw.m_keysgroup.splite(',')
            };

            return {multisignature: multisignature};
        }
    };

    this.save = function (txObj, cb) {
        this.scope.dbClient.query("INSERT INTO multisignatures (transactionId, min, lifetime, keysgroup) VALUES ($transactionId, $min, $lifetime, $keysgroup)", {
            type: Sequelize.QueryTypes.INSERT,
            bind: {
                transactionId: txObj.id,
                min: txObj.asset.multisignature.min,
                lifetime: txObj.asset.multisignature.lifetime,
                keysgroup: txObj.asset.multisignature.keysgroup.join(',')
            }
        }).then(function (rows) {
            cb();
        }, function (err) {
            cb(err, undefined);
        });
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

Multisignatures.prototype.processSignature = function (txObj, cb) {
    var transaction = library.modules.transactions.getUnconfirmedTransactionById(txObj.transactionId);

    function done(cb) {
        library.balancesWorkQueue.add(function (cb) {
            var transaction = library.modules.transactions.getUnconfirmedTransactionById(txObj.transactionId);

            if (!transaction) {
                return cb("Transaction not found");
            }

            transaction.signatures = transaction.signatures || [];
            transaction.signatures.push(txObj.signature);
            library.notification_center.notify('signature', transaction, true);

            cb();
        }, cb);
    }

    if (!transaction) {
        return cb("Transaction not found");
    }

    if (transaction.type == TransactionTypes.MULTI) {
        transaction.signatures = transaction.signatures || [];

        if (transaction.asset.multisignature.signatures || transaction.signatures.indexOf(txObj.signature) != -1) {
            return cb("Permission to sign transaction is denied");
        }

        // Find public key
        var verify = false;

        try {
            for (var i = 0; i < transaction.asset.multisignature.keysgroup.length && !verify; i++) {
                var key = transaction.asset.multisignature.keysgroup[i].substring(1);
                verify = library.base.transaction.verifySignature(transaction, key, txObj.signature);
            }
        } catch (err) {
            return cb("Failed to verify signature");
        }

        if (!verify) {
            return cb("Failed to verify signature");
        }

        done(cb);
    } else {
        library.modules.accounts.getAccount({
            master_address: transaction.senderId
        }, function (err, account) {
            if (err) {
                return cb("Multisignature account not found");
            }

            var verify = false;
            var multisignatures = account.multisignatures;

            if (transaction.requesterPublicKey) {
                multisignatures.push(transaction.senderPublicKey);
            }

            if (!account) {
                return cb("Account not found");
            }


            transaction.signatures = transaction.signatures || [];

            if (transaction.signatures.indexOf(txObj.signature) >= 0) {
                return cb("Signature is already existed");
            }

            try {
                for (var i = 0; i < multisignatures.length && !verify; i++) {
                    verify = library.base.transaction.verifySecondSignature(transaction, multisignatures[i], tx.signature);
                }
            } catch (err) {
                return cb("Failed to verify signature");
            }

            if (!verify) {
                return cb("Failed to verify signature");
            }

            return done(cb);
        });
    }
};

// Events
Multisignatures.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};

// export
module.exports = Multisignatures;