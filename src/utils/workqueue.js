var util = require('util');
var extend = require('extend');

function WorkQueue(config) {
    var __default = {
        onWarning: null,
        warningLimit: 50
    }
    __default = extend(__default, config);
    var self = this;
    this.queue = [];

    setImmediate(function nextQueueTick() {
        if (__default.onWarning && self.queue.length > __default.warningLimit) {
            __default.onWarning(self.queue.length, __default.warningLimit);
        }
        self.__tick(function () {
            setTimeout(nextQueueTick, 3);
        });
    });
}

WorkQueue.prototype.__tick = function (cb) {
    var singletask = this.queue.shift();
    if (!singletask) {
        return setImmediate(cb);
    }
    var args = [function (err, res) {
        singletask.done && setImmediate(singletask.done, err, res);
        setImmediate(cb);
    }];
    if (singletask.args) {
        args = args.concat(singletask.args);
    }
    singletask.worker.apply(singletask.worker, args);
}

WorkQueue.prototype.add = function (worker, args, done) {
    if (!done && args && typeof(args) == 'function') {
        done = args;
        args = undefined;
    }
    if (worker && typeof(worker) == 'function') {
        var newtask = {
            worker: worker,
            done: done
        };
        if (util.isArray(args)) {
            newtask.args = args;
        }
        this.queue.push(newtask);
    }
}

WorkQueue.prototype.count = function () {
    return this.queue.length;
}

module.exports = WorkQueue;

