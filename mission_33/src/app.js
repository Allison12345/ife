var Board = require('./Board');
var Robot = require('./Robot');
var Direction = require('./Direction');
var Pointer = require('./Pointer');
var util = require('./util');

var board = new Board(10, 10);
var robot  = new Robot(new Direction(90), new Pointer(2, 3));
board.drawRobot(robot);
document.body.appendChild(board.createBoardView("board"));
document.body.appendChild(util.createEle("button", "go", "btn go", "go", "go"));
document.body.appendChild(util.createEle("button", "turn", "btn turn", "turnLeft", "turnLeft"));

util.getEle("go").addEventListener('click', function(e){
    robot.go(1);
});

util.getEle("turn").addEventListener('click', function(e){
    robot.turnLeft();
});
