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
        this.angle = util.cycle(this.angle + a);
    },
    clone: function(){
        return new Direction(this.angle);
    },
    // 把坐标轴体系的角度转换成css transform rotate 体系的角度
    forCSSRotation: function(){
        return util.cycle(90 - this.angle);
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
        this.x += pointer.x;
        this.y += pointer.y;
    },
    normalize: function(boundary){
        this.x = util.limit(this.x, boundary.getMinX(), boundary.getMaxX());
        this.y = util.limit(this.y, boundary.getMinY(), boundary.getMaxY());
    },
    clone: function(){
        return new Pointer(this.x, this.y);
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
    // 默认坐标：(0, 0), 左下角为原点
    if (!(pointer instanceof Pointer)) this.pointer = Pointer.ORIGIN;
    else this.pointer = pointer;
    // 默认朝向：NORTH
    if (!(direction instanceof Direction)) this.direction = Direction.EAST;
    this.direction = direction;
    // 默认行走速度为 2unit/s
    if (!runningSpeed) this.runningSpeed = 2;
    this.runningSpeed = runningSpeed;
    // 默认转速为 360°/s
    if (!rotatingSpeed) this.rotatingSpeed = 360;
    this.rotatingSpeed = rotatingSpeed;
}

Robot.prototype = {
    go: function(step) {
        this.pointer.add(this.direction.getVector().multiply(step));
        this.pointer.normalize(this.boundary);
        this.updatePointerView();
    },
    back: function(step) {
        this.go(-step);
    },
    //逆时针旋转
    turn: function(angle) {
        this.direction.addAngle(angle);
        this.updateDirectionView();
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
        this.updatePointerView();
        this.updateDirectionView();
    },
    updatePointerView: function() {
        this.view.style.left = util.getUnit(this.pointer.x);
        this.view.style.bottom = util.getUnit(this.pointer.y);
    },
    updateDirectionView: function() {
        this.view.style.transform = 'rotate(' + this.direction.forCSSRotation() + 'deg)';
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
    }
};

module.exports = util;

},{}]},{},[6]);
