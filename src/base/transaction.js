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

Transaction.prototype.objectNormalize = function () {

};

Transaction.prototype.create = function (tx_data) {

};

Transaction.prototype.attachAssetType = function (typeId, txObj) {

};

Transaction.prototype.getId = function (txObj) {

};

Transaction.prototype.getHash = function (txObj) {

};

Transaction.prototype.getBytes = function (txObj, skipSignature, skipSecondSignature) {

};

Transaction.prototype.ready = function (txObj, sender) {

};

Transaction.prototype.process = function (txObj, sender, requester, cb) {

};

Transaction.prototype.apply = function () {

};

Transaction.prototype.undo = function () {

};

Transaction.prototype.applyUnconfirmed = function () {

};

Transaction.prototype.undoUnconfirmed = function () {

};

Transaction.prototype.sign = function (keypair, txObj) {

};

Transaction.prototype.multisign = function (keypair, txObj) {

};

Transaction.prototype.verify = function (txObj, sender, requester, cb) {

};

Transaction.prototype.verifySignature = function (txObj, master_pub, signature) {

};

Transaction.prototype.verifySecondSignature = function (txObj, master_pub, signature) {

};

Transaction.prototype.verifyBytes = function (bytes, master_pub, signature) {

};

Transaction.prototype.load = function () {

};

Transaction.prototype.save = function () {

};

// export
module.exports = Transaction;

