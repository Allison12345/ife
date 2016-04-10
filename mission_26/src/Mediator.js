var util = require('./util');
var Command = require('./Command');

function Mediator() {
    this.cmdQue = [];
}
Mediator.prototype = {
    getCmd: function (cmdStr, id, universe, star) {
        // 命令丢包率 30%
        // if (Math.random() > 0.3) 
        this.cmdQue.push(new Command(cmdStr, id, universe, star));
    },
    sendCmd: function () {
        while (this.cmdQue.length > 0) {
            this.cmdQue.shift().exe();
        }
    }
};
util.defineConstructor(Mediator);

module.exports = Mediator;
