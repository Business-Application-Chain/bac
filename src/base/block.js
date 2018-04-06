var async = require('async');
var constants = require('../utils/constants.js');
var genesisblock = null;
var Sequelize = require('sequelize');
var crypto = require('crypto');
var bignum = require('../utils/bignum.js');
var jsonSql = require('../json-sql')({dialect: 'mysql'});
var ed = require('ed25519');
var slots = require('../utils/slots.js');
var ByteBuffer = require('bytebuffer');
var blockStatus = require('../utils/blockStatus.js');

var privated = {};

privated.blockStatus = new blockStatus();

privated.getAddressByPublicKey = function (publicKey) {
    var publicKeyHash = crypto.createHash('sha256').update(publicKey, 'hex').digest();
    var temp = new Buffer[8];
    for (var i = 0; i < 8; i++) {
        temp[i] = publicKeyHash[7 - i];
    }

    var address = bignum.fromBuffer(temp).toString() + "C";
    return address;
};

// constructor
function Block(scope, cb) {
    this.scope = scope;
    genesisblock = this.scope.genesisblock;

    setImmediate(cb, null, this);
}

Block.prototype.calculateFee = function (blockObj) {
    return 10000000;
}

Block.prototype.create = function (data) {
    var transactions = data.transactions.sort(function compare(a, b) { // sort transactions
        if (a.type < b.type) return -1;
        if (a.type > b.type) return 1;
        if (a.amount < b.amount) return -1;
        if (a.amount > b.amount) return 1;
        return 0;
    })

    var nextHeight = (data.previousBlock) ? data.previousBlock.height + 1 : 1;

    var reward = privated.blockStatus.calcReward(nextHeight),
        totalFee = 0, totalAmount = 0, size = 0;

    var blockTransactions = [];
    var payloadHash = crypto.createHash('sha256');

    for (var i = 0; i < transactions.length; i++) {
        var txObj = transactions[i];
        var bytes = this.scope.transaction.getBytes(txObj);

        if (size + bytes.length > constants.maxPayloadLength) { // must less than max size
            break;
        }

        size += bytes.length;

        totalFee += txObj.fee;
        totalAmount += txObj.amount;

        blockTransactions.push(txObj);
        payloadHash.update(bytes);
    }

    var blockObj = {
        version: 0,
        totalAmount: totalAmount,
        totalFee: totalFee,
        reward: reward,
        payloadHash: payloadHash.digest().toString('hex'),
        timestamp: data.timestamp,
        numberOfTransactions: blockTransactions.length,
        payloadLength: size,
        previousBlock: data.previousBlock.id,
        generatorPublicKey: data.keypair.publicKey.toString('hex'),
        transactions: blockTransactions
    };

    try {
        blockObj.blockSignature = this.sign(blockObj, data.keypair);
    } catch (err) {
        throw new Error(err.toString());
    }

    return blockObj;
};

Block.prototype.objectNormalize = function (blockObj) {
    for (var i in blockObj) {
        if (blockObj[i] === null || typeof blockObj[i] === 'undefined') {
            delete blockObj[i];
        }
    }

    var report = this.scope.schema.validate(blockObj, {
        type: 'object',
        properties: {
            id: {
                type: 'string'
            },
            height: {
                type: 'integer'
            },
            blockSignature: {
                type: 'string',
                format: 'signature'
            },
            generatorPublicKey: {
                type: 'string',
                format: 'publicKey'
            },
            numberOfTransactions: {
                type: 'integer'
            },
            payloadHash: {
                type: 'string',
                format: 'hex'
            },
            payloadLength: {
                type: 'integer'
            },
            previousBlock: {
                type: 'string'
            },
            timestamp: {
                type: 'integer'
            },
            totalAmount: {
                type: 'integer',
                minimum: 0
            },
            totalFee: {
                type: 'integer',
                minimum: 0
            },
            reward: {
                type: 'integer',
                minimum: 0
            },
            transactions: {
                type: 'array',
                uniqueItems: true
            },
            version: {
                type: 'integer',
                minimum: 0
            }
        },
        required: ['blockSignature', 'generatorPublicKey', 'numberOfTransactions', 'payloadHash', 'payloadLength', 'timestamp', 'totalAmout', 'totalFee', 'reward', 'transactions', 'version']
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

    return blockObj;
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

Block.prototype.getBytes = function (blockObj, skipSignature, skipSecondSignature) {
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
        bb.writeByte(txObj.type);
        bb.writeInt(txObj.timestamp);

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
    var remove = 64;

    try {
        var data1 = this.getBytes(blockObj);
        var data2 = new Buffer(data1.length - remove);

        for (var i = 0; i < data2.length; i++) {
            data2[i] = data1[i];
        }
        var hash = crypto.createHash('sha256').update(data2).digest();
        var blockSignatureBuffer = new Buffer(blockObj.blockSignature, 'hex');
        var generatorPublicKeyBuffer = new Buffer(blockObj.generatorPublicKey, 'hex');
        var res = ed.Verify(hash, blockSignatureBuffer || ' ', generatorPublicKeyBuffer || ' ');
    } catch (err) {
        throw new Error(err.toString());
    }

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
            generatorId: privated.getAddressByPublicKey(raw.b_generatorPublicKey),
            blockSignature: raw.b_blockSignature,
            confirmations: raw.b_confirmations
        }
        blockoObj.totalForged = (blockObj.totalFee + blockObj.reward);
        return blockObj;
    }
};

Block.prototype.save = function (blockObj, cb) {
    // try {
    //     var payloadHash = new Buffer(block.payloadHash, 'hex');
    //     var generatorPublicKey = new Buffer(block.generatorPublicKey, 'hex');
    //     var blockSignature = new Buffer(block.blockSignature, 'hex');
    // } catch (e) {
    //     return cb(e.toString())
    // }

    this.scope.dbClient.query("INSERT INTO blocks (id, version, timestamp, height, previousBlock, numberOfTransactions, totalAmount, totalFee, reward, payloadLength, payloadHash, generatorPublicKey, blockSignature) VALUES ($id, $version, $timestamp, $height, $previousBlock, $numberOfTransactions, $totalAmount, $totalFee, $reward, $payloadLength, $payloadHash, $generatorPublicKey, $blockSignature)", {
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
        }
    }, cb);
};

// export
module.exports = Block;
