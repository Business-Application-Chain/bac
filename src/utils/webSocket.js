var webSocket = require('websocket');
var WebSocketServer = webSocket.server;
var http = require('http');
var config = require('../../config.json');
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

var library, privated={}, socketConnect, self, conArray = [];

function WebSocket(scope, cb) {
    library = scope;
    self = this;
    self.__private = privated;
    privated.initWebSocket();
    setImmediate(cb, null, this);
}

// constructor
privated.initWebSocket = function () {
    server.listen(config.socket.port, function() {
        console.log((new Date()) + ' Server is listening on port ' + config.socket.port);
    });
    let wsServer = new WebSocketServer({
        httpServer: server,
        // You should not use autoAcceptConnections for production
        // applications, as it defeats all standard cross-origin protection
        // facilities built into the protocol and the browser.  You should
        // *always* verify the connection's origin and decide whether or not
        // to accept it.
        autoAcceptConnections: false,
        maxReceivedFrameSize:24944000000000,
    });

    wsServer.on('request', function(request) {
        if (!originIsAllowed(request.origin)) {
            // Make sure we only accept requests from an allowed origin
            // request.reject();
            console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
            return;
        }
        try {
            var connection = request.accept('echo-protocol', request.origin);
        } catch (e) {
            console.log(e);
            return;
        }

        // library.log.Info((new Date()) + ' Connection accepted.');
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                let msg = message.utf8Data;
                if(!msg.match(/102|201\|.*\|.*\|{.*}/)) {
                    console.log("正则无法通过");
                    return;
                }
                msg = msg.split('|');
                if(msg[0] === "102" && msg[1] === "loader" && msg[2] === "start") {
                    if(JSON.parse(msg[3]).status === 'blocksStatus') {
                        library.notification_center.notify("sendBlockStatus");
                    }
                } else if(msg[0] === '102' && msg[1] === 'blocks' && msg[2] === 'block') {
                    if(JSON.parse(msg[3]).status === 'lastBlock') {
                        library.notification_center.notify("sendLastBlock");
                    }
                } else if(msg[0] === '102' && msg[1] === 'transactions' && msg[2] === 'unconfirmed') {
                    if(JSON.parse(msg[3]).status === 'getUnconfirmed') {
                        library.notification_center.notify("sendUnconfirmedTrs");
                    }
                } else if(msg[0] === '102' && msg[1] === 'accounts' && msg[2] === 'miner') {
                    library.notification_center.notify("loginMiner");
                } else if(msg[0] === '102' && msg[1] === 'miner' && msg[2] === 'list') {
                    library.notification_center.notify('modifyMinerIp')
                } else if(msg[0] === '102' && msg[1] === 'kernel' && msg[2] === 'sign') {
                    library.notification_center.notify('shouldSign', msg[3]);
                } else if(msg[0] === '102' && msg[1] === 'kernel' && msg[2] === 'verify') {
                    library.notification_center.notify('shouldVerify', msg[3]);
                } else if(msg[0] === '201' && msg[1] === 'blocks' && msg[2] === 'newBlock') {
                    let newBlock = JSON.parse(msg[3]);
                    library.notification_center.notify('hasNewBlock', newBlock);
                } else if(msg[0] === '201' && msg[1] === 'kernel' && msg[2] === 'blocks') {
                    let addMap = JSON.parse(msg[3]);
                    library.notification_center.notify('addressNewBlock', addMap);
                }
            }
        });
        conArray.push(connection);
        connection.on('close', function(reasonCode, description) {
            conArray.remove(connection);
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });
    });
};

Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

WebSocket.prototype.send = function (data, cb) {
    if(!conArray) {
        cb('socketConnect do not ready');
    } else {
        conArray.forEach(function (itemSocket) {
            itemSocket.sendUTF(data);
        });
    }
};

// export
module.exports = WebSocket;