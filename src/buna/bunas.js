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

Bunas.prototype.getAbiAndTokens = function(datas) {
    return new Promise((resolve, reject) => {
        let msg = {
            from: datas.senderId
        };
        try {
            let tToken = new Buna.default(msg, 0, {});
            let tt = tToken.runGetToken(datas.message);
            resolve(tt);
        } catch (err) {
            reject(err);
        }
    });

};

Bunas.prototype.getContractTokens = function(senderId, contract, cb) {
    let msg = {
        from: senderId
    };
    try {
        let tToken = new Buna.default(msg, 0, {});
        tToken.run(contract);
        // cb(null, tt);
        setTimeout(function () {
            cb(null, tToken);
        }, 200)
    } catch (err) {
        return cb(err);
    }
};

Bunas.prototype.getTestAbiAndTokens = function(txObj, cb) {
    let msg = {
        from: txObj.senderId
    };
    let tToken = new Buna.default(msg, 0, {});
    let filePath = path.join(__dirname, './dapp/test.buna');
    readFile(filePath).then((data) => {
        tToken.run(data.toString());
        setTimeout(function () {
            cb(null, tToken);
        }, 100);
    }).catch(err => {
        console.log(err);
    });
};

Bunas.prototype.dealCreateContract = function(txObj, tokens, cb) {
    let dapp = txObj.asset.dapp;
    let msg = {
        from: txObj.senderId
    };
    let tToken = new Buna.default(msg, 0, {});
    let tt = tToken.runGetToken(dapp.className + "();");
    let tTokens = [];
    tokens.forEach(item => {
        tTokens.push(item);
    });
    tt.token.forEach(item => {
        tTokens.push(item);
    });
    tToken.runToken(tTokens);
    setTimeout(function () {
        cb(null, tToken);
    }, 200);
};

Bunas.prototype.dealTokenContract = function(msg, balances, status, tokens) {
    return new Promise((resolve) => {
        let handleDapp = new Buna.default(balances, msg, status);
        handleDapp.runToken(tokens);
        setTimeout(function () {
            resolve(handleDapp);
        }, 100);
    });
};

Bunas.prototype.dealContract = function(contractTokens, dealFun, msg, balances, status, cb) {
    let tToken = new Buna.default(balances, msg, status);
    let p = new Promise((reject) => {
        tToken.run(dealFun.className + "()." + dealFun.fun + "(" + dealFun.params.toString() + ");");
        setTimeout(function () {
            reject(tToken);
        }, 300);
    });
    p.then(tokens => {
        tToken.run(contractTokens + "\n" + tokens);
        setTimeout(function () {
            cb();
        });
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

Bunas.prototype.testContract = function(data, gas, cb) {
    let msg = {
        from: data.accountId
    };
    try {
        let tToken = new Buna.default(msg, 0, {}, gas);
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