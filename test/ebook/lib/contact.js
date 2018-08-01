var crypto = require('./crypto.js');

function createContact(secret, address, secondSecret) {
    var keys = crypto.getKeys(secret);

    var transaction = {
        type: 5,
        properties: {
            amount: 0,
            secret: secret,
            fee: 1 * Math.pow(10, 8),
            recipientId: address,
            publicKey: keys.publicKey,
            timestamp: Date.now(),
            secondSecret: secondSecret,
        }

    };

    crypto.sign(transaction, keys);

    if (secondSecret) {
        var secondKeys = crypto.getKeys(secondSecret);
        crypto.secondSign(transaction, secondKeys);
    }

    transaction.hash = crypto.getHash(transaction);
    return transaction;
}

module.exports = {
    createContact : createContact
}