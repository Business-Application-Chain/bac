var TransactionTypes = require('../utils/transaction-types.js');
var constants = require('../utils/constants.js');
var crypto = require('crypto');
// private objects
var modules_loaded, library, self, privated = {}, shared_1_0 = {}, accountKey = {};

function Dapp() {
    this.calculateFee = function (txObj, sender) {
        return 1 * constants.fixedPoint;
    };

    this.create = function (data, txObj) {
        txObj.asset.dapp = {
            contractType: data.contractType
        };
        return txObj;
    };

    this.objectNormalize = function (txObj) {
        var report = library.schema.validate(txObj.asset.username, {
            type: 'object',
            properties: {
                contractType: {
                    type: 'number'
                },
                message: {
                    type: 'string'
                }
            },
            required: ['type', 'message']
        });

        if (!report) {
            throw new Error(library.schema.getLastError());
        }

        return txObj;
    };

    this.getBytes = function (txObj) {
        return null;
    };

    this.ready = function (txObj, sender) {
        if (sender.multisignatures) {
            if (!txObj.signatures) {
                return false;
            }
            return txObj.signatures.length >= sender.multisign_min - 1;
        } else {
            return true;
        }
    };

    this.process = function (txObj, sender, cb) {
        setImmediate(cb, null, txObj);
    };

    this.verify = function (txObj, sender, cb) {
        if (!txObj.asset.dapp) {
            return setImmediate(cb, "Invalid transaction dapp")
        }

        if (txObj.amount !== 0) {
            return setImmediate(cb, "Invalid transaction amount");
        }

        setImmediate(cb, null, txObj);
    };

    //同步minerIp到miner中去
    this.apply = function (txObj, blockObj, sender, cb) {
        setImmediate(cb);
    };
    this.undo = function (txObj, blockObj, sender, cb) {
        setImmediate(cb);
    };
    this.applyUnconfirmed = function (txObj, sender, cb) {
        library.notification_center.notify("newContract", txObj);
        setImmediate(cb);
    };
    this.undoUnconfirmed = function (txObj, sender, cb) {
        setImmediate(cb);

    };
    this.load = function (raw) {
        return null;
    };
    this.save = function (txObj, cb) {
        setImmediate(cb);
    };
}

function Dapps(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;
    library.base.transaction.attachAssetType(TransactionTypes.DAPP, new Dapp());

    setImmediate(cb, null, self);
}

Dapps.prototype.callApi = function (call, rpcjson, args, cb) {
    var callArgs = [args, cb];
    // execute
    if (rpcjson === '1.0') {
        shared_1_0[call].apply(null, callArgs);
    } else {
        shared_1_0[call].apply(null, callArgs);
    }
};

shared_1_0.upDateDapp = function(params, cb) {
    let mnemonic = params[0] || '';
    let contractType = params[1] || 0;
    let secondSecret = params[2] || '';
    let msg = params[3] || '';

    if(!(mnemonic && msg)) {
        return cb("miss must params", 11000);
    }

    let keyPair = library.base.account.getKeypair(mnemonic);
    let publicKey = keyPair.getPublicKeyBuffer().toString('hex');
    let query = {
        master_pub: publicKey
    };
    library.balancesSequence.add(function (cb) {
        library.modules.accounts.getAccount(query, function (err, account) {
            if (err) {
                return cb(err.toString(), 11003);
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
            let lastBlock = library.modules.blocks.getLastBlock();
            let lastBlockHeight = lastBlock.height;
            if(account.lockHeight > lastBlockHeight) {
                return cb("Account is locked", 11000);
            }
            try {
                var transaction = library.base.transaction.create({
                    type: TransactionTypes.DAPP,
                    contractType: contractType,
                    sender: account,
                    message: msg,
                    keypair: keyPair,
                    secondKeypair: secondKeypair,
                });
            } catch (e) {
                return cb(e.toString(), 13009);
            }
            library.modules.transactions.receiveTransactions([transaction], cb);
        });
    }, function (err, transaction) {
        if (err) {
            return cb(err.toString(), 13009);
        }
        cb(null, 200, {transactionHash: transaction[0].hash});
    })
};

module.exports = Dapps;



