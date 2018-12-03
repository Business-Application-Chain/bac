var strftime = require('strftime');
var gray = require('ansi-gray');
var blue = require('ansi-blue');
var green = require('ansi-green');
var yellow = require('ansi-yellow');
var red = require('ansi-red');
var path = require('path');
var fs = require('fs');
var root = require('app-root-path');

function getTimestamp() {
    return '[' + strftime('%m-%d|%H:%M:%S', new Date()) + ']';
}

module.exports = function (config) {
    config = config || {};

    config.levels = config.levels || {
        'Trace': 0,
        'Debug': 1,
        'Info': 2,
        'Warn': 3,
        'Error': 4,
        'Fatal': 5
    };

    config.colors = config.colors || {
        'Trace': gray,
        'Debug': blue,
        'Info': green,
        'Warn': yellow,
        'Error': red,
        'Fatal': red
    }

    config.filepath = config.filepath || root + '/default.log';

    config.recLevel = config.recLevel || 'Warn';

    var output = fs.createWriteStream(config.filepath, {flags: 'a'});

    var exports = {};

    exports.setRecordLevel = function (recLevel) {
        config.recLevel = recLevel;
    };

    Object.keys(config.levels).forEach(function (level) {
        function log() {
            var messages = [], messages_orig = [];

            // var firstmsg = arguments[0] + Array(40).join(' ');
            var firstmsg = arguments[0];
            if (firstmsg.length < 40) {
                firstmsg = arguments[0] + Array(40).join(' ');
                messages.push(firstmsg.substring(0, 40));
            } else {
                messages.push(firstmsg);
            }
            messages_orig.push(arguments[0]);

            for (let i = 1; i < arguments.length; i++) {
                if (i % 2 !== 0) {
                    messages.push(config.colors[level](arguments[i]) + '=' + arguments[i + 1]);
                    messages_orig.push(arguments[i] + '=' + arguments[i + 1]);
                } else {
                    continue;
                }
            }

            var params = {
                'level': level.toUpperCase(),
                'timestamp': getTimestamp(),
                'message': messages_orig.join(' '),
            };

            if (level.length > 4) {
                params.level = level.toUpperCase().substring(0, 2) + level.toUpperCase().substring(level.length - 2, level.length);
            }

            if (arguments[0] && arguments[0].length > 0) {
                output.write(JSON.stringify(params) + '\n');
            }

            if (config.echo && config.levels[config.echo] <= config.levels[level]) {
                try {

                    console.log(config.colors[level](params.level) + ' ' + params.timestamp + ' ' + messages.join(' '));
                } catch (e) {
                    console.log(e.toString());
                }
            }
        }

        exports[level] = log;
    });

    return exports;
};

