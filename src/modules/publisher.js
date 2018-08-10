var constants = require('../utils/constants.js');
var Sequelize = require('sequelize');
var TransactionTypes = require('../utils/transaction-types.js');
var bacLib = require('bac-lib');
var errorCode = require('../utils/error-code.js');
var crypto = require('crypto');
var ed = require('ed25519');


// private objects
var modules_loaded, library, self, privated = {}, shared_1_0 = {};

function Publishers(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;
    library.base.transaction.attachAssetType(TransactionTypes.PUBLISHER, new Publisher());
    setImmediate(cb, null, self);
}

function Publisher() {

    this.calculateFee = function (txObj, sender) {
        return 100 * constants.fixedPoint;
    };

    this.create = function (data, txObj) {
        txObj.recipientId = null;
        txObj.amount = 0;
        let timeSign = bacLib.bacSign.sign(txObj.timestamp.toString(), data.keypair.d.toBuffer(32), 1);
        let hash = crypto.createHash('sha256').update(timeSign).digest().toString('hex');
        txObj.asset.publisher = {
            name: data.name,
            description: data.description,
            hash: hash
        };
        return txObj;
    };

    this.objectNormalize = function (txObj) {
        var report = library.schema.validate(txObj.asset.publisher, {
            object: true,
            properties: {
                name: {
                    type: 'string'
                },
                description: {
                    type: 'string'
                },
                hash: {
                    type: 'string'
                }
            },
            required: ['name', 'description', 'hash']
        });

        if (!report) {
            throw Error("Can't parse signature: " + library.schema.getLastError());
        }
        return txObj;
    };

    this.getBytes = function (txObj) {
        return null;
    };

    this.apply = function (trs, block, sender, cb) {
        setImmediate(cb);
    };

    this.undo = function (trs, block, sender, cb) {
        setImmediate(cb);
    };

    this.applyUnconfirmed = function (trs, sender, cb) {
        setImmediate(cb);
    };

    this.undoUnconfirmed = function (trs, sender, cb) {
        setImmediate(cb);
    };

    this.process = function (txObj, sender, cb) {
        setImmediate(cb, null, txObj);
    };

    this.load = function (raw) {
        if(!(raw.p_name || raw.p_description || raw.p_hash)) {
            return null;
        }
        let publisher = {
            name: raw.p_name,
            description: raw.p_description,
            hash: raw.p_hash,
        };

        return {publisher: publisher};
    };

    this.save = function (trs, cb) {
        let publisherAsset = trs.asset.publisher;
        library.dbClient.query("INSERT INTO account2publisher(transactionHash, hash, name, description, accountId, time) VALUES($transactionHash, $hash, $name, $description, $accountId, $time)", {
            type: Sequelize.QueryTypes.INSERT,
            bind: {
                transactionHash: trs.hash,
                hash: publisherAsset.hash,
                name: publisherAsset.name,
                description: publisherAsset.description,
                accountId: trs.senderId,
                time: trs.timestamp
            }
        }).then(() => {
            return cb();
        }).catch((err) => {
            return cb(err);
        });
    };

    this.verify = function (txObj, sender, cb) {
        if (!txObj.asset.publisher) {
            return setImmediate(cb, "Invalid transaction asset")
        }

        if (txObj.amount !== 0) {
            return setImmediate(cb, "Invalid transaction amount");
        }

        setImmediate(cb, null, txObj);
    };

    this.ready = function (txObj, sender) {
        if (sender.multisignatures) {
            if (!txObj.signatures) {
                return false;
            }

            return txObj.signatures.length >= sender.multisign - 1;
        } else {
            return true;
        }
    }
}

Publishers.prototype.callApi = function (call, rpcjson, args, cb) {
    var callArgs = [args, cb];
    // execute
    if (rpcjson === '1.0') {
        shared_1_0[call].apply(null, callArgs);
    } else {
        shared_1_0[call].apply(null, callArgs);
    }
};

Publishers.prototype.getPublisher = function(hash, accountId, cb) {
    library.dbClient.query(`SELECT * FROM account2publisher where hash = "${hash}" and accountId = "${accountId}"`, {
        type: Sequelize.QueryTypes.SELECT
    }).then((rows) => {
        if(rows[0]) {
            cb(null, rows[0]);
        } else {
            cb('not find');
        }
    }).catch((err) => {
        cb(err);
    });
};

// Events
Publishers.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};

shared_1_0.getFee = function(req, cb) {
    let fee = 100 * constants.fixedPoint;
    return cb(null, fee);
};

shared_1_0.addPublisher = function(params, cb) {
    let name = params[0] || '';
    let description = params[1] || '';
    let mnemonic = params[2] || '';
    let secondSecret = params[3] || '';
    let multisigAccountPublicKey = params[4] || '';

    if(name === '' || description === '' || mnemonic === '') {
        return cb('miss must params', errorCode.server.MISSING_PARAMS);
    }

    let keyPair = library.base.account.getKeypair(mnemonic);
    let publicKey = keyPair.getPublicKeyBuffer().toString('hex');

    library.balancesSequence.add(function(cb) {
        library.dbClient.query(`SELECT count(*) as number FROM account2publisher where name = "${name}"`, {
            type: Sequelize.QueryTypes.SELECT
        }).then((rows) => {
            if(rows[0].number !== 0) {
                return cb("publisher have been registered", 11000);
            }
            library.modules.accounts.getAccount({master_pub: publicKey}, function (err, account) {
                if (err) {
                    return cb(err.toString(), 11000);
                }
                if (!account || !account.master_pub) {
                    return cb("Invalid account", 13007);
                }

                if (account.secondsign && !secondSecret) {
                    return cb("Invalid second passphrase", 13008);
                }

                var secondKeypair = null;

                if (account.secondsign) {
                    var secondHash = crypto.createHash('sha256').update(secondSecret, 'utf8').digest();
                    secondKeypair = ed.MakeKeypair(secondHash);
                }

                try {
                    var transaction = library.base.transaction.create({
                        type: TransactionTypes.PUBLISHER,
                        sender: account,
                        keypair: keyPair,
                        secondKeypair: secondKeypair,
                        name: name,
                        description: description
                    });
                } catch (e) {
                    return cb(e.toString(), 14003);
                }
                library.modules.transactions.receiveTransactions([transaction], cb);
            });
        }).catch((err) => {
            console.log(err);
            return cb("error", 11000);
        });
    }, function (err, transaction) {
        if (err) {
            return cb(err.toString(), 15004);
        }
        return cb(null, 200, {transaction: transaction[0]});
    });

};

module.exports = Publishers;