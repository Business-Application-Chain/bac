var TransactionTypes = require('../utils/transaction-types.js');
// var Router = require('../utils/router.js');
var constants = require('../utils/constants.js');
var ed = require('ed25519');
var ByteBuffer = require("bytebuffer");
var crypto = require('crypto');
var Diff = require('../utils/diff.js');
var async = require('async');
var util = require('util');
var sandboxHelper = require('../utils/sandbox.js');
var Sequelize = require('sequelize');

var modules, library, self, privated = {}, shared = {}, shared_1_0 = {};

function Contact() {
    this.create = function (data, trs) {
        trs.recipientId = null;
        trs.amount = 0;

        trs.asset.contact = {
            address: data.contactAddress
        };

        return trs;
    };

    this.calculateFee = function (trs, sender) {
        return 1 * constants.fixedPoint;
    };

    this.verify = function (trs, sender, cb) {
        if (!trs.asset.contact) {
            return setImmediate(cb, "Invalid transaction asset: " + trs.hash);
        }

        if (!trs.asset.contact.address) {
            return setImmediate(cb, "Invalid transaction asset: " + trs.hash);
        }

        var isAddress = /^[\+|\-][B]+[A-Za-z|0-9]{33}$/; // 判斷地址合法性
        if (!isAddress.test(trs.asset.contact.address)) {
            return setImmediate(cb, "Contact is not an address: " + trs.asset.contact.address);
        }

        if (trs.amount !== 0) {
            return setImmediate(cb, "Invalid amount: " + trs.hash);
        }

        if (trs.recipientId) {
            return setImmediate(cb, "Invalid recipient: " + trs.hash);
        }

        self.checkContacts(trs.senderPublicKey, [trs.asset.contact.address], function (err) {
            if (err) {
                return setImmediate(cb, "Account is already a contact");
            }
            setImmediate(cb, err, trs);
        });
    };

    this.process = function (trs, sender, cb) {
        setImmediate(cb, null, trs);
    };

    this.getBytes = function (trs) {
        try {
            var contactAddress = new Buffer(trs.asset.contact.address, 'utf8');

            var bb = new ByteBuffer(contactAddress.length, true);
            for (var i = 0; i < contactAddress.length; i++) {
                bb.writeByte(contactAddress[i]);
            }

            bb.flip();
        } catch (e) {
            throw Error(e.toString());
        }

        return bb.toBuffer()
    };

    this.apply = function (trs, block, sender, cb) {
        this.scope.account.merge(sender.master_address,
            {
                contacts: [trs.asset.contact.address],
                blockHash: block.hash,
                round: library.modules.round.calc(block.height)
            }, function (err) {
                cb(err);
            });
    };

    this.undo = function (trs, block, sender, cb) {
        if(!trs.asset.contact) {
           return cb();
        }
        var contactsInvert = Diff.reverse([trs.asset.contact.address]);

        this.scope.account.merge(sender.master_address, {
            contacts: contactsInvert,
            blockHash: block.hash,
            round: library.modules.round.calc(block.height)
        }, function (err) {
            cb(err);
        });
    };

    this.applyUnconfirmed = function (trs, sender, cb) {
        self.checkUnconfirmedContacts(trs.senderPublicKey, [trs.asset.contact.address], function (err) {
            if (err) {
                return setImmediate(cb, "Account is already a contact");
            }

            this.scope.account.merge(sender.master_address, {
                u_contacts: [trs.asset.contact.address]
            }, function (err) {
                cb(err);
            });
        }.bind(this));
    };

    this.undoUnconfirmed = function (trs, sender, cb) {
        var contactsInvert = Diff.reverse([trs.asset.contact.address]);

        this.scope.account.merge(sender.master_address, {u_contacts: contactsInvert}, function (err) {
            cb(err);
        });
    };

    this.objectNormalize = function (trs) {
        var report = library.schema.validate(trs.asset.contact, {
            type: "object",
            properties: {
                address: {
                    type: "string",
                    minLength: 1
                }
            },
            required: ["address"]
        });

        if (!report) {
            throw Error("Incorrect address in contact transaction: " + library.schema.getLastError());
        }

        return trs;
    };

    this.load = function (raw) {
        if (!raw.c_address) {
            return null;
        } else {
            var contact = {
                address: raw.c_address
            };

            return {contact: contact};
        }
    };

    this.save = function (trs, cb) {
        library.dbClient.query(`INSERT INTO contacts(address, transactionHash) VALUES("${trs.asset.contact.address}", "${trs.hash}")`, {
            type: Sequelize.QueryTypes.INSERT
        }).then(() => {
            return cb();
        }).catch((err) => {
            console.log(err);
            cb(err);
        });
    };

    this.ready = function (trs, sender) {
        if (sender.multisignatures) {
            if (!trs.signatures) {
                return false;
            }
            return trs.signatures.length >= sender.multimin - 1;
        } else {
            return true;
        }
    };
}

// Constructor
function Contacts(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;
    // privated.attachApi();

    library.base.transaction.attachAssetType(TransactionTypes.FOLLOW, new Contact());

    setImmediate(cb, null, self);
}


Contacts.prototype.callApi = function (call, rpcjson, args, cb) {
    var callArgs = [args, cb];
    // execute
    if (rpcjson === '1.0') {
        shared_1_0[call].apply(null, callArgs);
    } else {
        shared_1_0[call].apply(null, callArgs);
    }
};

// private methods
// privated.attachApi = function () {
//     var router = new Router();
//
//     router.use(function (req, res, next) {
//         if (modules) return next();
//         res.status(500).send({success: false, error: "Blockchain is loading"});
//     });
//
//     router.map(shared, {
//         "get /unconfirmed": "getUnconfirmedContacts",
//         "get /": "getContacts",
//         "put /": "addContact",
//         "get /fee": "getFee"
//     });
//
//     router.use(function (req, res) {
//         res.status(500).send({success: false, error: "API endpoint not found"});
//     });
//
//     library.network.app.use('/api/contacts', router);
//     library.network.app.use(function (err, req, res, next) {
//         if (!err) return next();
//         library.log.Error(req.url, err.toString());
//         res.status(500).send({success: false, error: err.toString()});
//     });
// };

// Public methods
Contacts.prototype.checkContacts = function (master_pub, contacts, cb) {
    if (util.isArray(contacts)) {
        library.modules.accounts.setAccountAndGet({master_pub: master_pub}, function (err, account) {
            if (err) {
                return cb(err);
            }
            if (!account) {
                return cb("Account not found");
            }

            for (var i = 0; i < contacts.length; i++) {
                var math = contacts[i][0];
                var contactAddress = contacts[i].slice(1);

                if (math != '+') {
                    return cb("Incorrect math operator");
                }

                if (math == "+" && (account.contacts !== null && account.contacts.indexOf(contactAddress) != -1)) {
                    return cb("Failed to add contact, account already has this contact");
                }
                if (math == "-" && (account.contacts === null || account.contacts.indexOf(contactAddress) === -1)) {
                    return cb("Failed to remove contact, account does not have this contact");
                }
            }

            cb();
        });
    } else {
        setImmediate(cb, "Please provide an array of contacts");
    }
};

Contacts.prototype.checkUnconfirmedContacts = function (publicKey, contacts, cb) {
    var selfAddress = library.modules.accounts.generateAddressByPubKey(publicKey);

    if (util.isArray(contacts)) {
        library.modules.accounts.getAccount({master_address: selfAddress}, function (err, account) {
            if (err) {
                return cb(err);
            }
            if (!account) {
                return cb("Account not found");
            }

            async.eachSeries(contacts, function (contact, cb) {
                var math = contact[0];
                var contactAddress = contact.slice(1);

                if (math != '+') {
                    return cb("Invalid math operator");
                }

                if (contactAddress === selfAddress) {
                	return cb("Unable to add self as contact");
                }

                library.modules.accounts.setAccountAndGet({
                    master_address: contactAddress
                }, function (err) {
                    if (err) {
                        return cb(err);
                    }

                    if (math == "+" && (account.contacts !== null && account.contacts.indexOf(contactAddress) != -1)) {
                        return cb("Failed to add contact, account already has this contact");
                    }
                    if (math == "-" && (account.contacts === null || account.contacts.indexOf(contactAddress) === -1)) {
                        return cb("Failed to remove contact, account does not have this contact");
                    }

                    return cb();
                });
            }, cb);
        });
    } else {
        return setImmediate(cb, "Please provide an array of contacts");
    }
};

Contacts.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
}

// Events
Contacts.prototype.onBind = function (scope) {
    modules = scope;
};

privated.getContacts = function(address, cb) {
    library.dbClient.query(`SELECT master_address, username from accounts as a LEFT JOIN accounts2contacts as b ON (a.master_address =  b.dependentId) WHERE b.accountId="${address}"`,{
        type: Sequelize.QueryTypes.SELECT
    }).then((rows) => {
        cb(null, rows);
    }).catch((err) => {
        cb(err);
    });
};

privated.getContactsCount = function(address, cb) {
    library.dbClient.query(`SELECT count(*) as number from accounts as a LEFT JOIN accounts2contacts as b ON (a.master_address =  b.dependentId) WHERE b.accountId="${address}"`,{
        type: Sequelize.QueryTypes.SELECT
    }).then((rows) => {
        cb(null, rows[0]);
    }).catch((err) => {
        cb(err);
    });
};

shared.getUnconfirmedContacts = function (req, cb) {
    var query = req.body;
    library.schema.validate(query, {
        type: "object",
        properties: {
            publicKey: {
                type: "string",
                format: "publicKey"
            }
        },
        required: ['publicKey']
    }, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        var transactions = modules.transactions.getUnconfirmedTransactionList();

        var contacts = [];
        async.eachSeries(transactions, function (item, cb) {
            if (item.type != TransactionTypes.FOLLOW) {
                return setImmediate(cb);
            }

            if (item.senderPublicKey == query.publicKey) {
                contacts.push(item);
            }

            setImmediate(cb);
        }, function () {
            return cb(null, {contacts: contacts});
        });
    });
};

shared_1_0.contacts = function(params, cb) {
    let publicKey = params[0];
    let address = library.modules.accounts.generateAddressByPubKey(publicKey);
    // let address = params[0];
    privated.getContacts(address, function (err, data) {
        if(err) {
            return cb(err, 14004);
        }
        return cb(null, 200, data);
    });
};

shared_1_0.count = function(params, cb) {
    let publicKey = params[0];
    let address = library.modules.accounts.generateAddressByPubKey(publicKey);
    privated.getContactsCount(address, function (err, data) {
        if(err) {
            return cb(err, 14005);
        }
        return cb(null, 200, data.number);
    });
};

shared_1_0.addContact = function(params, cb) {
    let data = {
        mnemonic: params[0] || '',
        publicKey: params[1] || '',
        following: params[2] || '',
        secondSecret: params[3],
        multisigAccountPublicKey: params[4]
    };
    let username = '';
    let address = '';
    if(!(data.mnemonic && data.publicKey)) {
        return cb("miss secret or publicKey", 11000);
    }
    let keyPair = library.base.account.getKeypair(data.mnemonic);

    if (data.publicKey) {
        if (keyPair.getPublicKeyBuffer().toString('hex') !== data.publicKey) {
            return cb("Invalid passphrase", 13005);
        }
    }
    // var followingAddress = data.following.substring(1, data.following.length);
    var followingAddress = data.following;
    var isAddress = /^[B]+[A-Za-z|0-9]{33}$/;
    var query = {};
    if (isAddress.test(followingAddress)) {
        query.master_address = followingAddress;
    } else {
        query.username = followingAddress;
    }
    library.balancesSequence.add(function (cb) {
        library.modules.accounts.getAccount(query, function (err, following) {
            if (err) {
                return cb(err.toString(), 14001);
            }
            if (!following) {
                return cb("follow account not found", 14002);
            }
            followingAddress = "+" + following.master_address;
            username = following.username;
            address = following.master_address;
            library.modules.accounts.getAccount({master_pub: data.publicKey}, function (err, account) {
                if (err) {
                    return cb(err.toString(), 11000);
                }
                if (!account) {
                    return cb("Invalid account", 13007);
                }
                if (account.secondsign && !data.secondSecret) {
                    return cb("Invalid second passphrase", 13008);
                }
                if (account.secondsign && data.secondSecret) {
                    var secondHash = crypto.createHash('sha256').update(data.secondSecret, 'utf8').digest();
                    var secondKeypair = ed.MakeKeypair(secondHash);
                }
                try {
                    var transaction = library.base.transaction.create({
                        type: TransactionTypes.FOLLOW,
                        sender: account,
                        keypair: keyPair,
                        secondKeypair: secondKeypair,
                        contactAddress: followingAddress,
                        username: account.username
                    });
                } catch (e) {
                    return cb(e.toString(), 14003);
                }
                library.modules.transactions.receiveTransactions([transaction], cb);
            });
        });
    }, function (err, transaction) {
        if (err) {
            return cb(err.toString(), 14003);
        }

        // cb(null, 200, {transaction: transaction[0], user: {username: username, address: address}});
        cb(null, 200, {username: username, master_address: address});
    });
};

// Shared
shared.getContacts = function (req, cb) {
    var query = req.body;
    library.schema.validate(query, {
        type: "object",
        properties: {
            publicKey: {
                type: "string",
                format: "publicKey"
            }
        },
        required: ["publicKey"]
    }, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        query.address = library.modules.accounts.generateAddressByPubKey(query.publicKey);

        library.modules.accounts.getAccount({address: query.address}, function (err, account) {
            if (err) {
                return cb(err.toString());
            }
            if (!account) {
                return cb("Account not found");
            }

            async.series({
                contacts: function (cb) {
                    if (!account.contacts.length) {
                        return cb(null, []);
                    }
                    library.modules.accounts.getAccounts({address: {$in: account.contacts}}, ["address", "username"], cb);
                },
                followers: function (cb) {
                    if (!account.followers.length) {
                        return cb(null, []);
                    }
                    library.modules.accounts.getAccounts({address: {$in: account.followers}}, ["address", "username"], cb);
                }
            }, function (err, res) {
                if (err) {
                    return cb(err.toString());
                }

                var realFollowers = [];
                // Find and remove
                for (var i in res.followers) {
                    var contact = res.contacts.find(function (item) {
                        return item.address == res.followers[i].address;
                    });

                    if (!contact) {
                        realFollowers.push(res.followers[i]);
                    }
                }

                cb(null, {following: res.contacts, followers: realFollowers});
            });
        });
    });
};

shared_1_0.getFee = function (params, cb) {
    cb(null, 200, {fee: 1 * constants.fixedPoint})
};


// Export
module.exports = Contacts;

