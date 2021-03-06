var Board = require('./Board');
var Robot = require('./Robot');
var Command = require('./Command');
var Direction = require('./Direction');
var Pointer = require('./Pointer');

var Dispatcher = require('./Dispatcher');
var util = require('./util');

var board = new Board(10, 10);
var robot = new Robot(new Direction(90), new Pointer(3, 4));
board.drawRobot(robot);
var dispatcher = new Dispatcher();

util.append(document.body, board.createBoardView("board", 'url("./img/bg.png")'), 'left-top', 10, 10, true);

util.append(document.body, util.createEle("button", {
    "id": "go",
    "value": 2,
    "className": "btn go",
    "onclick": clickHandler
}, "go"), 'left-bottom', "10px", "40px");

util.append(document.body, util.createEle("button", {
    "id": "back",
    "value": "3",
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
    var ele = e.target;
    var cmd = new Command(robot, ele.id);
    cmd.parse(ele.id + " " + ele.value);
    dispatcher.bind(cmd);
}

util.append(document.body, util.createEle("div", {
    "id": "logger",
    "className": "logger",
    "style": {
        "width": "300px",
        "height": "600px"
    }
}), 'right-top', "10px", "10px");


util.append(document.body, util.createEle("textarea", {
    "id": "cmdarea",
    "className": "cmdarea",
    "placeholder": "请输入要执行的命令",
    "cols": 20,
    "rows": 5,
    "autofocus": "autofocus",
    "onkeyup": keyHandler,

}), 'right-top', "320px", "10px");

util.append(document.body, util.createEle("button", {
    "id": "exe",
    "className": "btn",
    "onclick": function(){
        dispatcher.start();
    }
}, "exe"), 'right-top', "350px", "140px");

function keyHandler(e){
    if(e.ctrlKey && e.keyCode===13){
        Command.getCmds(robot, e.target.value).forEach(function(cmd){
            dispatcher.bind(cmd);
        });
    }
}
