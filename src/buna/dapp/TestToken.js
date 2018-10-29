var msg, balance, event;
function TestToken(_msg, _balance, _event) {
    this.name = "Test Token";
    this.symbol = "TT";
    this.decimals = 8;
    this.totalAmount = 1000000000 * 10 ** 8;
    event = _event;
    msg = _msg;
    balance = _balance;
}

TestToken.prototype.init = function() {
    balance[msg.from] = this.totalAmount;
    event.init(this);
};

TestToken.prototype.send = function(to, value) {
    if(balance[msg.from] - value > 0) {
        balance[msg.from] = balance[msg.from] - value;
        balance[to] = balance[to] + value;
        event.transfer(msg.from, to, value);
        return true;
    }
    return false;
};

TestToken.prototype.balanceOf = function(address) {
    return balance[address];
};

// export
module.exports = TestToken;

