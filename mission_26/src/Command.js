var util = require('./util');

function Command(name, id, factory) {
    this.name = name;
    this.ship = factory.getProduct(id);
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
