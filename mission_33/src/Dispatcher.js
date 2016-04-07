var util = require('./util');
var MsgQue = require('./MsgQue');

function Dispatcher(){
    this.going = false;
    this.mq = new MsgQue();
}

Dispatcher.prototype = {
    bind: function(cmd){
        this.mq.push(cmd);
        this.start();
    },
    detach: function(cmd){
        this.mq.del(cmd);
        this.start();
    },
    start: function(){
        this.going = true;
        while(mq.size() > 0 && this.going){
            mq.pop().exe();
        }
    },
    stop: function(){
        this.going = false;
    }
};
util.defineConstructor(Dispatcher);

module.exports = Dispatcher;
