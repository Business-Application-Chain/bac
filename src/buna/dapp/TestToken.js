var msg, balance, status, event;
function TestToken(_msg, _balance, _status, _event) {
    this.name = "Test Token";
    this.symbol = "TT";
    this.decimals = 8;
    this.totalAmount = 1000000000 * 10 ** 8;
    event = _event;
    msg = _msg;
    balance = _balance;
    status = _status;
    this.status = {
        lock: false,
        lockTime: 0
    }
}

TestToken.prototype.init = function() {
    balance[msg.from] = this.totalAmount;
    return event.init(this);
};

TestToken.prototype.send = function(value, to) {
    if(status.lock || status.lockTime > Date.now()) {
        return false;
    }
    if (balance[msg.from] - value > 0) {
        balance[msg.from] = balance[msg.from] - value;
        balance[to] = balance[to] + value;
        return event.transfer(msg.from, to, balance);
    }
    return false;
};

TestToken.prototype.lockAccount = function(to) {
    if(msg.admin === msg.from) {
        status[to].lock = true;
        return event.do(msg.from, to, status);
    }
    return false;
};

TestToken.prototype.unLockAccount = function(to) {
    if(msg.admin === msg.from) {
        status[to].lock = false;
        return event.do(msg.from, to, status);
    }
    return false;
};

TestToken.prototype.lockAccountTime = function(time, to) {
    if(msg.admin === msg.from) {
        status[to].lockTime = time;
        return event.do(msg.from, to, status);
    }
    return false;
};

// export
module.exports = TestToken;

