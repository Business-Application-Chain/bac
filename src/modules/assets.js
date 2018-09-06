var constants = require('../utils/constants.js');
var Sequelize = require('sequelize');
var TransactionTypes = require('../utils/transaction-types.js');
var bacLib = require('bac-lib');
var errorCode = require('../utils/error-code.js');
var crypto = require('crypto');
var ed = require('ed25519');

// private objects
var modules_loaded, library, self, privated = {}, shared_1_0 = {};

function Assets(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;
    library.base.transaction.attachAssetType(TransactionTypes.ASSETS, new Asset());
    setImmediate(cb, null, self);
}

function Asset() {

    this.calculateFee = function (txObj, sender) {
        return 100 * constants.fixedPoint;
    };

    this.create = function (data, txObj) {
        txObj.recipientId = null;
        txObj.amount = 0;
        let timeSign = bacLib.bacSign.sign(txObj.timestamp.toString(), data.keypair.d.toBuffer(32), 1);
        let hash = crypto.createHash('sha256').update(timeSign).digest().toString('hex');
        txObj.asset.assets = {
            name: data.name,
            description: data.description,
            hash: hash,
            decimal: data.decimal,
            total: data.total
        };
        return txObj;
    };

    this.objectNormalize = function (txObj) {

        var report = library.schema.validate(txObj.asset.assets, {
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
                },
                decimal: {
                    type: 'integer'
                },
                total: {
                    type: 'integer'
                }
            },
            required: ['name', 'description', 'hash', 'decimal', 'total']
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
        // setImmediate(cb);
        let assets = trs.asset.assets;
        library.base.accountAssets.addAssetsBalance(trs.senderId, {assetsHash: assets.hash, assetsName: assets.name}, assets.total, cb);
    };

    this.undo = function (trs, block, sender, cb) {
        // setImmediate(cb);
        let assets = trs.asset.assets;
        library.base.accountAssets.removeAssetsBalance(trs.senderId, {assetsHash: assets.hash}, cb);
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
        if(!(raw.a_name || raw.a_description ||  raw.a_hash || raw.a_decimal || raw.a_total)) {
            return null;
        }
        let assets = {
            name: raw.a_name,
            description: raw.a_description,
            hash: raw.a_hash,
            decimal: parseInt(raw.a_decimal),
            total: parseInt(raw.a_total),
        };

        return {assets: assets};
    };

    this.save = function (trs, t) {
        let assets = trs.asset.assets;
        return library.dbClient.query("INSERT INTO account2assets(`hash`, `name`, `description`, `decimal`, `total`, `burn`, `transactionHash`, `time`, `accountId`) VALUES($hash,  $name, $description, $decimal, $total, $burn, $transactionHash, $time, $accountId)", {
            type: Sequelize.QueryTypes.INSERT,
            bind: {
                hash: assets.hash,
                name: assets.name,
                description: assets.description,
                decimal: assets.decimal,
                total: assets.total,
                burn: 0,
                transactionHash: trs.hash,
                time: trs.timestamp,
                accountId: trs.senderId,
            },
            transaction: t
        });
    };

    this.verify = function (txObj, sender, cb) {
        if (!txObj.asset.assets) {
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

Assets.prototype.callApi = function (call, rpcjson, args, cb) {
    var callArgs = [args, cb];
    // execute
    if (rpcjson === '1.0') {
        shared_1_0[call].apply(null, callArgs);
    } else {
        shared_1_0[call].apply(null, callArgs);
    }
};

// Events
Assets.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};

Assets.prototype.getAssets = function(hash, cb) {
    library.dbClient.query(`SELECT * FROM account2assets WHERE hash = "${hash}"`, {
        type: Sequelize.QueryTypes.SELECT
    }).then((assets) => {
        if(assets[0]) {
            cb(null, assets[0]);
        } else {
            cb('not find hash');
        }
    });
};

privated.getAccountAssets = function(address, cb) {
    // WHERE master_address = "${address}"
    library.dbClient.query(`SELECT a.*, b.decimal FROM accounts2asset_balance a left outer join account2assets as b on a.assetsHash = b.hash where a.master_address = "${address}"`, {
        type: Sequelize.QueryTypes.SELECT
    }).then((rows) => {
        cb(null, rows);
    }).catch((err) => {
        cb(err);
    });
};

privated.getAssets = function(address, cb) {
    library.dbClient.query(`SELECT * FROM account2assets WHERE accountId = "${address}"`, {
        type: Sequelize.QueryTypes.SELECT,
    }).then((rows) => {
        cb(null, rows);
    }).catch((err) => {
        cb(err, 11000);
    });
};

shared_1_0.addAssets = function(params, cb) {
    let name = params[0] || '';
    let description = params[1] || '';
    let total = params[2] || 0;
    let decimal = params[3] || 0;
    let mnemonic = params[4] || '';
    let secondSecret = params[5] || '';
    let multisigAccountPublicKey = params[6] || '';
    if(decimal > 18) {
        return cb('decimal is too big', 11000);
    }

    if(name === '' || description === '' || mnemonic === '' || total === 0) {
        return cb('miss must params', errorCode.server.MISSING_PARAMS);
    }

    let keyPair = library.base.account.getKeypair(mnemonic);
    let publicKey = keyPair.getPublicKeyBuffer().toString('hex');

    library.balancesSequence.add(function(cb) {
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
            let lastHeight = library.modules.blocks.getLastBlock().height;
            if(account.lockHeight > lastHeight) {
                return cb("Account is locked", 11000);
            }
            try {
                var transaction = library.base.transaction.create({
                    type: TransactionTypes.ASSETS,
                    sender: account,
                    keypair: keyPair,
                    secondKeypair: secondKeypair,
                    name: name,
                    total: total,
                    decimal: decimal,
                    description: description
                });
            } catch (e) {
                return cb(e.toString(), 14003);
            }
            library.modules.transactions.receiveTransactions([transaction], cb);
        });
    }, function (err, transaction) {
        if (err) {
            return cb(err.toString(), 15004);
        }
        return cb(null, 200, {transaction: transaction[0]});
    });
};

shared_1_0.getAccountAssets = function(params, cb) {
    let accountId = params[0];
    let isAddress = /^[B]+[A-Za-z|0-9]{33}$/;

    if(!isAddress.test(accountId)) {
        return cb('is not address address', 11000);
    }

    privated.getAccountAssets(accountId, function (err, data) {
        if(err) {
            cb(err, 11000);
        } else {
            cb(null, 200, data);
        }
    });
};

shared_1_0.getAssets = function(params, cb) {
    let address = params[0];
    privated.getAssets(address, function (err, data) {
        if(err) {
            cb(err, 11000);
        } else {
            cb(null, 200, data);
        }
    });
};

shared_1_0.getFee = function(params, cb) {
    let fee = 100 * constants.fixedPoint;
    return cb(null, 200, fee);
};

module.exports = Assets;