var async = require('async');
var constants = require('../utils/constants.js');
var genesisblock = null;
var Sequelize = require('sequelize');
var crypto = require('crypto');
var bignum = require('../utils/bignum.js');
var jsonSql = require('../json-sql')({dialect: 'mysql'});
var ed = require('ed25519');
var ByteBuffer = require('bytebuffer');
var extend = require('util-extend');
var bacLib = require('bac-lib');

// constructor
function Transaction(scope, cb) {
    this.scope = scope;
    genesisblock = this.scope.genesisblock;

    cb && setImmediate(cb, null, this);
}

var privated = {};

privated.types = {};

function calc(height) {
    return Math.floor(height / constants.delegates) + (height % constants.delegates > 0 ? 1 : 0);
}

Transaction.prototype.create = function (data) {
    if (!privated.types[data.type]) {
        throw new Error("Unknown transaction type " + data.type);
    }

    if (!data.sender) {
        throw new Error("Can't find sender");
    }

    if (!data.keypair) {
        throw new Error("Can't find keypair");
    }

    var txObj = {
        type: data.type,
        amount: 0,
        senderId: data.sender.master_address,
        recipientId: data.recipientId || null,
        senderPublicKey: data.sender.master_pub.toString('hex'),
        timestamp: Date.now(),
        asset: {},
    };

    txObj = privated.types[txObj.type].create.call(this, data, txObj);
    txObj.signature = this.sign(txObj, data.keypair);

    if (data.sender.secondsign && data.secondKeypair) {
        txObj.signSignature = this.secondSign(txObj, data.secondKeypair);
    }

    txObj.hash = this.getTrsHash(txObj);

    txObj.fee = privated.types[txObj.type].calculateFee.call(this, txObj, data.sender) || false;
    txObj.message = data.message || '';

    return txObj;
};

Transaction.prototype.attachAssetType = function (typeId, instance) {
    if (instance &&
        typeof instance.create == 'function' && typeof instance.objectNormalize == 'function' &&
        typeof instance.getBytes == 'function' && typeof instance.verify == 'function' &&
        typeof instance.calculateFee == 'function' && typeof instance.load == 'function' &&
        typeof instance.ready == 'function' && typeof instance.process == 'function' &&
        typeof instance.apply == 'function' && typeof instance.undo == 'function' &&
        typeof instance.applyUnconfirmed == 'function' && typeof instance.undoUnconfirmed == 'function') {

        privated.types[typeId] = instance;
    } else {
        throw new Error("Invalid instance interface");
    }
};

Transaction.prototype.objectNormalize = function (txObj) {
    if (!privated.types[txObj.type]) {
        throw new Error("Unknown transaction type " + txObj.type);
    }

    for (var i in txObj) {
        if (txObj[i] === null || typeof txObj[i] === 'undefined') {
            delete txObj[i];
        }
    }

    var report = this.scope.schema.validate(txObj, {
        type: 'object',
        properties: {
            id: {
                type: 'string'
            },
            height: {
                type: 'integer'
            },
            blockHash: {
                type: 'string'
            },
            type: {
                type: 'integer'
            },
            timestamp: {
                type: 'integer'
            },
            senderPublicKey: {
                type: 'string',
            },
            requesterPublicKey: {
                type: 'string',
            },
            senderId: {
                type: 'string'
            },
            recipientId: {
                type: 'string'
            },
            senderUsername: {
                type: 'string'
            },
            recipientIdUsername: {
                type: 'string'
            },
            amount: {
                type: 'integer',
                minimum: 0,
                maximum: constants.totalAmount
            },
            fee: {
                type: 'integer',
                minimum: 0,
                maximum: constants.totalAmount
            },
            signature: {
                type: 'string',
            },
            signSignature: {
                type: 'string',
            },
            asset: {
                type: 'object'
            },
            message: {
                type: 'string'
            }
        },
        required: ['type', 'timestamp', 'senderPublicKey', 'signature']
    });

    if (!report) {
        throw new Error(this.scope.schema.getLastError());
    }

    try {
        txObj = privated.types[txObj.type].objectNormalize.call(this, txObj);
    } catch (err) {
        throw new Error(err.toString());
    }

    return txObj;
};

Transaction.prototype.getHash = function (txObj) {
    return crypto.createHash('sha256').update(this.getBytes(txObj)).digest();
};

Transaction.prototype.getTrsHash = function(txObj) {
    let hash = this.getHash(txObj);
    return hash.toString('hex');
};

Transaction.prototype.getBytes = function (txObj, skipSignature, skipSecondSignature) {
    if (!privated.types[txObj.type]) {
        throw new Error("Unknown transaction type " + txObj.type);
    }

    try {
        var assetBytes = privated.types[txObj.type].getBytes.call(this, txObj, skipSignature, skipSecondSignature);
        var assetSize = assetBytes ? assetBytes.length : 0;

        var bb = new ByteBuffer(1 + 4 + 32 + 32 + 8 + 8 + 64 + 64 + assetSize, true);
        // 1:type
        // 4:timestamp
        // 32:senderPublicKey
        // 32:requesterPublicKey
        // 8:recipientId
        // 8:amount
        // 64:signature
        // 64:secondSignature
        bb.writeByte(txObj.type);
        bb.writeInt(txObj.timestamp);

        // if (txObj.senderPublicKey) {
        var senderPublicKeyBuffer = new Buffer(txObj.senderPublicKey, 'hex');
        for (var i = 0; i < senderPublicKeyBuffer.length; i++) {
            bb.writeByte(senderPublicKeyBuffer[i]);
        }
        // }

        if (txObj.requesterPublicKey) {
            var requesterPublicKeyBuffer = new Buffer(txObj.requesterPublicKey, 'hex');
            for (var i = 0; i < requesterPublicKeyBuffer.length; i++) {
                bb.writeByte(requesterPublicKeyBuffer[i]);
            }
        }

        bb.writeByte(0);
        bb.writeLong(txObj.amount);

        if (assetSize > 0) {
            for (var i = 0; i < assetSize; i++) {
                bb.writeByte(assetBytes[i]);
            }
        }

        if (!skipSignature && txObj.signature) {
            var signatureBuffer = new Buffer(txObj.signature, 'hex');
            for (var i = 0; i < signatureBuffer.length; i++) {
                bb.writeByte(signatureBuffer[i]);
            }
        }

        if (!skipSecondSignature && txObj.signSignature) {
            var signSignatureBuffer = new Buffer(txObj.signSignature, 'hex');
            for (var i = 0; i < signSignatureBuffer.length; i++) {
                bb.writeByte(signSignatureBuffer[i]);
            }
        }

        bb.flip();
    } catch (err) {
        throw new Error(err.toString());
    }
    return bb.toBuffer();
};

Transaction.prototype.ready = function (txObj, sender) {
    if (!privated.types[txObj.type]) {
        throw new Error("Unknown transaction type " + txObj.type);
    }

    if (!sender) {
        return false;
    }

    return privated.types[txObj.type].ready.call(this, txObj, sender);
};

Transaction.prototype.process = function (txObj, sender, requester, cb) {
    if (typeof requester === 'function') { // means only input 3 params
        cb = requester;
    }

    if (!privated.types[txObj.type]) {
        throw new Error("Unknown transaction type " + txObj.type);
    }

    // if (!this.ready(txObj, sender)) {
    //     return setImmediate(cb, "Transaction is not ready: " + txObj.id);
    // }

    try {
        var txHash = this.getTrsHash(txObj);
    } catch (err) {
        return setImmediate(cb, "Invalid transaction id");
    }
    if (txObj.hash && txObj.hash !== txHash) {
        return setImmediate(cb, "Invalid transaction id");
    }

    if (!sender) {
        return setImmediate(cb, "Invalid sender");
    }

    txObj.senderId = sender.master_address;

    // Verify that requester in multisignatures
    if (txObj.requesterPublicKey) {
        if (sender.multisignatures.indexOf(txObj.requesterPublicKey) < 0) {
            return setImmediate(cb, "Failed to verify requester public key as in multisignatures");
        }
    }

    if (txObj.requesterPublicKey) {
        if (!this.verifySignature(txObj, txObj.requesterPublicKey, txObj.signature)) {
            return setImmediate(cb, "Failed to verify request public key as signature");
        }
    } else {
        if (!this.verifySignature(txObj, txObj.senderPublicKey, txObj.signature)) {
            return setImmediate(cb, "Failed to verify sender public key as signature");
        }
    }

    privated.types[txObj.type].process.call(this, txObj, sender, function (err, txObj) {
        if (err) {
            return setImmediate(cb, err);
        }

        this.scope.dbClient.query('SELECT COUNT(hash) AS count FROM transactions WHERE hash = $hash', {
            type: Sequelize.QueryTypes.SELECT,
            bind: {
                hash: txObj.hash
            }
        }).then(function (rows) {
            var res = rows.length && rows[0];

            if (res.count) {
                return cb("Failed to process already confirmed transaction");
            }

            cb(null, txObj);
        }, function (err) {
            cb(err, undefined);
        });
    }.bind(this));
};

Transaction.prototype.sign = function (txObj, keypair) {
    // var hash = this.getHash(txObj);
    // return ed.Sign(hash, keypair).toString('hex');
    let sign = bacLib.bacSign.sign(JSON.stringify(txObj), keypair.d.toBuffer(32), 1).toString('hex');
    return sign;
};

Transaction.prototype.secondSign = function(txObj, keypair) {
    var hash = this.getHash(txObj);
    return ed.Sign(hash, keypair).toString('hex');
};

Transaction.prototype.multisign = function (txObj, kaypair) {
    var bytes = this.getBytes(txObj, true, true);
    var hash = crypto.createHash('sha256').update(bytes).digest();

    return ed.Sign(hash, keypair).toString('hex');
};

Transaction.prototype.verify = function (txObj, sender, requester, cb) {
    if (typeof requester === 'function') {
        cb = requester;
    }

    if (!privated.types[txObj.type]) {
        throw new Error("Unknown transaction type " + txObj.type);
    }

    // Check sender
    if (!sender) {
        return setImmediate(cb, "Invalid sender");
    }

    if (txObj.requesterPublicKey) {
        if (sender.multisignatures.indexOf(txObj.requesterPublicKey) < 0) {
            return setImmediate(cb, "Failed to verify requester public key as in multisignatures");
        }

        if (sender.master_pub != txObj.senderPublicKey) {
            return setImmediate(cb, "Invalid public key");
        }
    }

    // Verify signature
    try {
        var valid = false;

        valid = this.verifyTrsSignature(txObj, txObj.senderPublicKey, txObj.signature);
    } catch (err) {
        return setImmediate(cb, err.toString());
    }

    if (!valid) {
        return setImmediate(cb, "Failed to verify signature");
    }

    // Verify second signature
    if (!txObj.requesterPublicKey && sender.secondsign) {
        try {
            var valid = this.verifySecondSignature(txObj, sender.second_pub, txObj.signSignature);
        } catch (err) {
            return setImmediate(cb, err.toString());
        }
        if (!valid) {
            return setImmediate(cb, "Failed to verify second signature: " + txObj.hash);
        }
    } else if (txObj.requesterPublicKey && requester.secondsign) {
        try {
            var valid = this.verifySecondSignature(txObj, requester.second_pub, txObj.signSignature);
        } catch (err) {
            return setImmediate(cb, err.toString());
        }
        if (!valid) {
            return setImmediate(cb, "Failed to verify second signature: " + txObj.hash);
        }
    }

    // Check that signatures unique
    // if (txObj.signatures && txObj.signatures.length) {
    //     var signatures = txObj.signatures.reduce(function (p, c) {
    //         if (p.indexOf(c) < 0) p.push(c);
    //         return p;
    //     }, []);
    //
    //     if (signatures.length != txObj.signatures.length) {
    //         return setImmediate(cb, "Encountered duplicate signatures");
    //     }
    // }
     //多重签名的验证的
    var multisignatures = sender.multisignatures || sender.multisignatures_unconfirmed;

    if (multisignatures == 0) {
        if (txObj.asset && txObj.asset.multisignature && txObj.asset.multisignature.keysgroup) {

            multisignatures = txObj.asset.multisignature.keysgroup.map(function (key) {
                return key.slice(1);
            });
        }
    }

    if (txObj.requesterPublicKey) {
        multisignatures.push(txObj.senderPublicKey);
    }

    if (txObj.signatures) {
        for (var d = 0; d < txObj.signatures.length; d++) {
            valid = false;

            for (var s = 0; s < multisignatures.length; s++) {
                if (txObj.requesterPublicKey && multisignatures[s] == txObj.requesterPublicKey) {
                    continue;
                }

                if (this.verifySignature(txObj, multisignatures[s], txObj.signatures[d])) {
                    valid = true;
                }
            }

            if (!valid) {
                return setImmediate(cb, "Failed to verify multisignature: " + txObj.hash);
            }
        }
    }

    // Check sender
    if (txObj.senderId !== sender.master_address) {
        return setImmediate(cb, "Invalid sender address: " + txObj.hash);
    }

    // Calculate fee
    var fee = privated.types[txObj.type].calculateFee.call(this, txObj, sender) || false;
    // var fee = privated.types[txObj.type].calculateFee(txObj, sender) || false;
    if (!fee || txObj.fee !== fee) {
        return setImmediate(cb, "Invalid transaction type/fee: " + txObj.hash);
    }

    // Check amount
    if (txObj.amount < 0 || txObj.amount > 100000000 * constants.fixedPoint || String(txObj.amount).indexOf('.') >= 0 || txObj.amount.toString().indexOf('e') >= 0) {
        return setImmediate(cb, "Invalid transaction amount: " + txObj.hash);
    }

    // Check timestamp
    if (txObj.timestamp > Date.now()) { // means the time is later than now
        return setImmediate(cb, "Invalid transaction timestamp");
    }

    // Spec
    privated.types[txObj.type].verify.call(this, txObj, sender, function (err) {
        cb(err);
    });
};

Transaction.prototype.verifySignature = function (txObj, publicKey, signature) {
    if (!privated.types[txObj.type]) {
        throw new Error("Unknown transaction type " + txObj.type);
    }
    if (!signature) return false;
    try {
        let trsJson = this.getTrsJson(txObj);
        var res = this.verifySign(trsJson, txObj.senderId, txObj.signature);
    } catch (err) {
        throw new Error(err.toString());
    }
    return res;
};

Transaction.prototype.getTrsJson = function(txObj) {
    let data = {
        type: txObj.type,
        amount: txObj.amount,
        senderId: txObj.senderId,
        recipientId: txObj.recipientId || null,
        senderPublicKey: txObj.senderPublicKey,
        timestamp: txObj.timestamp,
        asset: txObj.asset
    };
    return JSON.stringify(data);
};

Transaction.prototype.verifySign = function(trsJson, address, signature) {
    let signBuffer = Buffer.from(signature, 'hex');
    let res = bacLib.bacSign.verify(trsJson, address, signBuffer);
    return res;
};

Transaction.prototype.verifyTrsSignature = function(txObj) {

    let data = {
        type: txObj.type,
        amount: txObj.amount,
        senderId: txObj.senderId,
        recipientId: txObj.recipientId || null,
        senderPublicKey: txObj.senderPublicKey,
        timestamp: txObj.timestamp,
        asset: txObj.asset
    };
    let signature = Buffer.from(txObj.signature, 'hex');

    return bacLib.bacSign.verify(JSON.stringify(data), txObj.senderId, signature);
};

Transaction.prototype.verifySecondSignature = function (txObj, publicKey, signSignature) {
    if (!privated.types[txObj.type]) {
        throw new Error("Unknown transaction type " + txObj.type);
    }

    if (!signSignature) return false;

    try {

        var bytes = this.getBytes(txObj, false, true);
        var res = this.verifyBytes(bytes, publicKey, signSignature);
    } catch (err) {
        throw new Error(err.toString());
    }

    return res;
};

Transaction.prototype.getData = function(txObj) {

};

Transaction.prototype.verifyBytes = function (bytes, master_pub, signature) {
    try {
        var data2 = new Buffer(bytes.length);

        for (var i = 0; i < data2.length; i++) {
            data2[i] = bytes[i];
        }

        var hash = crypto.createHash('sha256').update(data2).digest();
        var signatureBuffer = new Buffer(signature, 'hex');
        var publicKeyBuffer = new Buffer(master_pub, 'hex');
        var res = ed.Verify(hash, signatureBuffer || ' ', publicKeyBuffer || ' ');
    } catch (err) {
        throw new Error(err.toString());
    }

    return res;
};

Transaction.prototype.apply = function (txObj, blockObj, sender, cb) {
    if (!privated.types[txObj.type]) {
        throw new Error("Unknown transaction type " + txObj.type);
    }

    if (!this.ready(txObj, sender)) {
        return setImmediate(cb, "Transaction is not ready: " + txObj.hash);
    }

    var amount = txObj.amount + txObj.fee;

    if (sender.balance < amount && txObj.blockHash != genesisblock.block.hash) {
        return setImmediate(cb, "Account [apply-sender] does not have enough token: " + txObj.hash);
    }

    this.scope.account.merge(sender.master_address, {
        balance: -amount,
        blockHash: blockObj.hash,
        round: calc(blockObj.height)
    }, function (err, sender) {
        if (err) {
            return cb(err);
        }

        privated.types[txObj.type].apply.call(this, txObj, blockObj, sender, function (err) {
            if (err) { // once error ocurrs, rollback the balance amount
                this.scope.account.merge(sender.master_address, {
                    balance: amount,
                    blockHash: blockObj.hash,
                    round: calc(blockObj.height)
                }, function (err2) {
                    cb(err2);
                });
            } else {
                setImmediate(cb, err);
            }
        }.bind(this));
    }.bind(this));
};

Transaction.prototype.undoUnconfirmed = function (trs, sender, cb) {
    if (!privated.types[trs.type]) {
        return setImmediate(cb, "Unknown transaction type " + trs.type);
    }

    var amount = trs.amount + trs.fee;

    this.scope.account.merge(sender.master_address, {balance_unconfirmed: amount}, function (err, sender) {
        if (err) {
            return cb(err);
        }

        privated.types[trs.type].undoUnconfirmed.call(this, trs, sender, function (err) {
            if (err) {
                this.scope.account.merge(sender.master_address, {balance_unconfirmed: -amount}, function (err) {
                    cb(err);
                });
            } else {
                setImmediate(cb, err);
            }
        }.bind(this));
    }.bind(this));
};

Transaction.prototype.undo = function (txObj, blockObj, sender, cb) {
    if (!privated.types[txObj.type]) {
        throw new Error("Unknown transaction type " + txObj.type);
    }

    var amount = txObj.amount + txObj.fee;

    this.scope.account.merge(sender.master_address, {
        balance: amount,
        blockHash: blockObj.hash,
        round: calc(blockObj.height)
    }, function (err, sender) {
        if (err) {
            return cb(err);
        }

        privated.types[txObj.type].undo.call(this, txObj, blockObj, sender, function (err) {
            if (err) { // once error ocurrs, rollback the balance amount
                this.scope.account.merge(sender.master_address, {
                    balance: amount,
                    blockHash: blockObj.hash,
                    round: calc(blockObj.height)
                }, function (err2) {
                    cb(err2);
                });
            } else {
                setImmediate(cb, err);
            }
        }.bind(this));
    }.bind(this));
};

Transaction.prototype.applyUnconfirmed = function (txObj, sender, requester, cb) {
    if (typeof requester === 'function') {
        cb = requester;
    }

    if (!privated.types[txObj.type]) {
        throw new Error("Unknown transaction type " + txObj.type);
    }

    if (!txObj.requesterPublicKey && sender.second_pub && !txObj.signSignature && txObj.blockHash != genesisblock.block.hash) {
        return setImmediate(cb, "Failed second signature: " + txObj.hash);
    }

    if (!txObj.requesterPublicKey && !sender.second_pub && (txObj.signSignature && txObj.signSignature.length > 0)) {
        return setImmediate(cb, "Account [applyUnconfirmed-sender] does not have a second public key");
    }

    if (txObj.requesterPublicKey && requester.second_pub && !txObj.signSignature) {
        return setImmediate(cb, "Failed second signature: " + txObj.hash);
    }

    if (txObj.requesterPublicKey && !requester.second_pub && (txObj.signSignature && txObj.signSignature.length > 0)) {
        return setImmediate(cb, "Account [applyUnconfirmed-requester] does not have a second public key");
    }

    var amount = txObj.amount + txObj.fee;

    if (sender.balance_unconfirmed < amount && txObj.blockHash != genesisblock.block.hash) {
        return setImmediate(cb, "Account [applyUnconfirmed-sender] does not have enough token: " + txObj.hash);
    }

    this.scope.account.merge(sender.master_address, {balance_unconfirmed: -amount}, function (err, sender) {
        if (err) {
            return cb(err);
        }

        privated.types[txObj.type].applyUnconfirmed.call(this, txObj, sender, function (err) {
            if (err) { // once error ocurrs, rollback the balance amount
                this.scope.account.merge(sender.master_address, {balance_unconfirmed: amount}, function (err2) {
                    cb(err2);
                });
            } else {
                setImmediate(cb, err);
            }
        }.bind(this));
    }.bind(this));
};

Transaction.prototype.undoUnconfirmed = function (txObj, sender, cb) {
    if (!privated.types[txObj.type]) {
        throw new Error("Unknown transaction type " + txObj.type);
    }

    var amount = txObj.amount + txObj.fee;

    this.scope.account.merge(sender.master_address, {balance_unconfirmed: amount}, function (err, sender) {
        if (err) {
            return cb(err);
        }

        privated.types[txObj.type].undoUnconfirmed.call(this, txObj, sender, function (err) {
            if (err) { // once error ocurrs, rollback the balance amount
                this.scope.account.merge(sender.master_address, {balance_unconfirmed: -amount}, function (err2) {
                    cb(err2);
                });
            } else {
                setImmediate(cb, err);
            }
        }.bind(this));
    }.bind(this));
};

Transaction.prototype.load = function (raw) {
    if (!raw.t_hash) {
        return null;
    } else {
        var txObj = {
            hash: raw.t_hash,
            height: raw.b_height,
            blockHash: raw.b_hash || raw.t_blockHash,
            type: parseInt(raw.t_type),
            timestamp: parseInt(raw.t_timestamp),
            senderPublicKey: raw.t_senderPublicKey,
            requesterPublicKey: raw.t_requesterPublicKey,
            senderId: raw.t_senderId,
            recipientId: raw.t_recipientId,
            senderUsername: raw.t_senderUsername,
            recipientUsername: raw.t_recipientUsername,
            amount: parseInt(raw.t_amount),
            fee: parseInt(raw.t_fee),
            signature: raw.t_signature,
            signSignature: raw.t_signSignature,
            signatures: raw.t_signatures ? raw.t_signatures.split(',') : null,
            confirmations: raw.t_confirmations,
            asset: {}
        }

        if (!privated.types[txObj.type]) {
            throw new Error("Unknown transaction type " + txObj.type);
        }

        var asset = privated.types[txObj.type].load.call(this, raw);

        if (asset) {
            txObj.asset = extend(txObj.asset, asset);
        }

        return txObj;
    }
};

Transaction.prototype.save = function (txObj, t, cb) {
    if (!privated.types[txObj.type]) {
        throw new Error("Unknown transaction type " + txObj.type);
    }

    if (typeof t == 'function') {
        cb = t;
        t = null;
    }

    this.scope.dbClient.query("INSERT INTO transactions (hash, blockHash, type, timestamp, senderPublicKey, requesterPublicKey, senderId, recipientId, senderUsername, recipientUsername, amount, fee, signature, signSignature, signatures, message) VALUES ($hash, $blockHash, $type, $timestamp, $senderPublicKey, $requesterPublicKey, $senderId, $recipientId, $senderUsername, $recipientUsername, $amount, $fee, $signature, $signSignature, $signatures, $message)", {
        bind: {
            hash: txObj.hash,
            blockHash: txObj.blockHash,
            type: txObj.type,
            timestamp: txObj.timestamp,
            senderPublicKey: txObj.senderPublicKey,
            requesterPublicKey: txObj.requesterPublicKey ? txObj.requesterPublicKey : null,
            senderId: txObj.senderId,
            recipientId: txObj.recipientId || null,
            senderUsername: txObj.senderUsername || null,
            recipientUsername: txObj.recipientUsername || null,
            amount: txObj.amount,
            fee: txObj.fee,
            signature: txObj.signature ? txObj.signature : null,
            signSignature: txObj.signSignature ? txObj.signSignature : null,
            signatures: txObj.signatures ? txObj.signatures.join(',') : null,
            message: txObj.message ? txObj.message : ""
        },
        type: Sequelize.QueryTypes.INSERT,
        transaction: t
    }).then(function () {
        privated.types[txObj.type].save.call(this, txObj, cb);
    }, function (err) {
        cb(err, undefined);
    });
};

Transaction.prototype.dbRead = function (raw) {
    if (!raw.t_hash) {
        return null
    } else {
        var tx = {
            hash: raw.t_hash,
            height: parseInt(raw.b_height),
            blockHash: raw.b_hash,
            type: parseInt(raw.t_type),
            timestamp: parseInt(raw.t_timestamp),
            senderPublicKey: raw.t_senderPublicKey,
            requesterPublicKey: raw.t_requesterPublicKey,
            senderId: raw.t_senderId,
            recipientId: raw.t_recipientId,
            senderUsername: raw.t_senderUsername,
            recipientUsername: raw.t_recipientUsername,
            amount: parseInt(raw.t_amount),
            fee: parseInt(raw.t_fee),
            signature: raw.t_signature,
            signSignature: raw.t_signSignature,
            signatures: raw.t_signatures ? raw.t_signatures.split(',') : null,
            confirmations: raw.confirmations,
            asset: {}
        }

        if (!privated.types[tx.type]) {
            throw Error('Unknown transaction type ' + tx.type);
        }

        var asset = privated.types[tx.type].load.call(this, raw);

        if (asset) {
            tx.asset = extend(tx.asset, asset);
        }

        return tx;
    }
};

// export
module.exports = Transaction;

