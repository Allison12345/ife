var util = require('./util');
var Factory = require('./Factory');

function Command(name, id, universe, star) {
    this.name = name;
    this.ship = new Factory(require('./SpaceShip'), universe, star).getProduct(id);
}

Command.prototype = {
    exe: function () {
        switch (this.name) {
            case 'init':
                break;
            case 'start':
                this.ship.start(0.1);
                break;
            case 'stop':
                this.ship.stop();
                break;
            case 'destroy':
                this.ship.destroy();
        }
    }
};
util.defineConstructor(Command);

module.exports = Command;
