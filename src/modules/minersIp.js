var TransactionTypes = require('../utils/transaction-types');
var constants = require('../utils/constants');
var ip = require('ip');
var Sequelize = require('sequelize');
var modules_loaded, library, self, privated = {}, shared_1_0 = {};
var crypto = require('crypto');

function MinerIp() {
    this.calculateFee = function (txObj, sender) {
        return 1 * constants.fixedPoint;
    };

    this.create = function (data, txObj) {
        txObj.recipientId = null;
        txObj.amount = 0;
        txObj.asset.minerIp = {
            ip: data.ip,
            port: data.port
        };
        return txObj;
    };

    this.objectNormalize = function (txObj) {
        var report = library.schema.validate(txObj.asset.minerIp, {
            type: 'object',
            properties: {
                ip: {
                    type: 'number'
                },
                port: {
                    type: 'number'
                }
            },
            required: ['ip', 'port']
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
        if (!txObj.asset.minerIp) {
            return setImmediate(cb, "Invalid transaction minerIp")
        }

        if (txObj.amount !== 0) {
            return setImmediate(cb, "Invalid transaction amount");
        }

        if (!txObj.asset.minerIp.ip) {
            return setImmediate(cb, "Invalid not find ip");
        }

        setImmediate(cb, null, txObj);
    };

    //同步minerIp到miner中去
    this.apply = function (txObj, blockObj, sender, cb) {
        library.modules.accounts.setAccountAndGet({
            master_pub: sender.master_pub,
            ip: txObj.asset.minerIp.ip,
            port: txObj.asset.minerIp.port
        }, cb);
    };

    this.undo = function (txObj, blockObj, sender, cb) {
        library.modules.accounts.setAccountAndGet({
            master_pub: sender.master_pub,
            ip: 0,
            port: 0
        }, cb);
    };

    this.applyUnconfirmed = function (txObj, sender, cb) {
        library.modules.accounts.setAccountAndGet({
            master_pub: sender.master_pub,
            ip_unconfirmed: txObj.asset.minerIp.ip,
            port_unconfirmed: txObj.asset.minerIp.port,
        }, cb);
    };

    this.undoUnconfirmed = function (txObj, sender, cb) {
        library.modules.accounts.setAccountAndGet({
            master_pub: sender.master_pub,
            ip_unconfirmed: 0,
            port_unconfirmed: 0
        }, cb);
    };

    this.load = function (raw) {
        if (!(raw.min_ip && raw.min_port)) {
            return null;
        } else {
            var minerIp = {
                ip: parseInt(raw.min_ip),
                port: parseInt(raw.min_port)
            };

            return {minerIp: minerIp};
        }
    };

    this.save = function (txObj, cb) {
        library.dbClient.query(`INSERT INTO miner_ip (transactionHash, ip, port, address, publicKey) VALUES ("${txObj.hash}", "${txObj.asset.minerIp.ip}", "${txObj.asset.minerIp.port}", "${txObj.senderId}", "${txObj.senderPublicKey}")`, {
            type: Sequelize.QueryTypes.INSERT,
        }).then(() => {
            setTimeout(() => {
                library.dbClient.query('UPDATE miner SET `ip`=$ip, `port`=$port, `lock`=0 WHERE `address` = $address', {
                    type: Sequelize.QueryTypes.UPDATE,
                    bind: {
                        ip: txObj.asset.minerIp.ip,
                        port: txObj.asset.minerIp.port,
                        publicKey: txObj.senderPublicKey,
                        address: txObj.senderId
                    }
                }).then(() => {
                    library.notification_center.notify('modifyMinerIp');
                    cb();
                }).catch(err => {
                    console.log('err1 -> ', txObj.hash);
                    cb(err);
                });
            }, 300);
        }).catch((err) => {
            console.log('err2 -> ', txObj.hash);
            cb(err);
        });
    };
}

// constructor
function MinersIp(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;
    library.base.transaction.attachAssetType(TransactionTypes.MINER_IP, new MinerIp());
    setImmediate(cb, null, self);
}

MinersIp.prototype.callApi = function (call, rpcjson, args, cb) {
    var callArgs = [args, cb];
    // execute
    if (rpcjson === '1.0') {
        shared_1_0[call].apply(null, callArgs);
    } else {
        shared_1_0[call].apply(null, callArgs);
    }
};

MinersIp.prototype.onModifyMinerIp = function() {
    library.dbClient.query('select * from `miner` where `lock` = 0', {
        type: Sequelize.QueryTypes.SELECT
    }).then((data) => {
        data.forEach(item => {
            item.longIp = ip.fromLong(item.ip);
        });
        library.socket.webSocket.send('201|miners|list|' + JSON.stringify({list: data}))
    }).catch((err) => {
        console.log(err);
    });
};

shared_1_0.setMinerIp = function(params, cb) {
    let query = {
        mnemonic: params[0] || '',
        ip: params[1] || '',
        port: params[2] || 0,
        secondSecret: params[3] || ''
    };
    if(!(query.mnemonic && query.ip && query.port)) {
        return cb('miss must params', 11000);
    }
    let userIp = ip.toLong(query.ip);
    let userPort = query.port;
    if(typeof userPort !== "number") {
        return cb('port must be number', 11000);
    }
    let keyPair = library.base.account.getKeypair(query.mnemonic);
    let publicKey = keyPair.getPublicKeyBuffer().toString('hex');
    library.balancesSequence.add(function (cb) {
        library.modules.accounts.getAccount({master_pub: publicKey}, function (err, account) {
            if (err) {
                return cb(err.toString(), 11003);
            }
            if (!account || !account.master_pub) {
                return cb("Invalid account", 13007);
            }

            if (account.secondsign && !query.secondSecret) {
                return cb("Invalid second passphrase", 13008);
            }

            if(!account.isDelegate) {
                return cb("only miner can set ip", 13009);
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
                    type: TransactionTypes.MINER_IP,
                    ip: userIp,
                    port: userPort,
                    sender: account,
                    keypair: keyPair,
                    secondKeypair: secondKeypair
                });
            } catch (e) {
                return cb(e.toString(), 15001);
            }
            library.modules.transactions.receiveTransactions([transaction], cb);
        });
    }, function (err, transaction) {
        if (err) {
            return cb(err.toString(), 15001);
        }

        cb(null, 200, {transaction: transaction[0]});
    });
};

// export
module.exports = MinersIp;
