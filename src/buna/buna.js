var library, self, privated = {};
var fs = require('fs');
var path = require('path');
function Buna(scope, cb) {
    library = scope;
    self = this;
    self.__private = privated;
    setImmediate(cb, null, self);
}

function runBuna() {}

Buna.prototype.createContract = function(txObj, cb) {
    let dappHash = txObj.asset.dapp.hash;
    let contract = txObj.message;
    let msg = {
        from: txObj.accountId
    };
    let filePath = path.join(__dirname, './dapp/' + dappHash + ".js");
    fs.writeFile(filePath, contract, (err) => {
        if(err) {
            console.log(err);
            console.log("写文件失败");
            cb("写文件失败");
        } else {
            let buna = require(filePath);
            let tToken = new buna(msg, 0, {}, new runBuna);
            let initDappData = tToken.init();
            cb(null, initDappData);
        }
    });
};

Buna.prototype.doBunaHandle = function(msg, dappHash, balances, status, fun, params) {
    let filePath = path.join(__dirname, './dapp/'+dappHash+'.js');
    let buna = require(filePath);
    let handleDapp = new buna(msg, balances, status, new runBuna);
    return handleDapp[fun](...params);

};

runBuna.prototype.transfer = function(from, to, balance) {
    let balances = {};
    balances[from] = balance[from];
    balances[to] = balance[to];
    return {type: 1, data:balances};
};

runBuna.prototype.init = function(initData) {
    let status = "";
    if(initData.status) {
        status = JSON.stringify(initData.status);
    }
    let dappInitData = {
        name: initData.name,
        symbol: initData.symbol,
        decimals: initData.decimals,
        totalAmount: initData.totalAmount,
        others: status
    };
    return {type: 2, data:dappInitData};
};

runBuna.prototype.do = function(from, to, status) {
    let _status = {};
    _status[to] = status[to];
    return {type: 2, data: JSON.stringify(_status)};
};

// export
module.exports = Buna;