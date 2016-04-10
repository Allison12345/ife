var util = require('./util');
var Command = require('./Command');

function Mediator() {
    this.cmdQue = [];
}
Mediator.prototype = {
    getCmd: function(cmdStr, id) {
        // 命令丢包率 30%
        if(Math.random() > 0.3)this.cmdQue.push(new Command(cmdStr, id));
    },
    sendCmd: function(){

    }
};
util.defineConstructor(Mediator);

module.exports = Mediator;
