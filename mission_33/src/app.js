var Board = require('./Board');
var Robot = require('./Robot');
var Direction = require('./Direction');
var Pointer = require('./Pointer');
var util = require('./util');

var board = new Board(10, 10);
var robot = new Robot(new Direction(90), new Pointer(3, 4));
board.drawRobot(robot);
util.append(document.body, board.createBoardView("board", 'url("./img/bg.png")'), 'left-top', 10, 10, true);

util.append(document.body, util.createEle("button", {
    "id": "go",
    "className": "btn go",
    "onclick": clickHandler
}, "go"), 'left-bottom', "10px", "40px");

util.append(document.body, util.createEle("button", {
    "id": "back",
    "className": "btn back",
    "onclick": clickHandler
}, "back"), 'left-bottom', "100px", "40px");

util.append(document.body, util.createEle("button", {
    "id": "turnLeft",
    "className": "btn turnLeft",
    "onclick": clickHandler
}, "turnLeft"), 'left-bottom', 10, 10, "px");

util.append(document.body, util.createEle("button", {
    "id": "turnRight",
    "className": "btn turnRight",
    "onclick": clickHandler
}, "turnRight"), 'left-bottom', 100, 10, "px");

util.append(document.body, util.createEle("button", {
    "id": "turnBack",
    "className": "btn turnBack",
    "onclick": clickHandler
}, "turnBack"), 'left-bottom', 190, 10, "px");

function clickHandler(e) {
    var action = e.target.id;
    robot[action]();
    util.log(util.getEle("logger"), action);
}

util.append(document.body, util.createEle("div", {
    "id": "logger",
    "className": "logger",
    "style": {
        "width": "300px",
        "height": "800px"
    }
}), 'right-top', "10px", "10px");


util.append(document.body, util.createEle("textarea", {
    "id": "cmdarea",
    "className": "cmdarea",
    "placeholder": "请输入要执行的命令",
    "cols": 30,
    "rows": 5,
    "autofocus": "autofocus",
    "onkeyup": keyHandler,

}), 'left-bottom', "10px", "100px");

function keyHandler(e){

}
