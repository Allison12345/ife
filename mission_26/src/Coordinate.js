function Coordinate(x, y){
    this.x = x;
    this.y = y;
}
Coordinate.prototype = {
    toLT: function(x, y){
        return {
            left: (this.x - x).toFixed() + 'px',
            top: (y - this.y).toFixed() + 'px'
        };
    },
    move: function(x, y){
        return new Coordinate(this.x + x, this.y + y);
    }
};

module.exports = Coordinate;
