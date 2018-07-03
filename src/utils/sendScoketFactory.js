var resTitle = '201|bac|' + Date.now() + '|';
var reqTitle = '102|bac|' + Date.now() + '|';

function sendNewBlocks(data) {
    return resTitle + 'blocks|newBlock|' + JSON.stringify({result:data});
}

module.exports = sendNewBlocks();