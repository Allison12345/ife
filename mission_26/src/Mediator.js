var util = require('./util');
var Command = require('./Command');
var Factory = require('./Factory');

function Mediator(universe, star) {
    this.cmdQue = [];
    this.shipFactory = new Factory(require('./SpaceShip'), universe, star);
}
Mediator.prototype = {
    getCmd: function (cmdStr, id) {
        // 命令丢包率 30%
        // if (Math.random() > 0.3)
        this.cmdQue.push(new Command(cmdStr, id, this.shipFactory));
    },
    sendCmd: function () {
        while (this.cmdQue.length > 0) {
            this.cmdQue.shift().exe();
        }
    }
};
util.defineConstructor(Mediator);

module.exports = Mediator;
