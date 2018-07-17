#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
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
        autoAcceptConnections: false
    });

    wsServer.on('request', function(request) {
        if (!originIsAllowed(request.origin)) {
            // Make sure we only accept requests from an allowed origin
            // request.reject();
            console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
            return;
        }

        var connection = request.accept('echo-protocol', request.origin);
        console.log((new Date()) + ' Connection accepted.');
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                console.log('Received Message: ' + message.utf8Data);
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