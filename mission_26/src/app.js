var Universe = require('./Universe');
var Star = require('./Star');
var SpaceShip = require('./SpaceShip');
var Mediator = require('./Mediator');
var util = require('./util');

var universe = new Universe(800, 600);
var star = new Star(150);
universe.addStar(star);
var connector = new Mediator(universe, star);
var id = 0;
util.get("init").addEventListener('click', mouseHandler);
util.get("start").addEventListener('click', mouseHandler);
util.get("stop").addEventListener('click', mouseHandler);
util.get("destroy").addEventListener('click', mouseHandler);
function mouseHandler(e) {    
    if(e.target.id === 'init')id++;
    connector.getCmd(e.target.id, id);
    connector.sendCmd();
}
