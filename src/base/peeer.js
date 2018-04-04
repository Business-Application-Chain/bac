var async = require('async');
var contants = require('../utils/constants.js');
var genesisBlock = null;
var Sequelize = require('sequelize');

var privated = {}, dbClient;
var ip = require('ip');
var jsonSql = require('../json-sql')({dialect: 'mysql'});
// constructor
function Peeer(scope, cb) {
    this.scope = scope;
    this.table = 'peers';

    this.model = [{
        name: 'id',
        type: 'BigInt',
        primary_key: true,
        filter: {
            type: 'integer'
        },
        conv: Number,
        constante: true
    }, {
        name: 'ip',
        type: 'BigInt',
        allow_null: false,
        filter: {
            type: 'integer'
        },
        conv: Number
    }, {
        name: 'port',
        type: 'BigInt',
        allow_null: false,
        filter: {
            type: 'integer'
        },
        conv: Number
    },{
        name: 'state',
        type: 'BigInt',
        allow_null: false,
        default_value: 0,
        filter: {
            type: 'integer'
        },
        conv: Number
    },{
        name: 'os',
        type: 'String',
        allow_null: false,
        length: 21,
        filter: {
            type: 'string',
            maxLength: 21,
            minLength: 1
        },
        conv: String
    },{
        name: 'version',
        type: 'String',
        allow_null: false,
        length: 21,
        filter: {
            type: 'string',
            maxLength: 21,
            minLength: 1
        },
        conv: String
    },{
        name: 'clock',
        type: 'BigInt',
        allow_null: false,
        default_value: 0,
        filter: {
            type: 'integer'
        },
        conv: Number
    }];

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

Peeer.prototype.findOrCreate = function (peer, cb) {

};

// export
module.exports = Peeer;