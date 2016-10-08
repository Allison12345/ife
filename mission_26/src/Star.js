var util = require('./util');
var Coordinate = require('./Coordinate');

function Star(radius) {
    this.radius = radius;
}
Star.prototype = {
    getCoordinate: function() {
        return this.center.move(-this.radius, this.radius);
    },
    setCenter: function(x, y){
        this.center = new Coordinate(x, y);
    },
    getView: function(){
        var size = 2 * this.radius;
        var viewDiv = util.createDom("div", {
            className: 'star',
            style:{
                width: size + 'px',
                height: size + 'px'
            }
        });
        return viewDiv;
    }
};
util.defineConstructor(Star);

module.exports = Star;
