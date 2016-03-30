var Pointer = require('./Pointer');
var util = require('./util');

function Boundry(start, end){
    if(!(start instanceof Pointer))this.start = Pointer.ORIGIN;
    this.start = start;
    if(!(end instanceof Pointer))this.start = Pointer.ORIGIN;
    this.end = end;
}

Boundry.prototype = {
    getMinX: function(){
        return this.start.x < this.end.x ? this.start.x : this.end.x;
    },
    getMinY: function(){
        return this.start.y < this.end.y ? this.start.y : this.end.y;
    },
    getMaxX: function(){
        return this.start.x > this.end.x ? this.start.x : this.end.x;
    },
    getMaxY: function(){
        return this.start.y > this.end.y ? this.start.y : this.end.y;
    }
};
util.defineConstructor(Boundry);

module.exports = Boundry;
