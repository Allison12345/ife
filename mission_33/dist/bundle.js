(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Pointer = require('./Pointer');
var util = require('./util');

function Board(w, h){
    this.width = w;
    this.height = h;
}
Board.prototype = {
    createBoardView: function(id){
        var boardView = util.createEle("div", id, 'boardView');
        boardView.style.width = util.getUnit(this.width);
        boardView.style.height = util.getUnit(this.height);
        boardView.appendChild(this.robot.view);
        return boardView;
    },
    drawRobot: function(robot){
        robot.setBoundary(Pointer.ORIGIN, new Pointer(this.width - 1, this.height - 1));
        robot.setView();
        this.robot = robot;
    }
};
util.defineConstructor(Board);

module.exports = Board;

},{"./Pointer":4,"./util":7}],2:[function(require,module,exports){
var Pointer = require('./Pointer');
var util = require('./util');

function Boundry(start, end){
    if(!(start instanceof Pointer))this.start = Pointer.ORIGIN;
    this.start = start;
    if(!(end instanceof Pointer))this.start = Pointer.ORIGIN;
    this.end = end;
}

Boundry.prototype = {
    getMinX: function(){
        return this.start.x < this.end.x ? this.start.x : this.end.x;
    },
    getMinY: function(){
        return this.start.y < this.end.y ? this.start.y : this.end.y;
    },
    getMaxX: function(){
        return this.start.x > this.end.x ? this.start.x : this.end.x;
    },
    getMaxY: function(){
        return this.start.y > this.end.y ? this.start.y : this.end.y;
    }
};
util.defineConstructor(Boundry);

module.exports = Boundry;

},{"./Pointer":4,"./util":7}],3:[function(require,module,exports){
var util = require('./util');
var Pointer = require('./Pointer');

function Direction(angle) {
    this.angle = util.cycle(angle);
}

Direction.EAST = new Direction(0);
Direction.NORTH = new Direction(90);
Direction.WEST = new Direction(180);
Direction.SOUTH = new Direction(270);

Direction.prototype = {
    getX: function() {
        return Math.cos(this.getRadian());
    },
    getY: function() {
        return Math.sin(this.getRadian());
    },
    getVector: function() {
        return new Pointer(this.getX(), this.getY());
    },
    getRadian: function() {
        return this.angle / 180 * Math.PI;
    },
    addAngle: function(a){
        return new Direction(this.angle + a);
    },
    clone: function(){
        return new Direction(this.angle);
    },
    // 把坐标轴体系的角度转换成css transform rotate 体系的角度
    forCSSRotation: function(){
        return util.cycle(90 - this.angle);
    },
    toString: function(){
        return this.angle;
    }
};
util.defineConstructor(Direction);

module.exports = Direction;

},{"./Pointer":4,"./util":7}],4:[function(require,module,exports){
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

},{"./util":7}],5:[function(require,module,exports){
var Pointer = require('./Pointer');
var Direction = require('./Direction');
var Boundary = require('./Boundary');
var util = require('./util');

function Robot(direction, pointer, runningSpeed, rotatingSpeed) {
    // 默认朝向：NORTH
    if (!(direction instanceof Direction)) this.direction = Direction.EAST;
    else this.direction = direction;
    // 默认坐标：(0, 0), 左下角为原点
    if (!(pointer instanceof Pointer)) this.pointer = Pointer.ORIGIN;
    else this.pointer = pointer;
    // 默认行走速度为 0.002 unit/ms
    if (!runningSpeed) this.runningSpeed = 0.002;
    else this.runningSpeed = runningSpeed;
    // 默认转速为 0.36/ms
    if (!rotatingSpeed) this.rotatingSpeed = 0.36;
    else this.rotatingSpeed = rotatingSpeed;
}

Robot.prototype = {
    go: function(step) {
        this.updatePointerView(this.pointer.clone(), Math.abs(step) / this.runningSpeed);
    },
    back: function(step) {
        this.go(-step);
    },
    //逆时针旋转
    turn: function(angle) {
        this.updateDirectionView(this.direction.clone(), Math.abs(angle) / this.rotatingSpeed);
    },
    turnRight: function() {
        this.turn(-90);
    },
    turnLeft: function() {
        this.turn(90);
    },
    turnBack: function() {
        this.turn(180);
    },
    setView: function() {
        var robotView = util.createEle("img", "robot", "robotView");
        robotView.src = './img/bug.png';
        robotView.style.width = util.getUnit(1);
        robotView.style.height = util.getUnit(1);
        this.view = robotView;
        this.updatePointerView(null, 0);
        this.updateDirectionView(null, 0);
    },
    updatePointerView: function(fromPointer, time) {
        var start = null,
            that = this;
        function move(timestamp) {
            if (!start) start = timestamp;
            var progress = (timestamp - start).toFixed();
            if (fromPointer) {
                that.pointer = fromPointer.add(that.direction.getVector().multiply(progress * that.runningSpeed));
                that.pointer.normalize(that.boundary);
            }
            that.view.style.left = util.getUnit(that.pointer.x);
            that.view.style.bottom = util.getUnit(that.pointer.y);
            if (progress < time) {
                window.requestAnimationFrame(arguments.callee);
            }
        }
        window.requestAnimationFrame(move);
    },
    updateDirectionView: function(fromDirection, time) {
        var start = null,
            that = this;

        function rotate(timestamp) {
            if (!start) start = timestamp;
            var progress = (timestamp - start).toFixed();
            if (fromDirection) {
                that.direction = fromDirection.addAngle(Math.round(progress * that.rotatingSpeed));
            }
            that.view.style.transform = 'rotate(' + that.direction.forCSSRotation() + 'deg)';
            if (progress < time) {
                window.requestAnimationFrame(arguments.callee);
            }
        }
        window.requestAnimationFrame(rotate);
    },
    setBoundary: function(startPoint, endPoint) {
        this.boundary = new Boundary(startPoint, endPoint);
    }
};
util.defineConstructor(Robot);

module.exports = Robot;

},{"./Boundary":2,"./Direction":3,"./Pointer":4,"./util":7}],6:[function(require,module,exports){
var Board = require('./Board');
var Robot = require('./Robot');
var Direction = require('./Direction');
var Pointer = require('./Pointer');
var util = require('./util');

var board = new Board(10, 10);
var robot  = new Robot(new Direction(90), new Pointer(0, 0));
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

},{"./Board":1,"./Direction":3,"./Pointer":4,"./Robot":5,"./util":7}],7:[function(require,module,exports){
var util = {
    defineConstructor: function(ClassObject) {
        Object.defineProperty(ClassObject.prototype, 'constructor', {
            value: ClassObject,
            enumerable: false
        });
    },
    createEle: function(name, id, className, value, text) {
        var ele = document.createElement(name);
        if (id) ele.id = id;
        if (className) ele.className = className;
        if(value)ele.value = value;
        if(text)ele.appendChild(document.createTextNode(text));
        return ele;
    },
    getEle: function(id){
        return document.getElementById(id);
    },
    cycle: function(angle){
        if (angle >= 0) return angle % 360;
        else return 360 - (-angle) % 360;
    },
    getUnit: function(x, unit){
        if(!unit) unit = 50;
        return (x * unit) + 'px';
    },
    limit: function (value, valueMin, valueMax){
        if(value < valueMin) return valueMin;
        else if(value > valueMax) return valueMax;
        return value;
    },
    parseCommand: function(cmdStr){
        var cmd = "", args = [];
        return {
            "cmd": cmd,
            "args":args
        };
    },
    parseCmds: function(cmdStrs){
        return cmdStrs.split("\r\n").map(function(cmdStr){
            return this.parseCommand(cmdStr);
        });
    }
};

module.exports = util;

},{}]},{},[6]);
