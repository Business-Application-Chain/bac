var async = require('async');
var constants = require('../utils/constants.js');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var crypto = require('crypto');
var ed = require('ed25519');
var ByteBuffer = require('bytebuffer');
var slots = require('../utils/slots.js');
var TransactionTypes = require('../utils/transaction-types.js');

// private objects
var modules_loaded, library, self, privated = {}, shared = {};

function Signature() {

    this.calculateFee = function (txObj, sender) {
        return 5 * constants.fixedPoint;
    };

    this.create = function (data, txObj) {
        txObj.recipientId = null;
        txObj.amount = 0;
        txObj.signature = {
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
                    format: 'publicKey'
                }
            },
            required: ['publicKey']
        });

        if (!report) {
            throw new Error("Can't parse signature: " + library.schema.getLastError());
        }

        return txObj;
    };

    this.getBytes = function (txObj) {
        try {
            var publicKeyBuffer = new Buffer(trs.asset.signature.publicKey, 'hex');
            var bb = new ByteBuffer(32, true);

            for (var i = 0; i < publicKeyBuffer.length; i++) {
                bb.writeByte(publicKeyBuffer[i]);
            }

            bb.flip();
        } catch (err) {
            throw new Error(err.toString());
        }

        return bb.toBuffer();
    };

    this.ready = function (txObj, sender) {
        if (sender.multisignatures.length) {
            if (!txObj.signatures) {
                return false;
            }
            return txObj.signatures.length >= sender.multimin - 1;
        } else {
            return true;
        }
    };

    this.process = function (txObj, sender, cb) {
        setImmediate(cb, null, txObj);
    };

    this.verify = function (txObj, sender, cb) {
        if (!txObj.asset.signature) {
            return setImmediate(cb, "Invalid transaction asset");
        }

        if (txObj.amount != 0) {
            return setImmediate(cb, "Invalid transaction amount");
        }

        try {
            if (!txObj.asset.signature.publicKey || new Buffer(txObj.asset.signature.publicKey, 'hex').length != 32) {
                return setImmediate(cb, "Invalid signature length");
            }
        } catch (err) {
            return setImmediate(cb, "Invalid signature hex");
        }

        setImmediate(cb, null, txObj);
    };

    this.apply = function (txObj, blockObj, sender, cb) {
        library.accounts.setAccountAndGet({
            master_address: sender.master_address,
            secondsign: 1,
            secondsign_unconfirmed: 0,
            second_pub: txObj.asset.signature.publicKey
        }, cb);
    };

    this.undo = function (txObj, blockObj, sender, cb) {
        library.accounts.setAccountAndGet({
            master_address: sender.master_address,
            secondsign: 0,
            secondsign_unconfirmed: 1,
            second_pub: null
        }, cb);
    };

    this.applyUnconfirmed = function (txObj, sender, cb) {
        if (sender.secondsign_unconfirmed || sender.secondsign) {
            return setImmediate(cb, "Failed second signature: " + txObj.id);
        }

        library.modules.accounts.setAccountAndGet({master_address: sender.master_address, secondsign_unconfirmed: 1}, cb);
    };

    this.undoUnconfirmed = function (txObj, sender, cb) {
        library.modules.accounts.setAccountAndGet({master_address: sender.master_address, secondsign_unconfirmed: 0}, cb);
    };

    this.load = function (raw) {
        if (!raw.s_publicKey) {
            return null;
        } else {
            var signature = {
                transactionId: raw.t_id,
                publicKey: raw.s_publicKey
            }

            return {signature: signature};
        }
    };

    this.save = function (txObj, cb) {
        this.scope.dbClient.query("INSERT INTO signatures (transactionId, publicKey) VALUES ($transactionId, $publicKey)", {
            type: Sequelize.QueryTypes.INSERT,
            bind: {
                transactionId: txObj.id,
                publicKey: txObj.asset.signature.publicKey
            }
        }).then(function (rows) {
            cb();
        }, function (err) {
            cb(err, undefined);
        });
    };
}

// constructor
function Signatures(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;

    library.base.transaction.attachAssetType(TransactionTypes.SIGNATURE, new Signature());

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