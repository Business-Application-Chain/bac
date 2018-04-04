var async = require('async');
var contants = require('../utils/constants.js');
var genesisBlock = null;
var Sequelize = require('sequelize');

var privated = {}, dbClient;
var ip = require('ip');

// constructor
function Peers(scope, cb) {
    this.scope = scope;

    this.model_peers = this.scope.dbClient.define('peers', {
        ip: {
            type: Sequelize.BIGINT,
            allowNull: false
            // field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
        },
        port: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        state: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        os: {
            type: Sequelize.STRING,
        },
        sharePort: {
            type: Sequelize.INTEGER,
        },
        version: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },{
        freezeTableName: true // Model tableName will be the same as the model name
    });
    this.scope.dbClient.sync();

    setImmediate(cb, null, this);
}

// public methods
Peers.prototype.createTables = function (cb) {

};

Peers.prototype.removeTables = function (cb) {

};

Peers.prototype.objectNormalize = function (object) {

};

Peers.prototype.toHex = function (raw) {

};

Peers.prototype.create = function (ip, port, state, os, sharePort, version) {
    this.model_peers.create({
        ip: ip,
        port: port,
        state: state,
        os: os,
        sharePort: sharePort,
        version: version
    }).then(function (jane) {
        console.log(jane);
    });
};

Peers.prototype.findPeers = function (ip, port, cb) {
    this.model_peers.findOne({
        where:{
            ip: ip,
            port: port
        }
    }).then((peer) =>{
        cb(peer);
    });
};

Peers.prototype.findOne = function (peer, cb) {
    this.model_peers.findOne({
        where:{
            ip: peer.ip,
            port: peer.port
        }
    }).then((project) => {
        cb(project)
    })
};

Peers.prototype.findAll = function (cb) {
    this.model_peers.findAll().then(res => {
        cb(res);
    });
};

Peers.prototype.getCount = function (cb) {
    this.model_peers.count().then((row) => {
        cb(null, row);
    }).catch((error) => {
        cb(error);
    })
};

Peers.prototype.findOrCreate = function (peer, cb) {
    this.model_peers.findOrCreate({
        where:{
            ip: peer.ip,
            port: peer.port
        },
        defaults: {
            ip: peer.ip,
            port: peer.port,
            state: 2,
            os: 'mac',
            sharePort: Number(true),
            version: peer.version
        }
    }).spread((peer, created) => {
        // console.log(peer.get({
        //     plain: true
        // }));
        // console.log(created);
        cb(peer, created);
    });
};

Peers.prototype.removePeer = function (ip, port, cb) {
    this.model_peers.destroy({
        where: {
            ip: ip,
            port: port
        }
    }).then((number) => {
        cb(number)
    })
};


Peers.prototype.update = function () {

};

Peers.prototype.remove = function () {

};

// export
module.exports = Peers;