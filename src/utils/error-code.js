/**
 * server: 200 and 110xx
 * */
const server = {
    SUCCESS: 200,
    MISSING_PARAMS: 11000,
    ACCOUNT_ERROR: 11003,
    NOT_ENOUGH_TOKEN: 11004,
    TRANSACTION_NOT_READY: 11005,
    SERVER_ERROR: 11006,
    TRANSACTION_NOT_TYPE: 11007
};

/**
 * peer: 11001 and 11002
 * */
const peer = {
    GET_COUNT_ERR: 11001,
    GET_PEER_FAILURE: 11002
};

/**
 * blocks: 120xx
 * */
const blocks = {
    GET_BLOCK_FAILURE: 12001,
    GET_BLOCK_LIST_FAILURE: 12002,
    NOT_FIND_BLOCK: 12003
};

/**
 * transactions: 130xx
 *
 * */
const transactions = {
    GET_TRANSACTIONS_FAILURE: 13001,
    GET_TRANSACTIONS_BY_BLOCK_FAILURE: 13002,
    CAN_NOT_FIND_BLOCK: 13003,
    CAN_NOT_FIND_TRANSACTION: 13004,
    INVALID_PASSPHRASE: 13005,
    RECIPIENT_NOT_FOUND: 13006,
    INVALID_ACCOUNT: 13007,
    INVALID_SECOND_PASSPHRASE: 13008,
    ADD_TRANSACTION_FAILURE: 13009
};

/**
 * contacts: 140xx
 * */
const contacts = {
    GET_CONTACT_ACCOUNT_FAILURE: 14001,
    CONTACT_ACCOUNT_NOT_FOUND: 14002,
    ADD_CONTACT_FAILURE: 14003,
    GET_CONTACT_LIST_FAILURE: 14004,
    GET_CONTACT_COUNT_FAILURE: 14005
};

/**
 * account: 150xx
 * */
const account = {
    ADD_USERNAME_FAILURE: 15001,
    OPEN_USER_FAILURE: 15002,
    ACCOUNT_NOT_FOUND: 15003,
    ADD_SIGNATURES_FAILURE: 15004,
    NOT_FIND_ADDRESS: 15005,
    WILL_LOCK: 15006,
    IS_LOCKING: 15007
};

/**
 * kernel: 160xx
 * */
const kernel = {
    GET_PEER_LIST_FAILURE: 16001,
    GET_BLOCKS_FAILURE: 16002,
    GET_TRANSACTION_LIST_FAILURE: 16003,
    INVALID_TRANSACTION_BODY: 16004,
    ADD_TRANSACTION_FAILURE: 16005
};

/**
 * dapp: 170xx
 * */
const dapp = {
    GET_DAPP_INFO_ERROR: 17001,
    SEARCH_DAPP_LIST_FAILURE: 17002,
    UPLOAD_DAPP_FAILURE: 17003,
    DO_DAPP_FAILURE: 17004,
    TRANSFER_DAPP_FAILURE: 17005,
    IS_NOT_DAPP_ADMIN: 17006,
    DAPP_NOT_FIND: 17007,
    DAPP_IS_ERROR: 17008,
    GAS_IN_NOT_ENOUGH: 17009,
    DAPP_MISS_MUST_PARAMS: 17010
};

const miner = {
    SET_MINER_IP_ERROR: 18001,
}

module.exports = {
    server: server,
    peer: peer,
    blocks: blocks,
    transactions: transactions,
    contacts: contacts,
    account: account,
    kernel: kernel,
    dapp: dapp,
    miner: miner
};