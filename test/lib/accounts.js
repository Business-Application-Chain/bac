var helper = require('../helper.js');

var Saccount = {
    'address' : '6202245275956910442L',
    'publicKey' : '3319e5bb7b26eda2f3ba91d55536e8260b58bb37b968233823c2ba588200459f',
    // 'publicKey' : 'b481b23994ec4ac65cf218d5efc88311df6b76092d40089dead440e3ed50d23d',
    'username': 'Draven1',
    'balance': 0,
    'password' : 'cxy',
    'secret': 'wKyoJM1vS4ucHmWvxDSdcpC23mJwqfg3G6MKZoXaFfcnWHTqo7',
    'host': '127.0.0.1:9000'
};

var test = 0;
//secret 应该根据 助记词自己生成
describe('Account', function () {
    test++;
    it(`${test}. Opening account with password: ${Saccount.secret}. Expecting success`,function(done){
        var params = {
            "secret": Saccount.secret
        };
        helper.postHelper('/accounts/open', params, function (err, res, body) {
            console.log(JSON.stringify(body));
            helper.expect(body).to.have.property("success").to.be.true;
            helper.expect(res.body).to.have.property("account").that.is.an('object');
            helper.expect(res.body.account.address).to.equal(Saccount.address);
            helper.expect(res.body.account.publicKey).to.equal(Saccount.publicKey);
            Saccount.balance = res.body.account.balance;
            done();
        });
    });

    test++;
    it(`${test}. Testing /accounts/open but sending EMPTY STRING as secret in json content. Expecting error`, function (done) {
        var params = {
            // secret:""
        };
        helper.postHelper('/accounts/open', params, function (err, res, body) {
            console.log(body);
            helper.expect(body).to.have.property("success").to.be.false;
            helper.expect(body).to.have.property("error");
            done();
        });
    });

    test++;
    it(`${test}. Testing /accounts/open but sending EMPTY STRING as secret in json content. Expecting error`, function (done) {
        var params = {
            "secret": ''
        };
        helper.postHelper('/accounts/open', params, function (err, res, body) {
            console.log(JSON.stringify(body));
            helper.expect(body).to.have.property("success").to.be.false;
            helper.expect(body).to.have.property("error");
        });
        done();
    });

    test++;
    it(`${test}. Testing /accounts/open but sending INVALID JSON content. Expecting error`, function (done) {
        var params = '{"invalid"}';
        helper.postHelper('/accounts/open', params, function (err, res, body) {
            console.log(JSON.stringify(body));
            helper.expect(body).to.have.property("success").to.be.false;
            helper.expect(body).to.have.property("error");
            done();
        });
    });

    test++;
    it(`${test}. Testing /accounts/getBalance and verifying reply. Expecting success`, function (done) {
        var params = {
            'address': Saccount.address
        };
        helper.getHelper('/accounts/getBalance', params, "", function (err, res, body) {
            console.log(JSON.stringify(body));
            helper.expect(body).to.have.property("success").to.be.true;
            helper.expect(body).to.have.property("balance");
            helper.expect(body.balance).to.equal(Saccount.balance);
            done();
        });
    });

    test = test + 1;
    it(`${test}. Testing /accounts/getBalance but sending INVALID ADDRESS. Expecting error`,function(done){
        var params = {
            'address': 'thisIsNOTAEbookcoinAddress'
        };
        helper.getHelper('/accounts/getBalance', params, "", function (err, res, body) {
            console.log(JSON.stringify(body));
            helper.expect(res.body).to.have.property("success").to.be.false;
            helper.expect(res.body).to.have.property("error");
            done();
        });
    });

    test = test + 1;
    it(`${test}. Testing /accounts/getBalance but NOT SENDING ADDRESS. Expecting error`,function(done){
        var params = {
        };
        helper.getHelper('/accounts/getBalance', params, "", function (err, res, body) {
            console.log(JSON.stringify(body));
            helper.expect(res.body).to.have.property("success").to.be.false;
            helper.expect(res.body).to.have.property("error");
            done();
        });
    });

    test = test + 1;
    it(`${test}. Testing /accounts/getPublicKey and verifying reply. Expecting success`,function(done){
        var params = {
            'address': Saccount.address
        };
        helper.getHelper('/accounts/getPublicKey', params, "", function (err, res, body) {
            console.log(JSON.stringify(body));
            helper.expect(res.body).to.have.property("success").to.be.true;
            helper.expect(res.body).to.have.property("publicKey");
            helper.expect(res.body.publicKey).to.equal(Saccount.publicKey);
            done();
        });
    });

    test = test + 1;
    it(`${test}. Testing /accounts/getPublicKey but SENDING INVALID ADDRESS. Expecting error`,function(done){
        var params = {
            'address': 'thisIsNOTAEbookcoinAddress'
        };
        helper.getHelper('/accounts/getPublicKey', params, "", function (err, res, body) {
            console.log(JSON.stringify(body));
            helper.expect(res.body).to.have.property("success").to.be.false;
            helper.expect(res.body).to.have.property("error");
            done();
        });
    });

    test = test + 1;
    it(`${test}. Testing /accounts/getPublicKey but SENDING INVALID ADDRESS. Expecting error`,function(done){
        var params = {
            'address': ''
        };
        helper.getHelper('/accounts/getPublicKey', params, "", function (err, res, body) {
            console.log(JSON.stringify(body));
            helper.expect(res.body).to.have.property("success").to.be.false;
            helper.expect(res.body).to.have.property("error");
            done();
        });
    });

    test = test + 1;
    it(`${test}. Testing /accounts/generatePublicKey and verifying reply. Expecting success`,function(done){
        var params = {
            'secret': Saccount.secret
        };
        helper.postHelper('/accounts/generatePublicKey', params, function (err, res, body) {
            console.log(JSON.stringify(body));
            helper.expect(res.body).to.have.property("success").to.be.true;
            helper.expect(res.body).to.have.property("publicKey");
            helper.expect(res.body.publicKey).to.equal(Saccount.publicKey);
            done();
        });
    });

    test = test + 1;
    it(`${test}. Testing /accounts/generatePublicKey but SENDING EMPTY STRING as secret. Expecting error`,function(done){
        var params = {
            'secret': ""
        };
        helper.postHelper('/accounts/generatePublicKey', params, function (err, res, body) {
            console.log(JSON.stringify(body));
            helper.expect(res.body).to.have.property("success").to.be.false;
            helper.expect(res.body).to.have.property("error");
            done();
        });
    });

    test = test + 1;
    it(`${test}. Testing /accounts/generatePublicKey but NOT SENDING ANYTHING. Expecting error`,function(done){
        var params = {
        };
        helper.postHelper('/accounts/generatePublicKey', params, function (err, res, body) {
            console.log(JSON.stringify(body));
            helper.expect(res.body).to.have.property("success").to.be.false;
            helper.expect(res.body).to.have.property("error");
            done();
        });
    });

    test = test + 1;
    it(`${test}. Testing /accounts/generatePublicKey but SENDING INVALID CONTENT. Expecting error`,function(done){
        var params = '{"invalid"}';
        helper.postHelper('/accounts/generatePublicKey', params, function (err, res, body) {
            console.log(JSON.stringify(body));
            helper.expect(res.body).to.have.property("success").to.be.false;
            helper.expect(res.body).to.have.property("error");
            done();
        });
    });

    test = test + 1;
    it(`${test}. Testing /accounts and verifying reply. Expecting success`,function(done){
        var params = {
            address: Saccount.address
        };
        helper.getHelper('/accounts', params, '', function (err, res, body) {
            console.log(JSON.stringify(res.body));
            helper.expect(res.body).to.have.property("success").to.be.true;
            helper.expect(res.body).to.have.property("account").that.is.an('object');
            helper.expect(res.body.account.address).to.equal(Saccount.address);
            helper.expect(res.body.account.publicKey).to.equal(Saccount.publicKey);
            helper.expect(res.body.account.balance).to.equal(Saccount.balance);
            done();
        });
    });

    test = test + 1;
    it(`${test}. Testing /accounts but SENDING INVALID ADDRESS. Expecting error`,function(done){
        var params = {
            address: 'thisIsNOTAValidEbookcoinAddress'
        };
        helper.getHelper('/accounts', params, '', function (err, res, body) {
            console.log(JSON.stringify(body));
            helper.expect(body).to.have.property("success").to.be.false;
            helper.expect(body).to.have.property("error");
            done();
        });
    });

    test = test + 1;
    it(`${test}. Testing /accounts but SENDING EMPTY ADDRESS. Expecting error`,function(done){
        var params = {
            address: ''
        };
        helper.getHelper('/accounts', params, '', function (err, res, body) {
            console.log(JSON.stringify(body));
            helper.expect(res.body).to.have.property("success").to.be.false;
            helper.expect(res.body).to.have.property("error");
            done();
        });
    });

});
