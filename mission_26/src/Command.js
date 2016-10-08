var util = require('./util');

function Command(name, id, factory) {
    this.name = name;
    this.id = id;
    this.factory = factory;
}

Command.prototype = {
    exe: function () {
        this.factory.operate(this.name, this.id);
    }
};
util.defineConstructor(Command);

module.exports = Command;
