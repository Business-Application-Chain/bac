var async = require('async');
var contants = require('../utils/contants.js');
var genesisBlock = null;
var Sequelize = require('sequelize');

var privated = {};

// constructor
function Account(scope, cb) {
    this.scope = scope;
    //genesisBlock = library.genesisblock.block;

    this.model = this.scope.dbClient.define('accounts', {
        name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        }
    }, {
        validate: {

        }
    });
    this.scope.dbClient.sync();

    setImmediate(cb, null, this);
}

// public methods
Account.prototype.createTables = function (cb) {

};

Account.prototype.removeTables = function (cb) {

};

Account.prototype.objectNormalize = function (object) {

};

Account.prototype.toHex = function (raw) {

};

Account.prototype.create = function () {

};

Account.prototype.find = function () {

};

Account.prototype.findAll = function () {

};

Account.prototype.update = function () {

};

Account.prototype.remove = function () {

};

// export
module.exports = Account;