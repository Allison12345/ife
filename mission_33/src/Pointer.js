var util = require('./util');

function Pointer(x, y){
    this.x = x;
    this.y = y;
}

Pointer.prototype = {
    multiply: function(multiple){
        return new Pointer(this.x * multiple, this.y * multiple);
    },
    add: function(pointer){
        return new Pointer(this.x + pointer.x, this.y + pointer.y);
    }
};
util.defineConstructor(Pointer);

module.exports = Pointer;
