var async = require('async');
var constants = require('../utils/constants.js');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var TransactionTypes = require('../utils/transaction-types.js');

require('array.prototype.find'); // Old node fix

// private objects
var modules_loaded, library, self, privated = {}, shared = {};

function Delegate() {

    this.calculateFee = function (txObj, sender) {
        return 100 * constants.fixedPoint;
    };

    this.create = function (data, txObj) {
        txObj.recipientId = null;
        txObj.amount = 0;
        txObj.asset.delegate = {
            username: data.username || data.sender.username,
            publicKey: data.sender.publicKey
        };

        return txObj;
    };

    this.objectNormalize = function (txObj) {
        var report = library.schema.validate(txObj.asset.delegate, {
            type: 'object',
            properties: {
                publicKey: {
                    type: 'string',
                    format: 'publicKey'
                }
            },
            required: ['publicKey']
        });

        if (!report) {
            throw new Error("Can't verify delegate transaction, incorrect parameters: ", library.schema.getLastError());
        }

        return txObj;
    };

    this.getBytes = function (txObj) {
        if (!txObj.asset.delegate.username) {
            return null;
        }

        try {
            var usernameBuffer = new Buffer(txObj.asset.delegate.username, 'utf8');
        } catch (err) {
            throw new Error(err.toString());
        }

        return usernameBuffer;
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
        setImmediate(cb, null ,txObj);
    };

    this.verify = function (txObj, sender, cb) {
        if (txObj.recipientId) {
            return setImmediate(cb, "Invalid recipient");
        }

        if (txObj.amount !== 0) {
            return setImmediate(cb, "Invalid transaction amount");
        }

        if (!sender.username) {
            if (!txObj.asset.delegate.username) {
                return setImmediate(cb, "Invalid transaction asset");
            }

            var allowSymbols = /^[a-z0-9!@$&_.]+$/g;
            if (!allowSymbols.test(txObj.asset.delegate.username.toLowerCase())) {
                return setImmediate(cb, "Username contains invalid characters");
            }

            var isAddress = /^[0-9]+[L|l]$/g;
            if (isAddress.test(txObj.asset.delegate.username)) {
                return setImmediate(cb, "Username cannot be a potential address");
            }

            if (txObj.asset.delegate.username.length < 1) {
                return setImmediate(cb, "Username is too short. Minimum is 1 character");
            }

            if (txObj.asset.delegate.username.length > 20) {
                return setImmediate(cb, "Username is too long. Maximum is 20 characters");
            }
        } else {
            if (txObj.asset.delegate.username && txObj.asset.delegate.username != sender.username) {
                return cb("Account is already has a username");
            }
        }

        if (sender.isDelegate) {
            return cb("Account is already been a delegate");
        }

        if (sender.username) {
            return cb(null, txObj);
        }

        library.modules.accounts.getAccount({
            username: txObj.asset.delegate.username
        }, function (err, account) {
            if (err) {
                return cb(err);
            }

            if (account) {
                return cb("Username is already existed");
            }

            cb(null, txObj);
        })
    };

    this.apply = function (txObj, blockObj, sender, cb) {
        var data = {
            master_address: sender.master_address,
            isDelegate: 1,
            isDelegate_unconfirmed: 0,
            vote: 0
        };

        if (!sender.name_exist && txObj.asset.delegate.username) {
            data.username_unconfirmed = null;
            data.username = txObj.asset.delegate.username;
        }

        library.modules.accounts.setAccountAndGet(data, cb);
    };

    this.undo = function (txObj, blockObj, sender, cb) {
        var data = {
            master_address: sender.master_address,
            isDelegate: 0,
            isDelegate_unconfirmed: 1
        };

        if (!sender.name_exist && txObj.asset.delegate.username) {
            data.username = null;
            data.username_unconfirmed = txObj.asset.delegate.username;
        }

        library.modules.accounts.setAccountAndGet(data, cb);
    };

    this.applyUnconfirmed = function (txObj, sender, cb) {
        if (sender.username_unconfirmed && txObj.asset.delegate.username && txObj.asset.delegate.username != sender.username_unconfirmed) {
            return cb("Account is already has a username");
        }

        if (sender.isDelegate_unconfirmed) {
            return cb("Account is already been a delegate");
        }

        function done() {
            var data = {
                master_address: sender.master_address,
                isDelegate_unconfirmed: 1,
                isDelegate: 0
            };

            if (!sender.name_exist && txObj.asset.delegate.username) {
                data.username = null;
                data.username_unconfirmed = txObj.asset.delegate.username;
            }

            library.modules.accounts.setAccountAndGet(data, cb);
        }

        if (sender.username) {
            return done();
        }

        library.modules.accounts.getAccount({
            name_unconfirmed: txObj.asset.delegate.username
        }, function (err, account) {
            if (err) {
                return cb(err);
            }

            if (account) {
                return cb("Username is already existed");
            }

            done();
        });
    };

    this.undoUnconfirmed = function (txObj, sender, cb) {
        var data = {
            master_address: sender.master_address,
            isDelegate: 0,
            isDelegate_unconfirmed: 0
        };

        if (!sender.name_exist && txObj.asset.delegate.username) {
            data.username = null;
            data.username_unconfirmed = null;
        }

        library.modules.accounts.setAccountAndGet(data, cb);
    };

    this.load = function (raw) {
        if (!raw.d_username) {
            return null;
        } else {
            var delegate = {
                username: raw.d_username,
                publicKey: raw.t_senderPublicKey,
                master_address: raw.t_senderId
            };

            return {delegate: delegate};
        }
    };

    this.save = function (txObj, cb) {


    };
}

// constructor
function Delegates(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;

    library.base.transaction.attachAssetType(TransactionTypes.DELEGATE, new Delegate());

    setImmediate(cb, null, self);
}

// public methods
Delegates.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

Delegates.prototype.callApi = function (call, args, cb) {
    var callArgs = [args, cb];
    // execute
    shared[call].apply(null, callArgs);
};

Delegates.prototype.generateDelegateList = function (height, cb) {

    cb(null, []);
};

// Events
Delegates.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};

// export
module.exports = Delegates;