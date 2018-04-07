var util = require('util');
var extend = require('extend');
var async = require('async');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var crypto = require('crypto');
var ed = require('ed25519');
var bignum = require('../utils/bignum.js');
var slots = require('../utils/slots.js');
var TransactionTypes = require('../utils/transaction-types.js');
var Diff = require('../utils/diff.js');
var bitcoinJs = require('bitcoinjs-lib');
var bitcoinMessage = require('bitcoinjs-message');
var bip39 = require('bip39');

// private objects
var modules_loaded, library, self, privated = {}, shared = {};

function Vote() {

    this.calculateFee = function (txObj, sender) {
        return 1 * constants.fixedPoint;
    };

    this.create = function (data, txObj) {

    };

    this.objectNormalize = function (txObj) {

    };

    this.getBytes = function (txObj) {

    };

    this.ready = function (txObj, sender) {

    };

    this.process = function (txObj, sender, cb) {

    };

    this.verify = function (txObj, sender, cb) {

    };

    this.apply = function (txObj, blockObj, sender, cb) {

    };

    this.undo = function (txObj, blockObj, sender, cb) {

    };

    this.applyUnconfirmed = function (txObj, sender, cb) {

    };

    this.undoUnconfirmed = function (txObj, sender, cb) {

    };

    this.load = function (raw) {

    };

    this.save = function (txObj, cb) {

    };
}

function Username() {

    this.calculateFee = function (txObj, sender) {
        return 100 * constants.fixedPoint;
    };

    this.create = function (data, txObj) {

    };

    this.objectNormalize = function (txObj) {

    };

    this.getBytes = function (txObj) {

    };

    this.ready = function (txObj, sender) {

    };

    this.process = function (txObj, sender, cb) {

    };

    this.verify = function (txObj, sender, cb) {

    };

    this.apply = function (txObj, blockObj, sender, cb) {

    };

    this.undo = function (txObj, blockObj, sender, cb) {

    };

    this.applyUnconfirmed = function (txObj, sender, cb) {

    };

    this.undoUnconfirmed = function (txObj, sender, cb) {

    };

    this.load = function (raw) {

    };

    this.save = function (txObj, cb) {

    };
}

// constructor
function Accounts(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;

    library.base.transaction.attachAssetType(TransactionTypes.VOTE, new Vote());
    library.base.transaction.attachAssetType(TransactionTypes.USERNAME, new Username());

    setImmediate(cb, null, self);
}

// private methods
privated.generateMnemonic = function () {
    var mnemonic = bip39.generateMnemonic();
    return mnemonic.toString('hex');
};

privated.openAccount = function (mnemonic, cb) {
    var seed = bip39.mnemonicToSeed(mnemonic);
    var node = bitcoinjs.HDNode.fromSeedHex(seed);
    var keyPair = bitcoinjs.ECPair.fromWIF(node.keyPair.toWIF());
    var privateKey = keyPair.d.toBuffer(32);
    var hash = crypto.createHash('sha256').update(privateKey.toString('hex'), 'utf8').digest();
    var keypair = ed.MakeKeypair(hash);

    self.setAccountAndGet({master_pub: keypair.publicKey.toString('hex')}, cb);
};

// public methods
Accounts.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

Accounts.prototype.callApi = function (call, args, cb) {
    var callArgs = [args, cb];
    // execute
    shared[call].apply(null, callArgs);
};

Accounts.prototype.generateAddressByPublicKey = function (publicKey) {
    var publicKeyHash = crypto.createHash('sha256').update(publicKey, 'hex').digest();
    var temp = new Buffer[8];
    for (var i = 0; i < 8; i++) {
        temp[i] = publicKeyHash[7 - i];
    }

    var address = bignum.fromBuffer(temp).toString() + "L";
    if (!address) {
        throw new Error("Invalid public key " + publicKey);
    }

    return address;
};

Accounts.prototype.getAccount = function (filter, fields, cb) {
    if (filter.master_pub) {
        filter.master_address = self.generateAddressByPublicKey(filter.master_pub);
        delete filter.master_pub;
    }

    library.base.account.findOne(filter, fields, cb);
};

Accounts.prototype.getAccountAll = function (filter, fields, cb) {
    library.base.account.findAll(filter, fields, cb);
};

Accounts.prototype.setAccountAndGet = function (fields, cb) {
    var master_address = fields.master_address || null;
    if (master_address === null) {
        if (fileds.master_pub) {
            master_address = self.generateAddressByPublicKey(fields.master_pub);
        } else {
            return cb("Missing master_address and master_pub");
        }
    }
    if (!master_address) {
        throw cb("Invalid master_pub value");
    }
    library.base.account.insertOrUpdate(master_address, fields, function (err) {
        if (err) {
            return cb(err);
        }
        library.base.account.findOne({master_address: master_address}, cb);
    });
};

Accounts.prototype.mergeAccountAndGet = function (fields, cb) {
    var master_address = fields.master_address || null;
    if (master_address === null) {
        if (fileds.master_pub) {
            master_address = self.generateAddressByPublicKey(fields.master_pub);
        } else {
            return cb("Missing master_address and master_pub");
        }
    }
    if (!master_address) {
        throw cb("Invalid master_pub value");
    }
    library.base.account.merge(master_address, fields, cb);
};

// Events
Accounts.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};

// export
module.exports = Accounts;
