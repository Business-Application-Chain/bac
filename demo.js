var crypto = require('crypto');
var bignum = require('./src/utils/bignum.js');
var ByteBuffer = require('bytebuffer');

/*let txObj = {
    "type": 0,
    "amount": 1500000000,
    "senderPublicKey": "5fc2064876ab7a76463077a62e6d8952c1f5d63d138857a0db768aec3b7cee4a",
    "requesterPublicKey": null,
    "timestamp": 64314266,
    "asset": {},
    "recipientId": "4617009713033991902L",
    "recipientUsername": null
};*/

//15709944306369257626
let txObj = {
    "type": 0,
    "amount": 1500000000,
    "senderPublicKey": "5fc2064876ab7a76463077a62e6d8952c1f5d63d138857a0db768aec3b7cee4a",
    "requesterPublicKey": null,
    "timestamp": 64322089,
    "asset": {},
    "recipientId": "4617009713033991902L",
    "recipientUsername": null,
    "signature": "10a319f23c2e9f26da01ba2bed8d055f999641a39775b7b32993b2411730ec35af19e1fac47aa2d37e0be19a842f44a3c0b5943d9ce5c2462b48b464ef405202"
};

function getBytes(txObj, skipSignature, skipSecondSignature) {

    var bb = new ByteBuffer(1 + 4 + 32 + 32 + 8 + 8 + 64 + 64, true);
    bb.writeByte(txObj.type);
    bb.writeInt(txObj.timestamp);
    var senderPublicKeyBuffer = new Buffer(txObj.senderPublicKey, 'hex');
    for (var i = 0; i < senderPublicKeyBuffer.length; i++) {
        bb.writeByte(senderPublicKeyBuffer[i]);
    }
    if (txObj.requesterPublicKey) {
        var requesterPublicKeyBuffer = new Buffer(txObj.requesterPublicKey, 'hex');
        for (var i = 0; i < requesterPublicKeyBuffer.length; i++) {
            bb.writeByte(requesterPublicKeyBuffer[i]);
        }
    }

    if (txObj.recipientId) {
        var recipient = txObj.recipientId.slice(0, -1);
        recipient = bignum(recipient).toBuffer({size: 8});

        for (var i = 0; i < 8; i++) {
            bb.writeByte(recipient[i] || 0);
        }
    } else {
        for (var i = 0; i < 8; i++) {
            bb.writeByte(0);
        }
    }

    bb.writeLong(txObj.amount);

    if (!skipSignature && txObj.signature) {
        var signatureBuffer = new Buffer(txObj.signature, 'hex');
        for (var i = 0; i < signatureBuffer.length; i++) {
            bb.writeByte(signatureBuffer[i]);
        }
    }

    if (!skipSecondSignature && txObj.signature) {
        var signSignatureBuffer = new Buffer(txObj.signature, 'hex');
        for (var i = 0; i < signSignatureBuffer.length; i++) {
            bb.writeByte(signSignatureBuffer[i]);
        }
    }

    bb.flip();
    return bb.toBuffer();
}

function getHash(txObj) {
    return crypto.createHash('sha256').update(getBytes(txObj)).digest();
}

function getIds(txObj) {
    var hash = getHash(txObj);
    var temp = new Buffer(8);
    for (var i = 0; i < 8; i++) {
        temp[i] = hash[7 - i];
    }

    var id = bignum.fromBuffer(temp).toString();
    return id;
}

console.log(getIds(txObj));

// 009a5bd5035fc2064876ab7a76463077a62e6d8952c1f5d63d138857a0db768aec3b7cee4a4012e9df3deb56de002f685900000000
// 009a5bd5035fc2064876ab7a76463077a62e6d8952c1f5d63d138857a0db768aec3b7cee4a4012e9df3deb56de002f685900000000
// 07fed27317806b026356320ecc0553594c855ad41ffc6b1371575fd7d47a32e6c5776463f10f4bac21fe55ec5f3f99adb56dbec105c26f418d97a78bf225b20307fed27317806b026356320ecc0553594c855ad41ffc6b1371575fd7d47a32e6c5776463f10f4bac21fe55ec5f3f99adb56dbec105c26f418d97a78bf225b203
// 009a5bd5035fc2064876ab7a76463077a62e6d8952c1f5d63d138857a0db768aec3b7cee4a4012e9df3deb56de002f68590000000007fed27317806b026356320ecc0553594c855ad41ffc6b1371575fd7d47a32e6c5776463f10f4bac21fe55ec5f3f99adb56dbec105c26f418d97a78bf225b20307fed27317806b026356320ecc0553594c855ad41ffc6b1371575fd7d47a32e6c5776463f10f4bac21fe55ec5f3f99adb56dbec105c26f418d97a78bf225b203