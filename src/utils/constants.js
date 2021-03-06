'use strict';

module.exports = {
    maxAmount: 10000000000,
    blockHeaderLength: 248,
    addressLength: 208,
    maxAddressLength: 208 * 128,
    maxClientConnections: 100,
    numberLength: 100000000000,
    feeStartVolume: 1000000 * 100000000,
    feeStart: 1,
    maxRequest: 10000 * 12,
    requestLength: 104,
    signatureLength: 196,
    maxMultiSignaturesLength: 196 * 256,
    maxConfiramtions: 77 * 100,
    confirmationLength: 77,
    fixedPoint: Math.pow(10, 8),
    totalAmount: 10000000000000000,

    // slots
    interval: 10,
    delegates: 1
}