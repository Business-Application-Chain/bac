var async = require('async');
var constants = require('../utils/constants.js');
var genesisBlock = null;
var Sequelize = require('sequelize');
var crypto = require('crypto');
var bignum = require('../utils/bignum.js');
var jsonSql = require('../json-sql')({dialect: 'mysql'});

var privated = {};

// constructor
function Account(scope, cb) {
    this.scope = scope;
    genesisBlock = this.scope.genesisblock.block;

    this.table = 'accounts';

    this.model = [
        {
            name: 'master_pub',
            type: 'String',
            length: 64,
            filter: {
                type: 'string'
            },
            conv: String,
            constante: true
        },
        {
            name: 'master_address',
            type: 'String',
            length: 21,
            not_null: true,
            unique: true,
            primary_key: true,
            filter: {
                type: 'string',
                maxLength: 21,
                minLength: 1
            },
            conv: String,
            constante: true
        },
        {
            name: 'username',
            type: 'String',
            length: 20,
            filter: {
                type: 'string',
                maxLength: 20,
                minLength: 1
            },
            conv: String,
            constante: true
        },
        {
            name: 'username_unconfirmed',
            type: 'String',
            length: 20,
            filter: {
                type: 'string',
                maxLength: 20,
                minLength: 1
            },
            conv: String,
            constante: true
        },
        {
            name: 'secondsign',
            type: 'Boolean',
            filter: {
                type: 'boolean'
            },
            conv: Boolean,
            default: 0
        },
        {
            name: 'secondsign_unconfirmed',
            type: 'Boolean',
            filter: {
                type: 'boolean'
            },
            conv: Boolean,
            default: 0
        },
        {
            name: 'second_pub',
            type: 'String',
            length: 64,
            filter: {
                type: 'string'
            },
            conv: String,
            constante: true
        },
        {
            name: 'balance',
            type: 'BigInt',
            filter: {
                required: true,
                type: 'integer',
                minimum: 0,
                maximum: constants.totalAmount
            },
            conv: Number,
            default: 0
        },
        {
            name: 'balance_unconfirmed',
            type: 'BigInt',
            filter: {
                required: true,
                type: 'integer',
                minimum: 0,
                maximum: constants.totalAmount
            },
            conv: Number,
            default: 0
        },
        {
            name: 'uservote',
            type: 'BigInt',
            filter: {
                type: 'integer'
            },
            conv: Number,
            default: 0
        },
        {
            name: 'rate',
            type: 'BigInt',
            length: 66,
            filter: {
                type: 'integer'
            },
            conv: Number,
            default: 0
        },
        {
            name: 'delegates',
            type: 'Text',
            filter: {
                type: 'array',
                uniqueItems: true
            },
            conv: Array,
            expression: "(select GROUP_CONCAT(dependentId) from " + this.table + "2delegates where accountId = a.master_address)"
        },
        {
            name: 'delegates_unconfirmed',
            type: 'Text',
            filter: {
                type: 'array',
                uniqueItems: true
            },
            conv: Array,
            expression: "(select GROUP_CONCAT(dependentId) from " + this.table + "2delegates_unconfirmed where accountId = a.master_address)"
        },
        {
            name: 'create_block',
            type: 'String',
            length: 20,
            filter: {
                type: 'string',
                maxLength: 20,
                minLength: 1
            },
            conv: String
        },
        {
            name: 'isDelegate',
            type: 'Boolean',
            filter: {
                type: 'boolean'
            },
            conv: Boolean,
            default: 0
        },
        {
            name: 'isDelegate_unconfirmed',
            type: 'Boolean',
            filter: {
                type: 'boolean'
            },
            conv: Boolean,
            default: 0
        },
        {
            name: 'name_exist',
            type: 'Boolean',
            filter: {
                type: 'boolean'
            },
            conv: Boolean,
            default: 0
        },
        {
            name: 'name_exist_unconfirmed',
            type: 'Boolean',
            filter: {
                type: 'boolean'
            },
            conv: Boolean,
            default: 0
        },
        {
            name: 'prod_block_num',
            type: 'BigInt',
            filter: {
                type: 'integer',
                minimum: -1,
                maximum: 1
            },
            conv: Number,
            default: 0
        },
        {
            name: 'missed_block_num',
            type: 'BigInt',
            filter: {
                type: 'integer',
                minimum: -1,
                maximum: 1
            },
            conv: Number,
            default: 0
        },
        {
            name: 'multisignatures',
            type: 'Text',
            filter: {
                type: 'array',
                uniqueItems: true
            },
            conv: Array,
            expression: "(select GROUP_CONCAT(dependentId) from " + this.table + "2multisignatures where accountId = a.master_address)"
        },
        {
            name: 'multisignatures_unconfirmed',
            type: 'Text',
            filter: {
                type: 'array',
                uniqueItems: true
            },
            conv: Array,
            expression: "(select GROUP_CONCAT(dependentId) from " + this.table + "2multisignatures_unconfirmed where accountId = a.master_address)"
        },
        {
            name: 'multisign_min',
            type: 'BigInt',
            filter: {
                type: 'integer',
                minimum: 0,
                maximum: 17
            },
            conv: Number,
            default: 0
        },
        {
            name: 'multisign_min_unconfirmed',
            type: 'BigInt',
            filter: {
                type: 'integer',
                minimum: 0,
                maximum: 17
            },
            conv: Number,
            default: 0
        },
        {
            name: 'multisign_lifetime',
            type: 'BigInt',
            filter: {
                type: 'integer',
                minimum: 1,
                maximum: 72
            },
            conv: Number,
            default: 0
        },
        {
            name: 'multisign_lifetime_unconfirmed',
            type: 'BigInt',
            filter: {
                type: 'integer',
                minimum: 1,
                maximum: 72
            },
            conv: Number,
            default: 0
        },
        {
            name: 'virgin',
            type: 'Boolean',
            filter: {
                type: 'boolean',
            },
            conv: Boolean,
            default: 0
        },
        {
            name: 'fees',
            type: 'BigInt',
            filter: {
                type: 'integer',
            },
            conv: Number,
            default: 0
        },
        {
            name: 'rewards',
            type: 'BigInt',
            filter: {
                type: 'integer',
            },
            conv: Number,
            default: 0
        }
    ];

    this.fields = this.model.map(field => {
        var _tmp = {};
        if (field.type == "Binary") {
            _tmp.expression = ['lower', 'hex'];
        }

        if (field.expression) {
            _tmp.expression = field.expression;
        } else {
            if (field.mod) {
                _tmp.expression = field.mod;
            }
            _tmp.field = field.name;
        }
        if (_tmp.expression || field.alias) {
            _tmp.alias = field.alias || field.name;
        }

        return _tmp;
    });

    this.binary = [];
    this.model.forEach(function (field) {
        if (field.type == "Binary") {
            this.binary.push(field.name);
        }
    }.bind(this));

    this.filter = {};
    this.model.forEach(function (field) {
        this.filter[field.name] = field.filter;
    }.bind(this));

    this.conv = {};
    this.model.forEach(function (field) {
        this.conv[field.name] = field.conv;
    }.bind(this));

    this.editable = [];
    this.model.forEach(function (field) {
        if (!field.constante && !field.readonly) {
            this.editable.push(field.name);
        }
    }.bind(this));

    setImmediate(cb, null, this);
}

// public methods
Account.prototype.createTables = function (cb) {

    var sqles = [];

    var sql = jsonSql.build({
        type: 'create',
        table: this.table,
        tableFields: this.model
    });
    sqles.push(sql.query);

    var sql = jsonSql.build({
        type: 'create',
        table: this.table + '2delegates',
        tableFields: [
            {
                name: 'accountId',
                type: 'String',
                length: 21,
                not_null: true
            },
            {
                name: 'dependentId',
                type: 'String',
                length: 64,
                not_null: true
            }
        ],
        foreignKeys: [
            {
                field: 'accountId',
                table: this.table,
                table_field: 'master_address',
                on_delete: 'cascade'
            }
        ]
    });
    sqles.push(sql.query);

    var sql = jsonSql.build({
        type: 'create',
        table: this.table + '2delegates_unconfirmed',
        tableFields: [
            {
                name: 'accountId',
                type: 'String',
                length: 21,
                not_null: true
            },
            {
                name: 'dependentId',
                type: 'String',
                length: 64,
                not_null: true
            }
        ],
        foreignKeys: [
            {
                field: 'accountId',
                table: this.table,
                table_field: 'master_address',
                on_delete: 'cascade'
            }
        ]
    });
    sqles.push(sql.query);

    var sql = jsonSql.build({
        type: 'create',
        table: this.table + '2multisignatures',
        tableFields: [
            {
                name: 'accountId',
                type: 'String',
                length: 21,
                not_null: true
            },
            {
                name: 'dependentId',
                type: 'String',
                length: 64,
                not_null: true
            }
        ],
        foreignKeys: [
            {
                field: 'accountId',
                table: this.table,
                table_field: 'master_address',
                on_delete: 'cascade'
            }
        ]
    });
    sqles.push(sql.query);

    var sql = jsonSql.build({
        type: 'create',
        table: this.table + '2multisignatures_unconfirmed',
        tableFields: [
            {
                name: 'accountId',
                type: 'String',
                length: 21,
                not_null: true
            },
            {
                name: 'dependentId',
                type: 'String',
                length: 64,
                not_null: true
            }
        ],
        foreignKeys: [
            {
                field: 'accountId',
                table: this.table,
                table_field: 'master_address',
                on_delete: 'cascade'
            }
        ]
    });
    sqles.push(sql.query);

    var sql = jsonSql.build({
        type: 'create',
        table: this.table + '_round',
        tableFields: [
            {
                name: 'master_address',
                type: 'String',
                length: 21
            },
            {
                name: 'amount',
                type: 'BigInt'
            },
            {
                name: 'delegate',
                type: 'String',
                length: 64
            },
            {
                name: 'blockId',
                type: 'String',
                length: 20
            },
            {
                name: 'round',
                type: 'BigInt'
            }
        ]
    });
    sqles.push(sql.query);

    sqles.push("INSERT INTO accounts2delegates_unconfirmed SELECT * FROM accounts2delegates;");

    var self = this;

    async.eachSeries(sqles, function (sql, cb) {
        self.scope.dbClient.query(sql).then(function (data) {
            cb(null, data);
        }, function (err) {
            cb(err, undefined);
        });
    }.bind(this), function (err) {
        setImmediate(cb, err, this);
    }.bind(this));
};

Account.prototype.removeTables = function (cb) {
    var sqles = [];

    var sql = jsonSql.build({
        type: 'remove',
        table: this.table
    });
    sqles.push(sql.query);

    var self = this;

    async.eachSeries(sqles, function (sql, cb) {
        self.scope.dbClient.query(sql).then(function (data) {
            cb(null, data);
        }, function (err) {
            cb(err, undefined);
        });
    }.bind(this), function (err) {
        setImmediate(cb, err, this);
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


Account.prototype.findOne = function (filter, fields, cb) {
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

    var limit, offset, sort;

    if (filter.limit > 0) {
        limit = filter.limit;
    }
    delete filter.limit;
    if (filter.offset > 0) {
        offset = filter.offet;
    }
    delete filter.offset;
    if (filter.sort) {
        sort = filter.sort;
    }
    delete filter.sort;

    var sql = jsonSql.build({
        type: 'select',
        table: this.table,
        limit: limit,
        offset: offset,
        sort: sort,
        alias: 'a',
        condition: filter,
        fields: realFields
    });

    var self = this;
    this.scope.dbClient.query(sql.query, {
        type: Sequelize.QueryTypes.SELECT,
        bind: sql.values
    }).then(function (data) {
        cb(null, data);
    }, function (err) {
        cb(err, undefined);
    });
};

Account.prototype.insertOrUpdate = function (master_address, fields, cb) {
    if (fields.master_pub !== undefined && !fields.master_pub) {
        this.scope.log.Error("Account insertOrUpdate", "master_pub", fields.master_pub);
    }

    fields.master_address = master_address;

    var sqles = [];

    var sql = jsonSql.build({
        type: 'insert',
        or: 'ignore',
        table: this.table,
        values: this.toHex(fields)
    });
    sqles.push(sql);

    var sql = jsonSql.build({
        type: 'update',
        table: this.table,
        modifier: this.toHex(fields),
        condition: {
            master_address: master_address
        }
    });
    sqles.push(sql);

    var self = this;

    async.eachSeries(sqles, function (sql, cb) {
        self.scope.dbClient.query(sql.query.replace('or', ''), {
            bind: sql.values
        }).then(function (data) {
            cb(null, data);
        }, function (err) {
            cb(err, undefined);
        });
    }, cb);
};

Account.prototype.merge = function (master_address, fields, cb) {
    if (fields.master_pub !== undefined && !fields.master_pub) {
        this.scope.log.Error("Account merge", "master_pub", fields.master_pub);
    }

    var insert = {}, remove = {}, update = {}, insert_object = {}, remove_object = {}, round = [];

    var self = this;

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
                                query: `INSERT INTO accounts_round (master_address, amount, delegate, blockId, round) SELECT $master_address, $amount, dependentId, $blockId, $round from accounts2delegates WHERE accountId = $master_address`,
                                values: {
                                    master_address: master_address,
                                    amount: value,
                                    blockId: fields.blockId,
                                    round: fields.round
                                }
                            });
                        }
                    }
                    else if (value < 0) {
                        update.$dec = update.$dec || {};
                        update.$dec[key] = Math.abs(value);
                        if (key == 'balance') {
                            round.push({
                                query: `INSERT INTO accounts_round (master_address, amount, delegate, blockId, round) SELECT $master_address, $amount, dependentId, $blockId, $round from accounts2delegates WHERE accountId = $master_address`,
                                values: {
                                    master_address: master_address,
                                    amount: value,
                                    blockId: fields.blockId,
                                    round: fields.round
                                }
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
                                        query: `INSERT INTO accounts_round (master_address, amount, delegate, blockId, round) SELECT $master_address, -balance, $delegate, $blockId, $round from accounts WHERE master_address = $master_address`,
                                        values: {
                                            master_address: master_address,
                                            delegate: val,
                                            blockId: fields.blockId,
                                            round: fields.round
                                        }
                                    });
                                }
                            } else if (math == '+') {
                                val = value[i].slice(1);
                                insert[key] = insert[key] || [];
                                insert[key].push(val);
                                if (key == "delegates") {
                                    round.push({
                                        sql: `INSERT INTO accounts_round (master_address, amount, delegate, blockId, round) SELECT $master_address,  balance, $delegate, $blockId, $round from accounts WHERE master_address = $master_address`,
                                        values: {
                                            master_address: master_address,
                                            delegate: val,
                                            blockId: fields.blockId,
                                            round: fields.round
                                        }
                                    });
                                }
                            } else {
                                val = value[i].slice(1);
                                insert[key] = insert[key] || [];
                                insert[key].push(val);
                                if (key == "delegates") {
                                    round.push({
                                        sql: `INSERT INTO accounts_round (master_address, amount, delegate, blockId, round) SELECT $master_address,  balance, $delegate, $blockId, $round from accounts WHERE master_address = $master_address`,
                                        values: {
                                            master_address: master_address,
                                            delegate: val,
                                            blockId: fields.blockId,
                                            round: fields.round
                                        }
                                    });
                                }
                            }
                        }
                    }
                    break;
            }
        }
    });

    var sqles = [];

    Object.keys(remove).forEach(function (key) {
        var sql = jsonSql.build({
            type: 'remove',
            table: self.table + '2' + key,
            condition: {
                dependentId: {$in: remove[key]},
                accountId: master_address
            }
        });
        sqles.push(sql);
    });

    Object.keys(insert).forEach(function (key) {
        for (var i = 0; i < insert[key].length; i++) {
            var sql = jsonSql.build({
                type: 'insert',
                table: self.table + '2' + key,
                values: {
                    accountId: master_address,
                    dependentId: insert[key][i]
                }
            });
            sqles.push(sql);
        }
    });

    Object.keys(remove_object).forEach(function (key) {
        remove_object[key].accountId = master_address;
        var sql = jsonSql.build({
            type: 'remove',
            table: self.table + '2' + key,
            condition: remove_object[key]
        });
        sqles.push(sql);
    });

    Object.keys(insert_object).forEach(function (key) {
        insert_object[key].accountId = master_address;
        for (var i = 0; i < insert_object[key].length; i++) {
            var sql = jsonSql.build({
                type: 'insert',
                table: self.table + '2' + key,
                values: insert_object[key]
            });
            sqles.push(sql);
        }
    });

    if (Object.keys(update).length) {
        var sql = jsonSql.build({
            type: 'update',
            table: self.table,
            modifier: update,
            condition: {
                master_address: master_address
            }
        });
        sqles.push(sql);
    }

    function done(err) {
        if (cb.length != 2) {
            return cb(err);
        } else {
            if (err) {
                return cb(err);
            }
            self.findOne({master_address: master_address}, cb);
        }
    }

    async.series([
        function (cb) {
            self.scope.dbClient.transaction(function (t) {
                var promiseList = [];
                sqles.forEach(function (sql) {
                    promiseList.push(
                        self.scope.dbClient.query(sql.query, {bind: sql.values, transaction: t})
                    );
                });
                return Promise.all(promiseList);
            }).then(() => {
                cb();
            }).catch((err) => {
                console.log('iserrrrrrrrrrr');
                cb(err);
            });
        },
        function (cb) {
            self.scope.dbClient.transaction(function (t) {
                let promiseList = [];
                round.forEach(function (sql) {
                    promiseList.push(
                        self.scope.dbClient.query(sql.query, {
                            bind: sql.values,
                            transaction: t
                        })
                    );
                });
                return Promise.all(promiseList);
            }).then(() => {
                cb();
            }).catch((err) => {
                cb(err);
            });
        }
    ], done);
};

Account.prototype.remove = function (master_address, cb) {
    var sql = jsonSql.build({
        type: 'remove',
        table: this.table,
        condition: {
            master_address: master_address
        }
    });

    var self = this;

    this.scope.dbClient.query(sql.query, {
        bind: sql.values,
        type: Sequelize.QueryTypes.DELETE
    }).then(function (data) {
        cb(null, data);
    }, function (err) {
        cb(err, undefined);
    });
};

// export
module.exports = Account;
