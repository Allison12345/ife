var util = require('./util');
var Pointer = require('./Pointer');

function Direction(angle) {
    this.angle = util.cycle(angle);
}

Direction.EAST = new Direction(0);
Direction.NORTH = new Direction(90);
Direction.WEST = new Direction(180);
Direction.SOUTH = new Direction(270);

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
        return new Direction(this.angle + a);
    },
    clone: function(){
        return new Direction(this.angle);
    },
    // 把坐标轴体系的角度转换成css transform rotate 体系的角度
    forCSSRotation: function(){
        return util.cycle(90 - this.angle);
    },
    toString: function(){
        return this.angle;
    }
};
util.defineConstructor(Direction);

module.exports = Direction;
