var Universe = require('./Universe');
var Star = require('./Star');
var SpaceShip = require('./SpaceShip');
var Mediator = require('./Mediator');
var util = require('./util');

var universe = new Universe(800, 600);
var star = new Star(150);
universe.addStar(star);
var ship = new SpaceShip(60, 20).init(1, star.radius + 90, 0, star.center, {
    x: 0,
    y: universe.height
});
universe.addEle(ship);
var connector = new Mediator();
// var id = 0;
//
// util.get("init").addListener('click', mouseHandler);
util.get("start").addEventListener('click', mouseHandler);
// util.get("stop").addListener('click', mouseHandler);
//
function mouseHandler(e) {
    ship.start(0.1);
}
