var async = require('async');
var constants = require('../utils/constants.js');
var genesisBlock = null;
var Sequelize = require('sequelize');
var crypto = require('crypto');
var bignum = require('../utils/bignum.js');
var jsonSql = require('json-sql')();

var privated = {};

// constructor
function Account(scope, cb) {
    this.scope = scope;
    jsonSql.setDialect('mysql'); // 设置方言为Mysql

    setImmediate(cb, null, this);
}

// public methods
Account.prototype.createTables = function (cb) {
    var that = this;
    async.auto({
        model_accounts: function (cb) {
            var accounts = that.scope.dbClient.define('accounts', {
                id: {
                    type: Sequelize.INTEGER(11),
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                    filter: {
                        type: "integer",
                        maxLength: 11,
                        minLength: 1
                    },
                    conv: Boolean,
                    constante: true
                },
                uid: {
                    type: Sequelize.STRING(32),
                    allowNull: false,
                    unique: true,
                    set(val) {
                        this.setDataValue('uid', val.replace(new RegExp('-', "gm"), ''))
                    },
                    filter: {
                        type: "string"
                    },
                    conv: String,
                    constante: true
                },
                master_pub: {
                    type: Sequelize.STRING(66),
                    unique: true,
                    filter: {
                        type: "string"
                    },
                    conv: String,
                    constante: true
                },
                master_address: {
                    type: Sequelize.STRING(21),
                    unique: true,
                    filter: {
                        type: "string"
                    },
                    conv: String,
                    constante: true
                },
                username: {
                    type: Sequelize.STRING(20),
                    filter: {
                        type: "string",
                        maxLength: 20,
                        minLength: 1
                    },
                    conv: String,
                    constante: true
                },
                username_unconfirmed: {
                    type: Sequelize.STRING(20),
                    filter: {
                        type: "string",
                        maxLength: 20,
                        minLength: 1
                    },
                    conv: String,
                    constante: true
                },
                secondsign: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                    filter: {
                        type: "boolean"
                    },
                    conv: Boolean
                },
                secondsign_unconfirmed: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                    filter: {
                        type: "boolean"
                    },
                    conv: Boolean
                },
                second_pub: {
                    type: Sequelize.STRING(66),
                    filter: {
                        type: "string",
                        maxLength: 66,
                        minLength: 1
                    },
                    conv: String,
                    constante: true
                },
                balance: {
                    type: Sequelize.BIGINT(20),
                    defaultValue: 0,
                    filter: {
                        required: true,
                        type: "integer",
                        minimum: 0,
                        maximum: constants.totalAmount
                    },
                    conv: Number
                },
                balance_unconfirmed: {
                    type: Sequelize.BIGINT(20),
                    defaultValue: 0,
                    filter: {
                        required: true,
                        type: "integer",
                        minimum: 0,
                        maximum: constants.totalAmount
                    },
                    conv: Number
                },
                uservote: {
                    type: Sequelize.BIGINT(20),
                    defaultValue: 0,
                    filter: {
                        type: "integer"
                    },
                    conv: Number
                },
                rate: {
                    type: Sequelize.BIGINT(20),
                    defaultValue: 0,
                    filter: {
                        type: "integer"
                    },
                    conv: Number
                },
                delegates: {
                    type: Sequelize.TEXT,
                    filter: {
                        type: "array",
                        uniqueItems: true
                    },
                    conv: Array
                },
                delegates_unconfirmed: {
                    type: Sequelize.TEXT,
                    filter: {
                        type: "array",
                        uniqueItems: true
                    },
                    conv: Array
                },
                createat_block: {
                    type: Sequelize.STRING(20),
                    filter: {
                        type: "string",
                        maxLength: 20,
                        minLength: 1
                    },
                    conv: String
                },
                name_exist: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                    filter: {
                        type: "boolean"
                    },
                    conv: Boolean
                },
                name_exist_unconfirmed: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                    filter: {
                        type: "boolean"
                    },
                    conv: Boolean
                },
                prod_block_num: {
                    type: Sequelize.INTEGER(11),
                    defaultValue: 0,
                    filter: {
                        type: "integer",
                        minimum: -1,
                        maximum: 1
                    },
                    conv: Number
                },
                missed_block_num: {
                    type: Sequelize.INTEGER(11),
                    defaultValue: 0,
                    filter: {
                        type: "integer",
                        minimum: -1,
                        maximum: 1
                    },
                    conv: Number
                },
                multisignatures: {
                    type: Sequelize.TEXT,
                    filter: {
                        type: "array",
                        uniqueItems: true
                    },
                    conv: Array
                },
                multisignatures_unconfirmed: {
                    type: Sequelize.TEXT,
                    filter: {
                        type: "array",
                        uniqueItems: true
                    },
                    conv: Array
                },
                multisign_min: {
                    type: Sequelize.INTEGER(11),
                    defaultValue: 0,
                    filter: {
                        isNumeric: true,
                        min: 0,
                        max: 17
                    },
                    conv: Number
                },
                multisign_min_unconfirmed: {
                    type: Sequelize.INTEGER(11),
                    defaultValue: 0,
                    filter: {
                        isNumeric: true,
                        min: 0,
                        max: 17
                    },
                    conv: Number
                },
                multisign_lifetime: {
                    type: Sequelize.INTEGER(11),
                    defaultValue: 0,
                    filter: {
                        isNumeric: true,
                        min: 1,
                        max: 72
                    },
                    conv: Number
                },
                multisign_lifetime_unconfirmed: {
                    type: Sequelize.INTEGER(11),
                    defaultValue: 0,
                    filter: {
                        isNumeric: true,
                        min: 1,
                        max: 72
                    },
                    conv: Number
                },
                is_delegate: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                    filter: {
                        type: "boolean"
                    },
                    conv: Boolean
                },
                is_delegate_unconfirmed: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                    filter: {
                        type: "boolean"
                    },
                    conv: Boolean
                },
                virgin: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                    filter: {
                        type: "boolean"
                    },
                    conv: Boolean
                },
                fees: {
                    type: Sequelize.BIGINT(20),
                    defaultValue: 0,
                    filter: {
                        type: "integer"
                    },
                    conv: Number
                },
                rewards: {
                    type: Sequelize.BIGINT(20),
                    defaultValue: 0,
                    filter: {
                        type: "integer"
                    },
                    conv: Number
                }
            }, {
                freezeTableName: true,

                // no createAt, updateAt properties
                timestamps: false,

                // define table name
                tableName: 'accounts'
            });

            that.fields = [];
            Object.keys(accounts.attributes).forEach(function (key) {
                var _tmp = {};
                if (accounts.attributes[key].type)
                    that.fields.push({
                         field: key
                    });
            }.bind(that));

            that.filter = {};
            Object.keys(accounts.attributes).forEach(function (key) {
                that.filter[key] = accounts.attributes[key].filter;
            }.bind(that));

            that.binary = [];
            Object.keys(accounts.attributes).forEach(function (key) {
                if (accounts.attributes[key].type == "Binary") {
                    that.binary.push(key);
                }
            }.bind(that));

            that.conv = {};
            Object.keys(accounts.attributes).forEach(function (key) {
                that.conv[key] = accounts.attributes[key].conv;
            }.bind(that));

            that.editable = [];
            Object.keys(accounts.attributes).forEach(function (key) {
                if (!accounts.attributes[key].constante) {
                    that.editable.push(key);
                }
            }.bind(that));

            accounts.sync().then(function () {
                cb(null, accounts);
            }, function (err) {
                that.scope.log.Warn("Account create table if not exists 'accounts'", "Error", err.toString());
            });
        },
        model_accounts2delegates: ['model_accounts', function (scope, cb) {
            var accounts2delegates = that.scope.dbClient.define('accounts2delegates', {
                id: {
                    type: Sequelize.INTEGER(11),
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                    filter: {
                        type: "integer"
                    }
                },
                accountId: {
                    type: Sequelize.STRING(21),
                    allowNull: false
                },
                dependentId: {
                    type: Sequelize.STRING(66),
                    allowNull: false
                }
            }, {
                freezeTableName: true,

                // no createAt, updateAt properties
                timestamps: false,

                // define table name
                tableName: 'accounts2delegates'
            });

            accounts2delegates.sync().then(function () {
                cb(null, accounts2delegates);
            }, function (err) {
                that.scope.log.Warn("Account create table if not exists 'accounts2delegates'", "Error", err.toString());
            });
        }],
        model_accounts2delegates_unconfirmed: ['model_accounts', 'model_accounts2delegates', function (scope, cb) {
            var accounts2delegates_unconfirmed = that.scope.dbClient.define('accounts2delegates_unconfirmed', {
                id: {
                    type: Sequelize.INTEGER(11),
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                    filter: {
                        type: "integer"
                    }
                },
                accountId: {
                    type: Sequelize.STRING(21),
                    allowNull: false
                },
                dependentId: {
                    type: Sequelize.STRING(66),
                    allowNull: false
                }
            }, {
                freezeTableName: true,

                // no createAt, updateAt properties
                timestamps: false,

                // define table name
                tableName: 'accounts2delegates_unconfirmed'
            });

            accounts2delegates_unconfirmed.sync().then(function () {
                cb(null, accounts2delegates_unconfirmed);
            }, function (err) {
                that.scope.log.Warn("Account create table if not exists 'accounts2delegates_unconfirmed'", "Error", err.toString());
            });
        }],
        model_accounts2multisignatues: ['model_accounts', function (scope, cb) {
            var accounts2multisignatues = that.scope.dbClient.define('accounts2multisignatues', {
                id: {
                    type: Sequelize.INTEGER(11),
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                    filter: {
                        type: "integer"
                    }
                },
                accountId: {
                    type: Sequelize.STRING(21),
                    allowNull: false
                },
                dependentId: {
                    type: Sequelize.STRING(66),
                    allowNull: false
                }
            }, {
                freezeTableName: true,

                // no createAt, updateAt properties
                timestamps: false,

                // define table name
                tableName: 'accounts2multisignatues'
            });

            accounts2multisignatues.sync().then(function () {
                cb(null, accounts2multisignatues);
            }, function (err) {
                that.scope.log.Warn("Account create table if not exists 'accounts2multisignatues'", "Error", err.toString());
            });
        }],
        model_accounts2multisignatues_unconfirmed: ['model_accounts', 'model_accounts2multisignatues', function (scope, cb) {
            var accounts2multisignatues_unconfirmed = that.scope.dbClient.define('accounts2multisignatues_unconfirmed', {
                id: {
                    type: Sequelize.INTEGER(11),
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                    filter: {
                        type: "integer"
                    }
                },
                accountId: {
                    type: Sequelize.STRING(21),
                    allowNull: false
                },
                dependentId: {
                    type: Sequelize.STRING(66),
                    allowNull: false
                }
            }, {
                freezeTableName: true,

                // no createAt, updateAt properties
                timestamps: false,

                // define table name
                tableName: 'accounts2multisignatues_unconfirmed'
            });

            accounts2multisignatues_unconfirmed.sync().then(function () {
                cb(null, accounts2multisignatues_unconfirmed);
            }, function (err) {
                that.scope.log.Warn("Account create table if not exists 'accounts2multisignatues_unconfirmed'", "Error", err.toString());
            });
        }],
        model_accounts_round: ['model_accounts', function (scope, cb) {
            var accounts_round = that.scope.dbClient.define('accounts_round', {
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
                    type: Sequelize.STRING(66)
                },
                blockId: {
                    type: Sequelize.STRING(20)
                },
                round: {
                    type: Sequelize.BIGINT(20)
                }
            }, {
                freezeTableName: true,

                // no createAt, updateAt properties
                timestamps: false,

                // define table name
                tableName: 'accounts_round'
            });

            accounts_round.sync().then(function () {
                cb(null, accounts_round);
            }, function (err) {
                that.scope.log.Warn("Account create table if not exists 'accounts_round'", "Error", err.toString());
            });
        }]
    }, function (err, scope) {
        that.models = scope;
        var sql = 'INSERT INTO accounts2delegates_unconfirmed SELECT * FROM accounts2delegates';
        that.scope.dbClient.query(sql)
            .catch(function (err) {
                that.scope.log.Error(err.toString());
            });
        // callback
        setImmediate(cb, null, this);
    }.bind(this));
};

Account.prototype.removeTables = function (cb) {
    var that = this;
    async.waterfall([
        function (cb) {
            that.models.model_accounts.drop().then(function () {
                cb(null);
            }, function (err) {
                that.scope.log.Warn("Account drop table if exists 'accounts'", "Error", err.toString());
            });
        },
        function (cb) {
            that.models.model_accounts2delegates.drop().then(function () {
                cb(null);
            }, function (err) {
                that.scope.log.Warn("Account drop table if exists 'accounts2delegates'", "Error", err.toString());
            });
        },
        function (cb) {
            that.models.model_accounts2delegates_unconfirmed.drop().then(function () {
                cb(null);
            }, function (err) {
                that.scope.log.Warn("Account drop table if exists 'accounts2delegates_unconfirmed'", "Error", err.toString());
            });
        },
        function (cb) {
            that.models.model_accounts2multisignatues.drop().then(function () {
                cb(null);
            }, function (err) {
                that.scope.log.Warn("Account drop table if exists 'accounts2multisignatues'", "Error", err.toString());
            });
        },
        function (cb) {
            that.models.model_accounts2multisignatues_unconfirmed.drop().then(function () {
                cb(null);
            }, function (err) {
                that.scope.log.Warn("Account drop table if exists 'accounts2multisignatues_unconfirmed'", "Error", err.toString());
            });
        },
        function (cb) {
            that.models.model_accounts_round.drop().then(function () {
                cb(null);
            }, function (err) {
                that.scope.log.Warn("Account drop table if exists 'accounts_round'", "Error", err.toString());
            });
        }
    ], function (err, result) {
        that.models = null;
        // callback
        setImmediate(cb, null, this);
    }.bind(this));
};

Account.prototype.objectNormalize = function (account) {
    var report = this.scope.schema.validate(account, {
        object: true,
        properties: this.filter
    });

    if (!report) {
        throw new Error(this.scope.schema.getLastError());
    }

    return account;
};

Account.prototype.toHex = function (raw) {
    this.binary.forEach(function (field) {
        if (raw[field]) {
            raw[field] = new Buffer(raw[field], 'hex');
        }
    });

    return raw;
};

Account.prototype.create = function () {

};

Account.prototype.find = function (filter, fields, cb) {
    if (typeof(fields) == 'function') { // Here is just for cases that only send-in 2 params
        cb = fields;
        fields = this.fields.map(function (field) {
            return field.alias || field.field;
        });
    }

    this.findAll(filter, fields, function (err, data) {
        cb(err, data && data.length ? data[0] : null);
    });
};

Account.prototype.findAll = function (filter, fields, cb) {
    if (typeof(fields) == 'function') { // Here is just for cases that only send-in 2 params
        cb = fields;
        fields = this.fields.map(function (field) {
            return field.alias || field.field;
        });
    }

    var realFields = this.fields.filter(function (field) {
        return fields.indexOf(field.alias || field.field) != -1;
    });

    var realConv = {};
    Object.keys(this.conv).forEach(function (key) {
        if (fields.indexOf(key) != -1) {
            realConv[key] = this.conv[key];
        }
    }.bind(this));

    var limit, offset, order;

    if (filter.limit > 0) {
        limit = filter.limit;
    }
    delete filter.limit;
    if (filter.offset > 0) {
        offset = filter.offet;
    }
    delete filter.offset;
    if (filter.order) {
        order = filter.order;
    }
    delete filter.order;

    this.models.model_accounts.findAll({ where: filter, limit: limit, offset: offset, order: order })
        .then(function (accounts) {
            cb(null, accounts || []);
        }, function (err) {
            this.scope.log.Warn("Account findAll", "Error", err.toString(), "TableName", "accounts");
        });
};

Account.prototype.insertOrUpdate = function (master_address, fields, cb) {
    if (fields.master_pub !== undefined && !fields.master_pub) {
        this.scope.log.Error("Account insertOrUpdate", "master_pub", fields.master_pub);
    }

    fields.master_address = master_address;

    var that = this;

    async.waterfall([
        function (cb) {
            that.models.model_accounts.create(that.toHex(fields))
                .then(function (data) {
                    cb(null);
                }, function (err) {
                    that.scope.log.Warn("Account insertOrUpdate [insert]", "Error", err.toString());
                    cb(null);
                });
        },
        function (cb) {
            that.models.model_accounts.update(that.toHex(fields), {
                where: {
                    master_address: master_address
                }}).then(function (data) {
                    cb(null);
                }, function (err) {
                    that.scope.log.Warn("Account insertOrUpdate [update]", "Error", err.toString());
                    cb(null);
                });
        }
    ], function (err, result) {
        // callback
        setImmediate(cb, null, this);
    }.bind(this));
};

Account.prototype.merge = function (master_address, fields, cb) {
    if (fields.master_pub !== undefined && !fields.master_pub) {
        this.scope.log.Error("Account merge", "master_pub", fields.master_pub);
    }

    var self = this;

    var insert = {}, remove = {}, update = {}, insert_object = {}, remove_object = {}, round = [];

    this.editable.forEach(function (key) {
        if (fields[key]) {
            var value = fields[key];
            switch (self.conv[key]) {
                case String:
                    update[key] = value;
                    break;
                case Number:
                    if (Math.abs(value) === value && value !== 0) {
                        update.$inc = update.$inc || {};
                        update.$inc[key] = value;
                        if (key == 'balance') {
                            round.push({
                                sql: `INSERT INTO accounts_round (master_address, amount, delegate, blockId, round) SELECT ?, ?, dependentId, ?, ? from accounts2delegates WHERE accountId = ?`,
                                replacements: [
                                    master_address,
                                    value,
                                    fields.blockId,
                                    fields.round,
                                    master_address
                                ]
                            });
                            console.log(round[0].sql);
                        }
                    }
                    else if (value < 0) {
                        update.$dec = update.$dec || {};
                        update.$dec[key] = Math.abs(value);
                        if (key == 'balance') {
                            round.push({
                                sql: `INSERT INTO accounts_round (master_address, amount, delegate, blockId, round) SELECT ?, ?, dependentId, ?, ? from accounts2delegates WHERE accountId = ?`,
                                replacements: [
                                    master_address,
                                    value,
                                    fields.blockId,
                                    fields.round,
                                    master_address
                                ]
                            });
                        }
                    }
                    break;
                case Array:
                    if (Object.prototype.toString.call(value[0]) == "[object Object]") {
                        for (var i = 0; i < value.length; i++) {
                            var val = value[i];
                            if (val.action == '-') {
                                delete val.action;
                                remove_object[key] = remove_object[key] || [];
                                remove_object[key].push(val);
                            } else if (val.action == '+') {
                                delete val.action;
                                insert_object[key] = insert_object[key] || [];
                                insert_object[key].push(val);
                            } else {
                                delete val.action;
                                insert_object[key] = insert_object[key] || [];
                                insert_object[key].push(val);
                            }
                        }
                    } else {
                        for (var i = 0; i < value.length; i++) {
                            var math = value[i][0];
                            var val = null;
                            if (math == '-') {
                                val = value[i].slice(1);
                                remove[key] = remove[key] || [];
                                remove[key].push(val);
                                if (key == "delegates") {
                                    round.push({
                                        sql: `INSERT INTO accounts_round (master_address, amount, delegate, blockId, round) SELECT ?, -balance, ?, ?, ? from accounts WHERE master_address = ?`,
                                        replacements: [
                                            master_address,
                                            val,
                                            fields.blockId,
                                            fields.round,
                                            master_address
                                        ]
                                    });
                                }
                            } else if (math == '+') {
                                val = value[i].slice(1);
                                insert[key] = insert[key] || [];
                                insert[key].push(val);
                                if (key == "delegates") {
                                    round.push({
                                        sql: `INSERT INTO accounts_round (master_address, amount, delegate, blockId, round) SELECT ?,  balance, ?, ?, ? from accounts WHERE master_address = ?`,
                                        replacements: [
                                            master_address,
                                            val,
                                            fields.blockId,
                                            fields.round,
                                            master_address
                                        ]
                                    });
                                }
                            } else {
                                val = value[i].slice(1);
                                insert[key] = insert[key] || [];
                                insert[key].push(val);
                                if (key == "delegates") {
                                    round.push({
                                        sql: `INSERT INTO accounts_round (master_address, amount, delegate, blockId, round) SELECT ?,  balance, ?, ?, ? from accounts WHERE master_address = ?`,
                                        replacements: [
                                            master_address,
                                            val,
                                            fields.blockId,
                                            fields.round,
                                            master_address
                                        ]
                                    });
                                }
                            }
                        }
                    }
                    break;
            }
        }
    });

    async.series([
        function (cb) {
            Object.keys(insert).forEach(function (key) {
                for (var i = 0; i < insert[key].length; i++) {
                    self.models['model_accounts2'+key].create({
                        master_address: master_address,
                        dependentId: insert[key][i]
                    }).then(function (data) {

                    }, function (err) {
                        self.scope.log.Warn("Account merge [insert]", "Error", err.toString());
                    });
                }
            });

            cb();
        },
        function (cb) {
            Object.keys(insert_object).forEach(function (key) {
                for (var i = 0; i < insert_object[key].length; i++) {
                    self.models['model_accounts2'+key].create(insert_object[key]).then(function (data) {

                    }, function (err) {
                        self.scope.log.Warn("Account merge [insert_object]", "Error", err.toString());
                    });
                }
            });

            cb();
        },
        function (cb) {
            Object.keys(remove).forEach(function (key) {
                for (var i = 0; i < remove[key].length; i++) {
                    self.models['model_accounts2'+key].delete({
                        where: {
                            master_address: remove[key]
                        }
                    }).then(function (data) {

                    }, function (err) {
                        self.scope.log.Warn("Account merge [remove]", "Error", err.toString());
                    });
                }
            });

            cb();
        },
        function (cb) {
            Object.keys(remove_object).forEach(function (key) {
                for (var i = 0; i < remove_object[key].length; i++) {
                    self.models['model_accounts2'+key].delete({
                        where: {
                            master_address: remove_object[key]
                        }
                    }).then(function (data) {

                    }, function (err) {
                        self.scope.log.Warn("Account merge [remove_object]", "Error", err.toString());
                    });
                }
            });

            cb();
        },
        function (cb) {
            if (Object.keys(update).length) {
                debugger
                self.models.model_accounts.update(update, {
                    where: {
                        master_address: master_address
                    }
                }).then(function (data) {

                }, function (err) {
                    self.scope.log.Warn("Account merge [update]", "Error", err.toString());
                });
            }

            cb();
        },
        function (cb) {
            async.eachSeries(round, function (sub_round, cb) {
                self.scope.dbClient.query(sub_round.sql, {
                    type: Sequelize.QueryTypes.INSERT,
                    replacements: sub_round.replacements
                }).then(function (data) {
                    cb();
                }, function (err) {
                    self.scope.log.Warn("Account merge [update]", "Error", err.toString());
                    cb();
                });
            }, function (err) {
                cb(err);
            });
        }
    ], done);

    function done(err) {
        if (cb.length != 2) {
            return cb(err);
        } else {
            if (err) {
                return cb(err);
            }
            self.find({master_address: master_address}, cb);
        }
    }
};

Account.prototype.remove = function (master_address, cb) {
    async.waterfall([
        function (cb) {
            that.models.model_accounts.delete({
                where: {
                    master_address: master_address
                }
            }).then(function (data) {
                cb(null);
            }, function (err) {
                that.scope.log.Warn("Account remove", "Error", err.toString());
                cb(null);
            });
        }
    ], function (err, result) {
        // callback
        setImmediate(cb, null, this);
    }.bind(this));
};

// export
module.exports = Account;