var async = require('async');
var constants = require('../utils/constants.js');
var genesisBlock = null;
var Sequelize = require('sequelize');
var bacLib = require('bac-lib');

var library, self, privated = {};

function AccountAssets(scope, cb) {
    library = scope;
    self = this;
    setImmediate(cb, null, this);
}

AccountAssets.prototype.updateAssetBalance = function(transfer, address, cb) {
    self.getAssetsBalance(address, transfer, function (err, assets) {
        if(transfer.amount < 0) {
            if(!assets) {
                return cb('balance is not enough');
            }
            let a = assets.balance + transfer.amount;
            if(a < 0) {
                //余额不足
                return cb('balance is not enough');
            }
        }
        library.dbClient.query(`UPDATE accounts2asset_balance SET balance = balance + ${transfer.amount} WHERE master_address = "${address}" and assetsHash = "${transfer.assetsHash}"`, {
            type:Sequelize.QueryTypes.UPDATE
        }).then((data) => {
            cb();
        }).catch((err) => {
            cb(err);
        });
    });
};

AccountAssets.prototype.addAssetsBalance = function(address, transfers, amount, cb) {
    self.getAssetsBalance(address, transfers, function (err, assetsAccount) {
        if(assetsAccount) {
            self.updateAssetBalance({assetsHash: assetsAccount.assetsHash, amount: amount}, address, cb);
        } else {
            library.dbClient.query('INSERT INTO accounts2asset_balance(assetsHash, assets_name, master_address, balance) VALUE($assetsHash, $assets_name, $master_address, $balance)', {
                type: Sequelize.QueryTypes.INSERT,
                bind: {
                    assetsHash: transfers.assetsHash,
                    master_address: address,
                    balance: amount,
                    assets_name: transfers.assetsName
                }
            }).then(() => {
                 cb();
            }).catch((err) => {
                cb(err);
            });
        }
    });
};

AccountAssets.prototype.removeAssetsBalance = function(address, transfers, cb) {
    library.dbClient.query('DELETE FROM accounts2asset_balance WHERE master_address = $address and assetsHash = $assetsHash', {
        type: Sequelize.QueryTypes.DELETE,
        bind: {
            address: address,
            assetsHash: transfers.assetsHash
        }
    }).then(() => {
        cb();
    }).catch((err) => {
        cb(err);
    });
};

AccountAssets.prototype.getAssetsBalance = function(address, transfer, cb) {
    let sql = `SELECT * FROM accounts2asset_balance WHERE assetsHash = "${transfer.assetsHash}" AND master_address = "${address}"`;
    library.dbClient.query(sql,{
        type: Sequelize.QueryTypes.SELECT
    }).then((rows) => {
        if(rows[0]) {
            return cb(null, rows[0]);
        } else {
            return cb('not find the assetsHash to address ');
        }
    }).catch((err) => {
        return cb(err);
    });
};

AccountAssets.prototype.burnAssetsBalance = function(address, burn, amount, cb) {
    library.dbClient.query('UPDATE account2assets SET burn = burn + $amount WHERE hash = $assetsHash', {
        type: Sequelize.QueryTypes.UPDATE,
        bind: {
            amount: amount,
            assetsHash: burn.assetsHash
        }
    }).then(() => {
        cb();
    }).catch((err) => {
        cb(err);
    });
};

module.exports = AccountAssets;
