var util = require('./util');
var MsgQue = require('./MsgQue');

function Dispatcher() {
    this.going = false;
    this.mq = new MsgQue();
}

Dispatcher.prototype = {
    bind: function (cmd) {
        util.log(null, cmd, 'red');
        this.mq.push(cmd);
        this.start();
    },
    detach: function (cmd) {
        this.mq.del(cmd);
        this.start();
    },
    start: function () {
        this.going = true;
        if (this.going && this.mq.size() > 0) this.mq.pop().exe(this);
    },
    stop: function () {
        this.going = false;
    }
};
util.defineConstructor(Dispatcher);

module.exports = Dispatcher;
