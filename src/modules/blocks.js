var async = require('async');
var constants = require('../utils/constants.js');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var Sequelize = require('sequelize');
var util = require('util');
var crypto = require('crypto');
var ed = require('ed25519');
var ByteBuffer = require('bytebuffer');
var slots = require('../utils/slots.js');
var TransactionTypes = require('../utils/transaction-types.js');
var blockStatus = require('../utils/blockStatus.js');

require('array.prototype.findindex'); // Old node fix

// private objects
var modules_loaded, library, self, privated = {}, shared = {}, genesisblock = null;

privated.loaded = false;
privated.isActive = false;
privated.lastBlock = {};
privated.blockStatus = new blockStatus();
// @formatter: off
privated.blocksDataFields = {
    'b_id': String,
    'b_version': String,
    'b_timestamp': Number,
    'b_height': Number,
    'b_previousBlock': String,
    'b_numberOfTransactions': String,
    'b_totalAmount': String,
    'b_totalFee': String,
    'b_reward': String,
    'b_payloadLength': String,
    'b_payloadHash': String,
    'b_generatorPublicKey': String,
    'b_blockSignature': String,
    't_id': String,
    't_type': Number,
    't_timestamp': Number,
    't_senderPublicKey': String,
    't_requesterPublicKey': String,
    't_senderId': String,
    't_recipientId': String,
    't_senderUsername': String,
    't_recipientUsername': String,
    't_amount': String,
    't_fee': String,
    't_signature': String,
    't_signSignautre': String,
    't_signatures': String,
    's_publicKey': String,
    'd_username': String,
    'v_votes': String,
    'u_alias': String,
    'm_min': Number,
    'm_lifetime': Number,
    'm_keysgroup': String,
    'dapp_name': String,
    'dapp_description': String,
    'dapp_tags': String,
    'dapp_type': Number,
    'dapp_category': Number,
    'dapp_git': String,
    'dapp_icon': String,
    'dapp_saiAscii': String,
    'dapp_saiIcon': String,
};

// constructor
function Blocks(cb, scope) {
    library = scope;
    genesisblock = library.genesisblock;
    self = this;
    self.__private = privated;

    privated.saveGenesisBlock(function (err) {
        setImmediate(cb, err, self);
    });
}

// private methods
privated.saveGenesisBlock = function (cb) {
    library.dbClient.query("SELECT id FROM blocks WHERE id = $id", {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            id: genesisblock.block.id
        }
    }).then(function (rows) {
        var blockId = rows.length && rows[0].id;

        if (!blockId) {
            privated.saveBlock(genesisblock.block, function (err) {
                if (err) {
                    library.log.Error("saveBlock", "Error", err.toString());
                }

                return cb(err);
            });
        } else {
            return cb();
        }
    }, function (err) {
        cb(err, undefined);
    });
};

privated.saveBlock = function (blockObj, cb) {
    library.dbClient.transaction(function (t) {
        library.base.block.save(blockObj, function (err) {
            if (err) {
                return cb(err);
            }

            // async.eachSeries(blockObj.transactions, function (txObj, cb) {
            //     txObj.blockId = blockObj.id;
            //     library.base.transaction.save(txObj, cb);
            // }, function (err) {
            //     if (err) {
            //         cb(err);
            //     }
            //     cb();
            // });
        });
    }).then(function (data) {
        cb();
    }).catch(function (err) {
        cb(err);
    });
};

privated.deleteBlock = function (blockId, cb) {

};

privated.list = function (filter, cb) {

};

privated.getById = function (blockId, cb) {

};

privated.popLastBlock = function (oldLastBlock, cb) {

};

privated.getIdSequence = function (height, cb) {

};

privated.readDbRows = function (rows) {

};

privated.applyTransaction = function (txObj, blockObj, sender, cb) {

};


// public methods
Blocks.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

Blocks.prototype.callApi = function (call, args, cb) {
    var callArgs = [args, cb];
    // execute
    shared[call].apply(null, callArgs);
};

// Events
Blocks.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};

Blocks.prototype.onReceiveBlock = function (blockObj) {

};

Blocks.prototype.onEnd = function (cb) {

};

// export
module.exports = Blocks;