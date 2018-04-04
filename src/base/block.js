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
privated.getAddressByPublicKey = function (master_pub) {

}

// constructor
function Block(scope, cb) {
    this.scope = scope;
    genesisblock = this.scope.genesisblock;

    setImmediate(cb, null, this);
}

Block.prototype.objectNormalize = function () {

};

Block.prototype.calculateFee = function (block) {
    return 10000000;
}

Block.prototype.create = function (tx_data) {

};

Block.prototype.getId = function (txObj) {

};

Block.prototype.getHash = function (txObj) {

};

Block.prototype.getBytes = function (txObj, skipSignature, skipSecondSignature) {

};

Block.prototype.sign = function () {

};

Block.prototype.verifySignature = function (txObj, master_pub, signature) {

};

Block.prototype.load = function () {

};

Block.prototype.save = function () {

};

// export
module.exports = Block;
