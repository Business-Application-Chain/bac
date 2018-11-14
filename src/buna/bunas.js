var library, self, privated = {};
var fs = require('fs');
var path = require('path');
let Buna = require('./dist/buna');
let readFile = require('fs-readfile-promise');
function Bunas(scope, cb) {
    library = scope;
    self = this;
    self.__private = privated;
    setImmediate(cb, null, self);
}

Bunas.prototype.getAbiAndTokens = function(txObj, cb) {
    let msg = {
        from: txObj.accountId
    };
    try {
        let tToken = new Buna.default(msg, 0, {});
        setTimeout(function () {
            cb(null, tToken);
        }, 100);
    } catch (err) {
        return cb(err);
    }
};

Bunas.prototype.dealContract = function(contractTokens, dealFun, msg, balances, status, cb) {
    let tToken = new Buna.default(balances, msg, status);
    let p = new Promise((reject) => {
        tToken.run(dealFun.className + "()." + dealFun.fun + "(" + dealFun.params.toString() + ");");
        setTimeout(function () {
            reject(tToken);
        }, 300);
    });
    let p2 = new Promise((reject) => {
        p.then(tokens => {
            tToken.run(contractTokens + "\n" + tokens);
            setTimeout(function () {
                reject();
            });
        });
    });
    p2.then(() => {
        cb();
    });
};

Bunas.prototype.createContract = function(txObj, cb) {
    let dapp = txObj.asset.dapp;
    let contract = txObj.message;
    let msg = {
        from: txObj.accountId
    };
    try {
        let tToken = new Buna.default(msg, 0, {});
        tToken.run(contract + "\n " + dapp.className + "();");
        setTimeout(function () {
            cb(null, tToken);
        }, 100);
    } catch (err) {
       return cb(err);
    }
};

Bunas.prototype.testContract = function(data, cb) {
    let msg = {
        from: data.accountId
    };
    try {
        let tToken = new Buna.default(msg, 0, {});
        data.message += "\n " + data.className + "();";
        tToken.run(data.message);
        setTimeout(function () {
            cb(null, tToken);
        }, 100);
    } catch (err) {
        return cb(err);
    }
};

Bunas.prototype.doBunaHandleTest = function(msg, dappHash, balances, status, fun, params, contract, className, cb) {
    let handleDapp = new Buna.default(balances, msg, status);
    for (let i=0; i<params.length; i++) {
        if (typeof params[i] !== "number")
            params[i] = `"${params[i]}"`;
    }
    let filePath = path.join(__dirname, './dapp/test.buna');
    let end = className + "()." + fun + '(' + params.toString() + ');';
    readFile(filePath).then((data) => {
        handleDapp.run(data.toString() + "\n" + end);
        setTimeout(function () {
            cb(null, handleDapp);
        }, 100);
    }).catch(err => {
        console.log(err);
    });
};

Bunas.prototype.doBunaHandle = function(msg, dappHash, balances, status, fun, params, contract, className, cb) {
    let handleDapp = new Buna.default(balances, msg, status);
    for (let i=0; i<params.length; i++) {
        if(typeof params[i] !== "number")
            params[i] = `"${params[i]}"`;
    }
    let end = className + "()." + fun + '(' + params.toString() + ');';
    contract += "\n" + end;
    handleDapp.run(contract);
    setTimeout(function () {
        cb(null, handleDapp);
    }, 100);
};

module.exports = Bunas;