var async = require('async');
var contants = require('../utils/contants.js');
var genesisBlock = null;
var Sequelize = require('sequelize');
var crypto = require('crypto');
var bignum = require('../utils/bignum.js');

var privated = {};

// constructor
function Account(scope, cb) {
    this.scope = scope;
    //genesisBlock = library.genesisblock.block;

    this.model_accounts = this.scope.dbClient.define('accounts', {
        id: {
            type: Sequelize.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            validate: {
                isNumeric: true
            }
        },
        uid: {
            type: Sequelize.STRING(32),
            allowNull: false,
            set (val) {
                this.setDataValue('uid', val.replace(new RegExp('-',"gm"),''))
            },
            validate: {
                isAlphanumeric: true,
                len: [32, 32]
            }
        },
        master_pub: {
            type: Sequelize.STRING(34),
            validate: {
                isAlphanumeric: true,
                len: [34, 34]
            }
        },
        master_address: {
            type: Sequelize.STRING(45),
        }
    }, {
        // no createAt, updateAt properties
        timestamps: false,

        // define table name
        tableName: 'accounts'
    });


    setImmediate(cb, null, this);
}

// public methods
Account.prototype.createTables = function (cb) {
    this.model_accounts.sync();

    let bitcoinjs = require('bitcoinjs-lib');
    let bitcoinMessage = require('bitcoinjs-message');
    let bip39 = require('bip39');

    let mnemonic = bip39.generateMnemonic();
    mnemonic_string = mnemonic.toString('hex');
    let seed = bip39.mnemonicToSeed(mnemonic);
    var node = bitcoinjs.HDNode.fromSeedHex(seed);
    var keyPair = bitcoinjs.ECPair.fromWIF(node.keyPair.toWIF());
    var privateKey = keyPair.d.toBuffer(32);
    var address111 = bitcoinjs.HDNode.fromSeedBuffer(seed).getAddress();

    let uuid = require('uuid');
    let uid = uuid.v4();

    var hash = crypto.createHash('sha256').update(address111, 'hex').digest();
    var temp = new Buffer(8);
    for (var i = 0; i < 8; i++) {
        temp[i] = hash[7 - i];
    }

    var address = bignum.fromBuffer(temp).toString() + 'L';

    console.log(address.length);

    this.model_accounts.create({
        uid: uid,
        master_pub: address111,
        master_address: address
    }).then(account => {
        console.log(account);
    })
};

Account.prototype.removeTables = function (cb) {
    this.model_accounts.drop();
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