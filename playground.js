let bitcoinjs = require('bitcoinjs-lib');
let bitcoinMessage = require('bitcoinjs-message');
let bip39 = require('bip39');
let crypto = require('crypto');
let bignum = require('./src/utils/bignum.js');

let mnemonic = bip39.generateMnemonic();
mnemonic_string = mnemonic.toString('hex');
let seed = bip39.mnemonicToSeed(mnemonic);
var node = bitcoinjs.HDNode.fromSeedHex(seed);
var keyPair = bitcoinjs.ECPair.fromWIF(node.keyPair.toWIF());
var privateKey = keyPair.d.toBuffer(32);
var pubKey = keyPair.getPublicKeyBuffer();
var redeemScript = bitcoinjs.script.witnessPubKeyHash.output.encode(bitcoinjs.crypto.hash160(pubKey));
var scriptPubKey = bitcoinjs.script.scriptHash.output.encode(bitcoinjs.crypto.hash160(redeemScript));
console.log(scriptPubKey.toString('hex'));
var address111 = bitcoinjs.HDNode.fromSeedBuffer(seed).getAddress();
var address222 = bitcoinjs.address.fromOutputScript(scriptPubKey);

let uuid = require('uuid');
let uid = uuid.v4();

var hash = crypto.createHash('sha256').update(address111, 'hex').digest();
var temp = new Buffer(8);
for (var i = 0; i < 8; i++) {
    temp[i] = hash[7 - i];
}

var address = bignum.fromBuffer(temp).toString() + 'L';

console.log(address111);
console.log(address222);

function rng () { return Buffer.from('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz') }

var litecoin = bitcoinjs.networks.litecoin;
var keyPair1 = bitcoinjs.ECPair.makeRandom({ network: litecoin, rng: rng });
var pubKey1 = keyPair.getPublicKeyBuffer();
console.log(pubKey1.toString('hex').length);
var wif = keyPair1.toWIF();
var address = keyPair1.getAddress();




this.model_accounts2delegates = this.scope.dbClient.define('accounts2delegates', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate: {
            isNumeric: true
        }
    },
    accountId: {
        type: Sequelize.STRING(21),
        allowNull: false,
        validate: {
            isAlphanumeric: true,
            len: [1, 21]
        },
        references: {
            model: this.model_accounts,
            key: 'master_address'
        }
    },
    dependentId: {
        type: Sequelize.STRING(21),
        allowNull: false,
        validate: {
            isAlphanumeric: true,
            len: [1, 21]
        }
    }
}, {
    // no createAt, updateAt properties
    timestamps: false,

    // define table name
    tableName: 'accounts2delegates'
});

this.model_accounts2delegates_unconfirmed = this.scope.dbClient.define('accounts2delegates_unconfirmed', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate: {
            isNumeric: true
        }
    },
    accountId: {
        type: Sequelize.STRING(21),
        allowNull: false,
        validate: {
            isAlphanumeric: true,
            len: [1, 21]
        },
        references: {
            model: this.model_accounts,
            key: 'master_address'
        }
    },
    dependentId: {
        type: Sequelize.STRING(21),
        allowNull: false,
        validate: {
            isAlphanumeric: true,
            len: [1, 21]
        }
    }
}, {
    // no createAt, updateAt properties
    timestamps: false,

    // define table name
    tableName: 'accounts2delegates_unconfirmed'
});

this.model_accounts2multisignatues = this.scope.dbClient.define('accounts2multisignatues', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate: {
            isNumeric: true
        }
    },
    accountId: {
        type: Sequelize.STRING(21),
        allowNull: false,
        validate: {
            isAlphanumeric: true,
            len: [1, 21]
        },
        references: {
            model: this.model_accounts,
            key: 'master_address'
        }
    },
    dependentId: {
        type: Sequelize.STRING(21),
        allowNull: false,
        validate: {
            isAlphanumeric: true,
            len: [1, 21]
        }
    }
}, {
    // no createAt, updateAt properties
    timestamps: false,

    // define table name
    tableName: 'accounts2multisignatues'
});

this.model_accounts2multisignatues_unconfirmed = this.scope.dbClient.define('accounts2multisignatues_unconfirmed', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate: {
            isNumeric: true
        }
    },
    accountId: {
        type: Sequelize.STRING(21),
        allowNull: false,
        validate: {
            isAlphanumeric: true,
            len: [1, 21]
        },
        references: {
            model: this.model_accounts,
            key: 'master_address'
        }
    },
    dependentId: {
        type: Sequelize.STRING(21),
        allowNull: false,
        validate: {
            isAlphanumeric: true,
            len: [1, 21]
        }
    }
}, {
    // no createAt, updateAt properties
    timestamps: false,

    // define table name
    tableName: 'accounts2multisignatues_unconfirmed'
});

this.model_accounts_round = this.scope.dbClient.define('accounts_round', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    master_address: {
        type: Sequelize.STRING(21)
    },
    amount: {
        type: Sequelize.BIGINT(20)
    },
    delegate: {
        type: Sequelize.STRING(64)
    },
    round: {
        type: Sequelize.BIGINT(20)
    }
}, {
    // no createAt, updateAt properties
    timestamps: false,

    // define table name
    tableName: 'accounts_round'
});

