var slots = require('../utils/slots.js');
var ed = require('ed25519');
var crypto = require('crypto');
var blockStatus = require('../utils/blockStatus.js');
var constants = require('../utils/constants.js');
var genesisblock = null;

// Constructor
function Block(scope, cb) {
    this.scope = scope;
    genesisblock = this.scope.genesisblock;
    cb && setImmediate(cb, null, this);
}

// private methods
var privated = {};
privated.blockStatus = new blockStatus();

