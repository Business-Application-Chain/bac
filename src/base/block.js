var async = require('async');
var constants = require('../utils/constants.js');
var genesisblock = null;
var Sequelize = require('sequelize');
var crypto = require('crypto');
var bignum = require('../utils/bignum.js');
var jsonSql = require('../json-sql')({dialect: 'mysql'});
var ed = require('ed25519');
var ByteBuffer = require('bytebuffer');
var blockStatus = require('../utils/blockStatus.js');
var bacLib = require('bac-lib');

var self, privated = {}, library;

privated.blockStatus = new blockStatus();

privated.getAddressByPublicKey = function (publicKey) {
    var publicKeyHash = crypto.createHash('sha256').update(publicKey, 'hex').digest();
    var temp = new Buffer(8);
    for (var i = 0; i < 8; i++) {
        temp[i] = publicKeyHash[7 - i];
    }

    var address = bignum.fromBuffer(temp).toString() + "C";
    return address;
};

// constructor
function Block(scope, cb) {
    this.scope = scope;
    library = scope;
    self = this;
    genesisblock = this.scope.genesisblock;

    setImmediate(cb, null, this);
}

Block.prototype.calculateFee = function (blockObj) {
    return 10000000;
}

Block.prototype.objectNormalize = function (block) {
    for (var i in block) {
        if (block[i] === null || typeof block[i] === 'undefined') {
            delete block[i];
        }
    }

    var report = this.scope.schema.validate(block, {
        type: "object",
        properties: {
            id: {
                type: "string"
            },
            height: {
                type: "integer"
            },
            blockSignature: {
                type: "string",
                // format: "signature"
            },
            generatorPublicKey: {
                type: "string",
            },
            numberOfTransactions: {
                type: "integer"
            },
            payloadHash: {
                type: "string",
                format: "hex"
            },
            payloadLength: {
                type: "integer"
            },
            previousBlock: {
                type: "string"
            },
            timestamp: {
                type: "integer"
            },
            totalAmount: {
                type: "integer",
                minimum: 0
            },
            totalFee: {
                type: "integer",
                minimum: 0
            },
            reward: {
                type: "integer",
                minimum: 0
            },
            transactions: {
                type: "array",
                uniqueItems: true
            },
            version: {
                type: "integer",
                minimum: 0
            }
        },
        required: ['blockSignature', 'generatorPublicKey', 'numberOfTransactions', 'payloadHash', 'payloadLength', 'timestamp', 'totalAmount', 'totalFee', 'reward', 'transactions', 'version']
    });

    if (!report) {
        throw new Error(this.scope.schema.getLastError());
    }

    try {
        for (var i = 0; i < block.transactions.length; i++) {
            block.transactions[i] = this.scope.transaction.objectNormalize(block.transactions[i]);
        }
    } catch (err) {
        throw new Error(err.toString());
    }

    return block;
};

Block.prototype.getId = function (blockObj) {
    var hash = this.getHash(blockObj);
    var temp = new Buffer(8);
    for (var i = 0; i < 8; i++) {
        temp[i] = hash[7 - i];
    }

    var id = bignum.fromBuffer(temp).toString();
    return id;
};

Block.prototype.getHash = function (blockObj) {
    return crypto.createHash('sha256').update(this.getBytes(blockObj)).digest();
};

Block.prototype.dbRead = function (raw) {
    if (!raw.b_id) {
        return null
    } else {
        var block = {
            id: raw.b_id,
            version: parseInt(raw.b_version),
            timestamp: parseInt(raw.b_timestamp),
            height: parseInt(raw.b_height),
            previousBlock: raw.b_previousBlock,
            numberOfTransactions: parseInt(raw.b_numberOfTransactions),
            totalAmount: parseInt(raw.b_totalAmount),
            totalFee: parseInt(raw.b_totalFee),
            reward: parseInt(raw.b_reward),
            payloadLength: parseInt(raw.b_payloadLength),
            payloadHash: raw.b_payloadHash,
            generatorPublicKey: raw.b_generatorPublicKey,
            blockSignature: raw.b_blockSignature,
            // confirmations: raw.b_confirmations
        }
        block.totalForged = (block.totalFee + block.reward);
        return block;
    }
}

Block.prototype.getBytes = function (blockObj) {
    try {
        var bb = new ByteBuffer(4 + 4 + 8 + 4 + 8 + 8 + 8 + 4 + 32 + 32 + 64, true);
        // 4:version
        // 4:timestamp
        // 8:previousBlock
        // 4:numberOfTransactions
        // 8:totalAmount
        // 8:totalFee
        // 8:reward
        // 4:payloadLength
        // 32:payloadHash
        // 32:generatorPublicKey
        // 64:blockSignature
        bb.writeInt(blockObj.version);
        bb.writeInt(blockObj.timestamp);

        if (blockObj.previousBlock) {
            var pb = bignum(blockObj.previousBlock).toBuffer({size: 8});

            for (var i = 0; i < 8; i++) {
                bb.writeByte(pb[i] || 0);
            }
        } else {
            for (var i = 0; i < 8; i++) {
                bb.writeByte(0);
            }
        }

        bb.writeInt(blockObj.numberOfTransactions);

        bb.writeLong(blockObj.totalAmount);
        bb.writeLong(blockObj.totalFee);
        bb.writeLong(blockObj.reward);

        bb.writeInt(blockObj.payloadLength);

        if (blockObj.payloadHash) {
            var payloadHashBuffer = new Buffer(blockObj.payloadHash, 'hex');
            for (var i = 0; i < payloadHashBuffer.length; i++) {
                bb.writeByte(payloadHashBuffer[i]);
            }
        }

        if (blockObj.generatorPublicKey) {
            var generatorPublicKeyBuffer = new Buffer(blockObj.generatorPublicKey, 'hex');
            for (var i = 0; i < generatorPublicKeyBuffer.length; i++) {
                bb.writeByte(generatorPublicKeyBuffer[i]);
            }
        }

        if (blockObj.blockSignature) {
            var blockSignatureBuffer = new Buffer(blockObj.blockSignature, 'hex');
            for (var i = 0; i < blockSignatureBuffer.length; i++) {
                bb.writeByte(blockSignatureBuffer[i]);
            }
        }

        bb.flip();
    } catch (err) {
        throw new Error(err.toString());
    }

    return bb.toBuffer();
};

Block.prototype.sign = function (blockObj, keypair) {
    var hash = this.getHash(blockObj);

    return ed.Sign(hash, keypair).toString('hex');
};

Block.prototype.verifySignature = function (blockObj) {
    let block = {
        version: blockObj.version,
        totalAmount: blockObj.totalAmount,
        totalFee: blockObj.totalFee,
        reward: blockObj.reward,
        payloadHash: blockObj.payloadHash,
        timestamp: blockObj.timestamp,
        numberOfTransactions: blockObj.numberOfTransactions,
        payloadLength: blockObj.payloadLength,
        previousBlock: blockObj.previousBlock,
        generatorPublicKey: blockObj.generatorPublicKey
    };
    let blockSignature = new Buffer(blockObj.blockSignature, 'hex');
    let publicBuffer = Buffer.from(blockObj.generatorPublicKey, 'hex');
    let address = bacLib.bacECpair.fromPublicKeyBuffer(publicBuffer).getAddress();
    let res = bacLib.bacSign.verify(JSON.stringify(block), address, blockSignature);

    return res;
};

Block.prototype.load = function (raw) {
    if (!raw_b_id) {
        return null;
    } else {
        var blockObj = {
            id: raw.b_id,
            version: parseInt(raw.b_version),
            timestamp: parseInt(raw.b_timestamp),
            height: parseInt(raw.b_height),
            previousBlock: raw.b_previousBlock,
            numberOfTransactions: parseInt(raw.b_numberOfTransactions),
            totalAmount: parseInt(raw.b_totalAmount),
            totalFee: parseInt(raw.b_totalFee),
            reward: parseInt(raw.b_reward),
            payloadLength: parseInt(raw.b_payloadLength),
            payloadHash: raw.b_payloadHash,
            generatorPublicKey: raw.b_generatorPublicKey,
            blockSignature: raw.b_blockSignature,
            confirmations: raw.b_confirmations
        }
        blockoObj.totalForged = (blockObj.totalFee + blockObj.reward);
        return blockObj;
    }
};

Block.prototype.save = function (blockObj, t, cb) {
    if (typeof t == 'function') {
        cb = t;
        t = null;
    }

    this.scope.dbClient.query("INSERT INTO blocks (id, version, timestamp, height, previousBlock, numberOfTransactions, totalAmount, totalFee, reward, payloadLength, payloadHash, generatorPublicKey, blockSignature) VALUES ($id, $version, $timestamp, $height, $previousBlock, $numberOfTransactions, $totalAmount, $totalFee, $reward, $payloadLength, $payloadHash, $generatorPublicKey, $blockSignature)", {
        type: Sequelize.QueryTypes.INSERT,
        bind: {
            id: blockObj.id,
            version: blockObj.version,
            timestamp: blockObj.timestamp,
            height: blockObj.height,
            previousBlock: blockObj.previousBlock,
            numberOfTransactions: blockObj.numberOfTransactions,
            totalAmount: blockObj.totalAmount,
            totalFee: blockObj.totalFee,
            reward: blockObj.reward || 0,
            payloadLength: blockObj.payloadLength,
            payloadHash: blockObj.payloadHash,
            generatorPublicKey: blockObj.generatorPublicKey,
            blockSignature: blockObj.blockSignature
        },
        transaction: t
    }).then(function (rows) {
        cb();
    }, function (err) {
        cb(err, undefined);
    });
};

// export
module.exports = Block;
