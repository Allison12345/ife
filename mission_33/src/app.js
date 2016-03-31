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
document.body.appendChild(util.createEle("button", "back", "btn back", "back", "back"));
document.body.appendChild(util.createEle("button", "turnLeft", "btn turnLeft", "turnLeft", "turnLeft"));
document.body.appendChild(util.createEle("button", "turnRight", "btn turnRight", "turnRight", "turnRight"));
document.body.appendChild(util.createEle("button", "turnBack", "btn turnBack", "turnBack", "turnBack"));

util.getEle("go").addEventListener('click', function(e){
    robot.go(1);
});

util.getEle("turnLeft").addEventListener('click', function(e){
    robot.turnLeft();
    console.log(robot.direction.toString());
});
