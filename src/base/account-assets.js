var async = require('async');
var constants = require('../utils/constants.js');
var genesisBlock = null;
var Sequelize = require('sequelize');
var bacLib = require('bac-lib');
var Promise = require('bluebird')

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

AccountAssets.prototype.addDappBalance = function(address, transfers, amount) {
    self.getDappBalance(address, transfers).then((rows) => {
        if(rows[0]) {
            return self.updateDappBalance({assetsHash: rows[0].dappHash, amount: amount}, address);
        } else {
            return library.dbClient.query('INSERT INTO dapp2assets_balances(dappHash, name, symbol, balance, others, accountId) VALUE($dappHash, $name, $symbol, $balance, $others, $accountId)', {
                type: Sequelize.QueryTypes.INSERT,
                bind: {
                    dappHash: transfers.dappHash,
                    name: transfers.name,
                    symbol: transfers.symbol,
                    balance: amount,
                    others: transfers.others,
                    accountId: address
                }
            });
        }
    });
};

AccountAssets.prototype.getDappBalance = function(address, transfers) {
    let sql = `SELECT * FROM dapp2assets_balances WHERE dappHash = "${transfers.dappHash}" AND accountId = "${address}"`;
    return library.dbClient.query(sql,{
        type: Sequelize.QueryTypes.SELECT
    });
};

AccountAssets.prototype.getDappBalances = function(dappHash, senderId, params, gasLimit) {
    let _params = JSON.parse(params);
    let address = [];
    _params.forEach((item) => {
        item = JSON.parse(item);
        if(item.type === "string") {
            address.push('"' + item.data + '"');
        }
    });
    let sql = "SELECT a.*, b.accountId as dappAdmin, b.others as defaultOthers, b.className as className, b.tokenList " +
        "from dapp2assets_balances a LEFT JOIN dapp2assets as b on a.dappHash = b.hash where a.dappHash = $dappHash and " +
        " (a.accountId = $address or a.accountId IN ($searchAddress))";
    return library.dbClient.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            dappHash: dappHash,
            address: senderId,
            searchAddress: address.join(",")
        }
    });
};

AccountAssets.prototype.updateDappBalance = function(transfer, address) {
    return self.getDappBalance(address, transfer).then((rows) => {
        if(!rows[0]) {
            library.dbClient.query(`SELECT * FROM dapp2assets WHERE hash="${transfer.dappHash}"`, {
                type: Sequelize.QueryTypes.SELECT
            }).then((rowss) => {
                return library.dbClient.query("INSERT IGNORE INTO dapp2assets_balances(dappHash, name, symbol, balance, others, accountId) VALUE($dappHash, $name, $symbol, $balance, $others, $accountId)", {
                    type: Sequelize.QueryTypes.INSERT,
                    bind: {
                        dappHash: rowss[0].hash,
                        name: rowss[0].name,
                        symbol: rowss[0].symbol,
                        balance: parseInt(transfer.amount),
                        others: rowss[0].others,
                        accountId: address
                    }
                });
            });
        } else {
            return library.dbClient.query('UPDATE `dapp2assets_balances` SET `balance` = $balance WHERE `accountId` = $accountId and `dappHash` = $dappHash', {
                type: Sequelize.QueryTypes.UPDATE,
                bind: {
                    balance: rows[0].balance + parseInt(transfer.amount),
                    accountId: address,
                    dappHash: transfer.dappHash
                }
            });
        }
    });
};

AccountAssets.prototype.upDateDappBalances = function(balances, dappHash) {
    let address = Object.keys(balances);
    for(let i=0; i<address.length; i++) {
        library.dbSequence.add(function (cb) {
            self.updateDappBalance({dappHash: dappHash, amount: balances[address[i]]}, address[i]).then(() => {
                return cb();
            }).catch(err => {
                return cb(err);
            });
        });
    }
};

AccountAssets.prototype.upDateDappStatuses = function(status, dappHash) {
    let address = Object.keys(status);
    for(let i=0; i<address.length; i++) {
        library.dbSequence.add(function (cb) {
            self.upDateDappStatus({dappHash: dappHash, status: JSON.stringify(status[address[i]])}, address[i]).then(() => {
                return cb();
            }).catch(err => {
                return cb(err);
            });
        });
    }
    // address.forEach((item) => {
    //     p.push(self.upDateDappStatus({dappHash: dappHash, status: JSON.stringify(status[item])}, item));
    // });
    // Promise.all(p).then(() => {
    //     cb();
    // }).catch(err => {
    //     cb(err);
    // })
};

AccountAssets.prototype.upDateDappStatus = function(data, address) {
    self.getDappBalance(address, data).then((rows) => {
        if(!rows[0]) {
            library.dbClient.query(`SELECT * FROM dapp2assets WHERE hash="${data.dappHash}"`, {
                type: Sequelize.QueryTypes.SELECT
            }).then((rows) => {
                return library.dbClient.query("INSERT INTO dapp2assets_balances(dappHash, name, symbol, balance, others, accountId) VALUE($dappHash, $name, $symbol, $balance, $others, $accountId)", {
                    type: Sequelize.QueryTypes.INSERT,
                    bind: {
                        dappHash: data.dappHash,
                        name: rows[0].name,
                        symbol: rows[0].symbol,
                        balance: 0,
                        others: data.status,
                        accountId: address
                    }
                });
            });
        }
    });
    return library.dbClient.query("UPDATE dapp2assets_balances SET others = $status WHERE accountId = $address and dappHash = $dappHash", {
        type: Sequelize.QueryTypes.UPDATE,
        bind: {
            status: data.status,
            address: address,
            dappHash: data.dappHash
        }
    });
};

// AccountAssets.prototype.updateDappBalance = function(transfer, address) {
//     return self.getDappBalance(address, transfer).then((rows) => {
//         if(!rows[0]) {
//             library.dbClient.query(`SELECT * FROM dapp2assets WHERE hash="${transfer.dappHash}"`, {
//                 type: Sequelize.QueryTypes.SELECT
//             }).then((rowss) => {
//                 return library.dbClient.query("INSERT IGNORE INTO dapp2assets_balances(dappHash, name, symbol, balance, others, accountId) VALUE($dappHash, $name, $symbol, $balance, $others, $accountId)", {
//                     type: Sequelize.QueryTypes.INSERT,
//                     bind: {
//                         dappHash: rowss[0].hash,
//                         name: rowss[0].name,
//                         symbol: rowss[0].symbol,
//                         balance: parseInt(transfer.amount),
//                         others: rowss[0].others,
//                         accountId: address
//                     }
//                 });
//             });
//         } else {
//             return library.dbClient.query('UPDATE `dapp2assets_balances` SET `balance` = $balance WHERE `accountId` = $accountId and `dappHash` = $dappHash', {
//                 type: Sequelize.QueryTypes.UPDATE,
//                 bind: {
//                     balance: rows[0].balance + parseInt(transfer.amount),
//                     accountId: address,
//                     dappHash: transfer.dappHash
//                 }
//             });
//         }
//     });
// };

module.exports = AccountAssets;
