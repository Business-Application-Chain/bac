var async = require('async');
var constants = require('../utils/constants.js');

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