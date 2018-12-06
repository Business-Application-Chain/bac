var from;
var balanceFrom;
var balance = Balance();
var message = Message();
var status = Status();

class TestToken {
    init() {
        this.name = "Test Token";
        this.symbol = "TT";
        this.decimals = 8;
        this.totalAmount = 1000000000 * 10 * 8;
        this.status = '{"lock": false,"lockTime": 0}';
        SetObject(this.name, this.symbol, this.decimals, this.totalAmount, this.status);
    }

    send(to, value) {
        if (Get(this.status, "lock") or Get(this.status, "lockTime") > clock() ) {
            return false;
        }
        from = Get(message, "from");
        balanceFrom = Get(balance, from);
        if (balanceFrom - value > 0) {
            balance = SetBalance(balance, from, -value);
            balance = SetBalance(balance, to, value);
            return true;
        }
        return false;
    }

    lockAccount(to) {
        if (Get(message, "admin") == Get(message, "from")) {
            status = SetStatus(status, to, "lock", true);
            return true;
        }
        return false;
    }

    unLockAccount(to) {
        if (Get(message, "admin") == Get(message, "from")) {
            status = SetStatus(status, to, "lock", false);
            return true;
        }
        return false;
    }

    lockAccountTime(time, to) {
        if (Get(message, "admin") == Get(message, "from")) {
            status = SetStatus(status, to, lockTime, time);
        }
        return false;
    }
}