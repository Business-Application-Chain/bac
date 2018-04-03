var async = require('async');
var constants = require('../utils/constants.js');
var genesisBlock = null;
var crypto = require('crypto');
var ed = require('ed25519');
var bignum = require('../utils/bignum.js');
var ByteBuffer = require('bytebuffer');
var blockStatus = require('../utils/blockStatus.js');

var privated = {};

// constructor
function Block(scope, cb) {
    this.scope = scope;
    //genesisBlock = library.genesisblock.block;

    setImmediate(cb, null, this);
}
