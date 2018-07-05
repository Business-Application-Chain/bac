var util = require('util');
var extend = require('extend');
var async = require('async');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var constants = require('../utils/constants.js');
var Sequelize = require('sequelize');

// private objects
var modules_loaded, library, self, privated = {}, shared = {};

function Signature() {

    this.calculateFee = function (txObj, sender) {
        return 5 * constants.fixedPoint;
    };

    this.create = function (data, txObj) {
        txObj.recipientId = null;
        txObj.amount = 0;
        txObj.asset.signature = {
            publicKey: data.secondKeypair.publicKey.toString('hex')
        };

        return txObj;
    };

    this.objectNormalize = function (txObj) {
        var report = library.schema.validate(txObj.asset.signature, {
            object: true,
            properties: {
                publicKey: {
                    type: 'string',
                }
            },
            required: ['publicKey']
        });

        if (!report) {
            throw Error("Can't parse signature: " + library.schema.getLastError());
        }
        return txObj;
    };

    this.getBytes = function (txObj) {
        try {
            var bb = new ByteBuffer(32, true);
            var publicKeyBuffer = new Buffer(txObj.asset.signature.publicKey, 'hex');

            for (var i = 0; i < publicKeyBuffer.length; i++) {
                bb.writeByte(publicKeyBuffer[i]);
            }

            bb.flip();
        } catch (e) {
            throw Error(e.toString());
        }
        return bb.toBuffer();
    };

    this.ready = function (txObj, sender) {
        if (sender.multisignatures.length) {
            if (!txObj.signatures) {
                return false;
            }
            return txObj.signatures.length >= sender.multisign_min - 1;
        } else {
            return true;
        }
    };

    this.process = function (txObj, sender, cb) {
        setImmediate(cb, null, txObj);
    };

    this.verify = function (txObj, sender, cb) {
        if (!txObj.asset.signature) {
            return setImmediate(cb, "Invalid transaction asset")
        }

        if (txObj.amount != 0) {
            return setImmediate(cb, "Invalid transaction amount");
        }

        try {
            if (!txObj.asset.signature.publicKey || new Buffer(txObj.asset.signature.publicKey, 'hex').length != 32) {
                return setImmediate(cb, "Invalid signature length");
            }
        } catch (e) {
            return setImmediate(cb, "Invalid signature hex");
        }

        setImmediate(cb, null, txObj);
    };

    this.apply = function (txObj, blockObj, sender, cb) {
        library.modules.accounts.setAccountAndGet({
            address: sender.master_address,
            secondsign: 1,
            u_secondSignature: 0,
            second_pub: txObj.asset.signature.publicKey
        }, cb);
    };

    this.undo = function (txObj, blockObj, sender, cb) {
        library.modules.accounts.setAccountAndGet({
            address: sender.master_address,
            secondSignature: 0,
            u_secondSignature: 1,
            secondPublicKey: null
        }, cb);
    };

    this.applyUnconfirmed = function (txObj, sender, cb) {
        library.modules.accounts.setAccountAndGet({
            address: sender.master_address,
            secondSignature: 1,
            u_secondSignature: 0,
            secondPublicKey: txObj.asset.signature.publicKey
        }, cb);
    };

    this.undoUnconfirmed = function (txObj, sender, cb) {

    };

    this.load = function (raw) {
        if (!raw.s_publicKey) {
            return null
        } else {
            var signature = {
                transactionId: raw.t_id,
                publicKey: raw.s_publicKey
            }

            return {signature: signature};
        }
    };

    this.save = function (txObj, cb) {
        try {
            var publicKey = new Buffer(txObj.asset.signature.publicKey, 'hex')
        } catch (e) {
            return cb(e.toString())
        }

        library.dbClient.query("INSERT INTO signatures(transactionId, publicKey) VALUES($transactionId, $publicKey)", {
            type: Sequelize.QueryTypes.INSERT,
            bind: {
                transactionId: txObj.id,
                publicKey: publicKey.toString('hex')
            }
        }).then(() => {
            cb();
        }).catch((err) => {
            cb(err);
        });

    };
}

// constructor
function Signatures(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;

    setImmediate(cb, null, self);
}

// public methods
Signatures.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

Signatures.prototype.callApi = function (call, args, cb) {
    var callArgs = [args, cb];
    // execute
    shared[call].apply(null, callArgs);
};

// Events
Signatures.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};

// export
module.exports = Signatures;