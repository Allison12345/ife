var util = require('./util');
var Pointer = require('./Pointer');

function Direction(angle) {
    this.angle = Direction.cycle(angle);
}

Direction.EAST = new Direction(0);
Direction.NORTH = new Direction(90);
Direction.WEST = new Direction(180);
Direction.SOUTH = new Direction(270);

Direction.cycle = function(angle) {
    if (angle >= 0) return angle % 360;
    else return 360 - (-angle) % 360;
};

Direction.prototype = {
    getX: function() {
        return Math.cos(this.getRadian());
    },
    getY: function() {
        return Math.sin(this.getRadian());
    },
    getVector: function() {
        return new Pointer(this.getX(), this.getY());
    },
    getRadian: function() {
        return this.angle / 180 * Math.PI;
    },
    addAngle: function(a){
        this.angle = Direction.cycle(this.angle + a);
    }
};
util.defineConstructor(Direction);

module.exports = Direction;
