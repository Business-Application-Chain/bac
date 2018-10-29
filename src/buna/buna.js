var library, self, privated = {};
function Buna(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;
    // privated.doDapp();
    setImmediate(cb, null, self);
}

let msg = {
    from: 'BBGiXeKL6tLQwe5Hqg6eXBBHn8ErUtNM1Z',
};
let balance = {};

privated.doDapp = function() {
    let TestToken = require('./dapp/TestToken');
    let tToken = new TestToken(msg, balance, new runBuna);
    tToken.init();
};

function runBuna() {
}

Buna.prototype.onNewContract = function(txObj) {
    let contract = txObj.message;
    let TestToken = require(contract);
    let tToken = new TestToken(msg, balance, new runBuna);
    tToken.init();
};

runBuna.prototype.transfer = function(from, to, value) {
    console.log(from, to, value);
};

runBuna.prototype.init = function(initData) {
    console.log(initData);
};

runBuna.prototype.doFunction = function(method, params) {
    return params;
};

// export
module.exports = Buna;