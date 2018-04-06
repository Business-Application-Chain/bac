var async = require('async');
var contants = require('../utils/constants.js');
var genesisBlock = null;
var Sequelize = require('sequelize');

var privated = {}, dbClient;
var ip = require('ip');
var jsonSql = require('../json-sql')({dialect: 'mysql'});

// constructor
function Peeer(scope, cb) {
    // "CREATE TABLE IF NOT EXISTS peers (id INTEGER NOT NULL PRIMARY KEY, ip INTEGER NOT NULL, port TINYINT NOT NULL, state TINYINT NOT NULL, os VARCHAR(64), sharePort TINYINT NOT NULL, version VARCHAR(11), clock INT)",
    this.scope = scope;
    this.table = 'peers';

    this.model = [
        {
            name: 'ip',
            type: 'BigInt',
            unique: true,
            filter: {
                type: 'integer'
            },
            not_null: true
        }, {
            name: 'port',
            type: 'Number',
            unique: true,
            filter: {
                type: 'integer'
            },
            not_null: true
        }, {
            name: 'state',
            type: 'Boolean',
            default_value: 0,
            filter: {
                type: 'boolean'
            },
            not_null: true
        }, {
            name: 'os',
            type: 'String',
            length: 21,
            filter: {
                type: 'string',
                maxLength: 21,
                minLength: 1
            },
            not_null: true
        }, {
            name: 'version',
            type: 'String',
            length: 21,
            filter: {
                type: 'string',
                maxLength: 21,
                minLength: 1
            },
            not_null: true
        }, {
            name: 'clock',
            type: 'Number',
            default_value: 0,
            filter: {
                type: 'integer'
            },
        }
    ];

    setImmediate(cb, null, this);
}

Peeer.prototype.createTables = function (cb) {
    var sqles = [];
    var self = this;
    var sql = jsonSql.build({
        type: 'create',
        table: this.table,
        tableFields: this.model
    });

    sqles.push(sql.query);
    console.log(sqles[0]);
    self.scope.dbClient.query(sqles[0]).then(function (data) {
        cb(null, data);
    }, function (err) {
        self.scope.log.Warn("Account merge [update]", "Error", err.toString());
        cb("Account merge [update]", "Error", err.toString());
    }.bind(this), function (err) {
        setImmediate(cb, err, this);
    }.bind(this));
};

Peeer.prototype.findOne = function (ip, port) {
};

Peeer.prototype.findAll = function (peer, cb) {
    // if (typeof(fields) == 'function') { // Here is just for cases that only send-in 2 params
    //     cb = fields;
    //     fields = this.fields.map(function (field) {
    //         return field.alias || field.field;
    //     });
    // }
    var self = this;
    var sql = jsonSql.build({
        type: 'select',
        table: this.table,
        condition: 'where',
        values: {
            ip: peer.ip,
            sort: peer.port
        }
    })
    console.log(sql);
};


Peeer.prototype.findOrCreate = function (peer) {
    var self = this;
    var sql = jsonSql.build({
        type: 'insert',
        or: 'ignore',
        table: this.table,
        values: {
            ip: peer.ip,
            port: peer.port,
            state: 2,
            os: peer.os || null,
            version: peer.version || null
        }
    });
    console.log(sql);
    self.scope.dbClient.query(sql.query.replace('or', ''), {
        bind: sql.values
    }).then((data) => {
        console.log(data);
    }, (err) => {
        self.scope.log.Warn("Peers findOrCreate", "Error", err.toString());
    });
};

// export
module.exports = Peeer;