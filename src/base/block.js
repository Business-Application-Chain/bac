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
var merkle = require('merkle');

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
            hash: {
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
            },
            merkleRoot: {
                type: "string"
            }
        },
        required: ['blockSignature', 'generatorPublicKey', 'numberOfTransactions', 'timestamp', 'totalAmount', 'totalFee', 'reward', 'transactions', 'version', 'merkleRoot']
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

Block.prototype.getBlockHash = function(blockObj) {
    let blockHash = this.getHash(blockObj).toString('hex');
    return blockHash;
};

Block.prototype.verifyMerkle = function(blockObj) {
    if(blockObj.numberOfTransactions === 0) {
        return true;
    }
    let transHash = [];
    for (let i=0; i<blockObj.transactions.length; i++) {
        transHash.push(blockObj.transactions[i].hash);
    }
    transHash.sort();
    if(transHash.length % 2 !== 0) {
        transHash.push(transHash[transHash.length - 1]);
    }
    var sha256tree = merkle('sha256').sync(transHash);
    let result = sha256tree.root() === blockObj.merkleRoot;
    return result;
};

Block.prototype.getHash = function (blockObj) {
    return crypto.createHash('sha256').update(this.getBytes(blockObj)).digest().toString('hex');
};

Block.prototype.dbRead = function (raw) {
    if (!raw.b_hash) {
        return null
    } else {
        var block = {
            hash: raw.b_hash,
            version: parseInt(raw.b_version),
            timestamp: parseInt(raw.b_timestamp),
            height: parseInt(raw.b_height),
            previousBlock: raw.b_previousBlock,
            numberOfTransactions: parseInt(raw.b_numberOfTransactions),
            totalAmount: parseInt(raw.b_totalAmount),
            totalFee: parseInt(raw.b_totalFee),
            reward: parseInt(raw.b_reward),
            generatorPublicKey: raw.b_generatorPublicKey,
            blockSignature: raw.b_blockSignature,
            merkleRoot: raw.b_merkleRoot || '',
            basic: parseInt(raw.b_basic),
            difficulty: raw.b_difficulty,
            decisionSignature: raw.b_decisionSignature,
            minerHash: raw.b_minerHash,
            decisionAddress: raw.b_decisionAddress
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
        // 32:generatorPublicKey
        // 64:blockSignature
        bb.writeInt(blockObj.version);
        bb.writeInt(blockObj.timestamp);

        if (blockObj.previousBlock) {
            var pb = Buffer.from(blockObj.previousBlock, 'hex');
            // var pb = bignum(blockObj.previousBlock).toBuffer({size: 8});

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
        timestamp: blockObj.timestamp,
        numberOfTransactions: blockObj.numberOfTransactions,
        previousBlock: blockObj.previousBlock,
        generatorPublicKey: blockObj.generatorPublicKey,
        merkleRoot: blockObj.merkleRoot || '',
        difficulty: blockObj.difficulty,
        basic: blockObj.basic,
        minerHash: blockObj.minerHash
    };
    let blockSignature = new Buffer(blockObj.blockSignature, 'hex');
    let publicBuffer = Buffer.from(blockObj.generatorPublicKey, 'hex');
    let address = bacLib.bacECpair.fromPublicKeyBuffer(publicBuffer).getAddress();
    let res = bacLib.bacSign.verify(JSON.stringify(block), address, blockSignature);

    if (res) {
        //矿工签名正确
        let decisionSign = new Buffer(blockObj.decisionSignature, 'hex');
        let decisionMsg = {
            blockSignature: blockObj.blockSignature,
            decisionAddress: blockObj.decisionAddress
        };
        // return bacLib.bacSign.verify(JSON.stringify(decisionMsg), blockObj.decisionAddress, decisionSign);
        return true;
    }
    return false;
};

Block.prototype.load = function (raw) {
    if (!raw_b_hash) {
        return null;
    } else {
        var blockObj = {
            hash: raw.b_hash,
            version: parseInt(raw.b_version),
            timestamp: parseInt(raw.b_timestamp),
            height: parseInt(raw.b_height),
            previousBlock: raw.b_previousBlock,
            numberOfTransactions: parseInt(raw.b_numberOfTransactions),
            totalAmount: parseInt(raw.b_totalAmount),
            totalFee: parseInt(raw.b_totalFee),
            reward: parseInt(raw.b_reward),
            generatorPublicKey: raw.b_generatorPublicKey,
            blockSignature: raw.b_blockSignature,
            merkleRoot: raw.b_merkleRoot || '',
            basic: parseInt(raw.b_basic),
            difficulty: raw.b_difficulty,
            decisionSignature: raw.b_decisionSignature,
            minerHash: raw.b_minerHash,
            decisionAddress: raw.b_decisionAddress
        };
        blockObj.totalForged = (blockObj.totalFee + blockObj.reward);
        return blockObj;
    }
};

Block.prototype.save = function (blockObj, cb) {
    return library.dbClient.query("INSERT INTO blocks (hash, version, timestamp, height, previousBlock, numberOfTransactions, totalAmount, totalFee, reward, generatorPublicKey, blockSignature, merkleRoot, difficulty, basic, decisionSignature, decisionAddress, minerHash) VALUES ($hash, $version, $timestamp, $height, $previousBlock, $numberOfTransactions, $totalAmount, $totalFee, $reward, $generatorPublicKey, $blockSignature, $merkleRoot, $difficulty, $basic, $decisionSignature, $decisionAddress, $minerHash)", {
        type: Sequelize.QueryTypes.INSERT,
        bind: {
            hash: blockObj.hash,
            version: blockObj.version,
            timestamp: blockObj.timestamp,
            height: blockObj.height,
            previousBlock: blockObj.previousBlock,
            numberOfTransactions: blockObj.numberOfTransactions,
            totalAmount: blockObj.totalAmount,
            totalFee: blockObj.totalFee,
            reward: blockObj.reward || 0,
            generatorPublicKey: blockObj.generatorPublicKey,
            blockSignature: blockObj.blockSignature,
            merkleRoot: blockObj.merkleRoot,
            basic: blockObj.basic,
            difficulty: blockObj.difficulty,
            decisionSignature: blockObj.decisionSignature,
            decisionAddress: blockObj.decisionAddress,
            minerHash: blockObj.minerHash
        },
    }).then(() => {
        cb();
    }).catch((err) => {
        cb(err);
    });
};

// export
module.exports = Block;
