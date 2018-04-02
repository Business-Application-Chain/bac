var async = require('async');
var contants = require('../utils/contants.js');

var privated = {};

// constructor
function Address(scope, cb) {
    this.scope = scope;

    setImmediate(cb, null, this);
}

// public methods
Address.prototype.getAddressByMasterPrivaryKey = function (master_pri, nIndex, cb) {

};

// export
module.exports = Address;