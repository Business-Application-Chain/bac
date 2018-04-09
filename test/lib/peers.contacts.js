var helper = require('../helper.js');
var crypto = require('crypto');

var account = helper.randomAccount();
var account2 = helper.randomAccount();

describe("Peer contacts", function () {
    // before(function (done) {
    //     var params = {
    //         secret: account.password
    //     };
    //     helper.postHelper('/accounts/open', params, function (error, res, body) {
    //
    //         account.address = body.account.address;
    //         account.publicKey = body.account.publicKey;
    //
    //         var header = {
    //             'Accept': 'application/json',
    //             'version': helper.config.server.version,
    //             'share-port': 1,
    //             'port': helper.config.server.port
    //         };
    //         var params = {
    //             secret: helper.peers_config.account,
    //             amount: 100000000000,
    //             recipientId: account.address
    //         };
    //         console.log(params);
    //         helper.getHelper('/transactions', header, params, function (err, res, body) {
    //             helper.onNewBlock(done);
    //         })
    //     });
    // });

    it('Add not exist account to contacts. Should return not ok', function (done) {
        var transaction = helper.ebook.contact.createContact(account.password, '5819218109212912C');
        transaction.recipientId = account.address;
        var header = {
            'Accept': 'application/json',
            'version': helper.config.server.version,
            'share-port': 1,
            'port': helper.config.port
        };
        var params = transaction;

        helper.putHelper('/transactions', header, params, function (err, res, body) {
            helper.expect(body).to.have.property("success").to.be.false;
            done();
        })
    });

    it('Add account to contact. Should be OK', function (done) {
        var transaction = helper.ebook.contact.createContact(account.password, helper.peers_config.address);
        transaction.recipientId = '2334212999465599568C';
        console.log(transaction);
        helper.putHelper('/transactions', transaction, '', function (err, res, body) {
            console.log(body);
            helper.expect(body).to.have.property("success").to.be.true;
            done();
        });
    })

});
