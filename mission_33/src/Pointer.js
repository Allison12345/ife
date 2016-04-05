var util = require('./util');

function Pointer(x, y){
    this.x = x;
    this.y = y;
}

Pointer.ORIGIN = new Pointer(0, 0);

Pointer.prototype = {
    multiply: function(multiple){
        return new Pointer(this.x * multiple, this.y * multiple);
    },
    add: function(pointer){
        return new Pointer(this.x + pointer.x, this.y + pointer.y);
    },
    normalize: function(boundary){
        this.x = util.limit(this.x, boundary.getMinX(), boundary.getMaxX());
        this.y = util.limit(this.y, boundary.getMinY(), boundary.getMaxY());
    },
    clone: function(){
        return new Pointer(this.x, this.y);
    },
    toString: function(){
        return "(" + this.x + ", "+ this.y + ")";
    }
};
util.defineConstructor(Pointer);

module.exports = Pointer;
