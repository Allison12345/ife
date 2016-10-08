var util = require('./util');

function MsgQue() {
    this.msgs = [];
}

MsgQue.prototype = {
    del: function(cmd) {
        for (var i = 0; i < this.msgs.length; i++) {
            if(cmd === this.msgs[i]){
                this.msgs.splice(i, 1);
                break;
            }
        }
    },
    push: function(cmd) {
        this.msgs.push(cmd);
    },
    pop: function() {
        return this.msgs.shift();
    },
    size: function() {
        return this.msgs.length;
    }
};

util.defineConstructor(MsgQue);

module.exports = MsgQue;
