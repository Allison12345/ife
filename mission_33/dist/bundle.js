(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Pointer = require('./Pointer');
var util = require('./util');

function Board(w, h) {
    this.width = w;
    this.height = h;
}
Board.prototype = {
    createBoardView: function(id, bgImg) {
        var boardView = util.createEle("div", {
            "id": id,
            "style": {
                "width": util.getUnit(this.width),
                "height": util.getUnit(this.height),
                "backgroundImage": bgImg
            }
        });
        util.append(boardView, this.robot.view, 'left-bottom', this.robot.pointer.x, this.robot.pointer.y);
        return boardView;
    },
    drawRobot: function(robot) {
        robot.setBoundary(Pointer.ORIGIN, new Pointer(this.width - 1, this.height - 1));
        robot.setView('robot', './img/bug.png');
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

var cm = new Map();
cm.set(/^go(\s)+(-)?(\d)*$/i, Robot.prototype.go);
cm.set(/^back(\s)+(-)?(\d)*$/i, Robot.prototype.back);
cm.set(/^turn(\s)+(-)?(\d)*/i, Robot.prototype.turn);
cm.set(/^turn(\s)*l(eft)?$/i, Robot.prototype.turnLeft);
cm.set(/^turn(\s)*r(ight)?$/i, Robot.prototype.turnRight);
cm.set(/^turn(\s)*b(ack)?$/i, Robot.prototype.turnBack);
Robot.CmdMap = cm;

Robot.prototype = {
    go: function(step) {
        if (step > 0) {
            this.updatePointerView(this.pointer.clone(), Math.abs(step) / this.runningSpeed, 1);
        } else if (step < 0) {
            this.back(-step);
        }
    },
    back: function(step) {
        if (step > 0) {
            this.updatePointerView(this.pointer.clone(), Math.abs(step) / this.runningSpeed, -1);
        } else if (step < 0) {
            this.go(-step);
        }
    },
    //逆时针旋转
    turn: function() {
        if (typeof arguments[0] === 'number') {
            if (arguments[0] > 0) {
                this.updateDirectionView(this.direction.clone(), Math.abs(arguments[0]) / this.rotatingSpeed, 1);
            } else if (arguments[0] < 0) {
                this.updateDirectionView(this.direction.clone(), Math.abs(arguments[0]) / this.rotatingSpeed, -1);
            }
        } else if (typeof arguments[0] === 'string') {
            if (typeof arguments[1] === 'number') {

            } else {

            }
        }
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
    setView: function(id, imgSrc) {
        this.view = util.createEle("img", {
            "id": id,
            "className": "robotView",
            "src": imgSrc,
            "style": {
                "width": util.getUnit(1),
                "height": util.getUnit(1),
            }
        });
    },
    updatePointerView: function(fromPointer, time, isPositive) {
        var start = null,
            that = this;

        function move(timestamp) {
            if (!start) start = timestamp;
            var progress = (timestamp - start).toFixed();
            that.pointer = fromPointer.add(that.direction.getVector().multiply(isPositive * progress * that.runningSpeed));
            that.pointer.normalize(that.boundary);
            that.view.style.left = util.getUnit(that.pointer.x);
            that.view.style.bottom = util.getUnit(that.pointer.y);
            if (progress < time) {
                window.requestAnimationFrame(arguments.callee);
            }
        }
        window.requestAnimationFrame(move);
    },
    updateDirectionView: function(fromDirection, time, isPositive) {
        var start = null,
            that = this;

        function rotate(timestamp) {
            if (!start) start = timestamp;
            var progress = (timestamp - start).toFixed();
            that.direction = fromDirection.addAngle(Math.round(isPositive * progress * that.rotatingSpeed));
            that.view.style.transform = 'rotate(' + that.direction.forCSSRotation() + 'deg)';
            if (progress < time) {
                window.requestAnimationFrame(arguments.callee);
            }
        }
        window.requestAnimationFrame(rotate);
    },
    setBoundary: function(startPoint, endPoint) {
        this.boundary = new Boundary(startPoint, endPoint);
    },
    getCmdMap: function() {
        return Robot.CmdMap;
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


util.getEle("go").addEventListener('click', function(e) {
    robot.go(1);
    util.log(util.getEle("logger"), "robot go 1", "red");
});
util.getEle("back").addEventListener('click', function(e) {
    robot.back(1);
    util.log(util.getEle("logger"), "robot back 1", "red");
});
util.getEle("turnLeft").addEventListener('click', function(e) {
    robot.turnLeft();
    util.log(util.getEle("logger"), "robot turn left", "orange");
});
util.getEle("turnRight").addEventListener('click', function(e) {
    robot.turnRight();
    util.log(util.getEle("logger"), "robot turn right", "orange");
});
util.getEle("turnBack").addEventListener('click', function(e) {
    robot.turnBack();
    util.log(util.getEle("logger"), "robot turn back", "orange");
});

},{"./Board":1,"./Direction":3,"./Pointer":4,"./Robot":5,"./util":7}],7:[function(require,module,exports){
var util = {
    defineConstructor: function(ClassObject) {
        Object.defineProperty(ClassObject.prototype, 'constructor', {
            value: ClassObject,
            enumerable: false
        });
    },
    createEle: function(name, attrs, text) {
        var ele = document.createElement(name);
        this.recurAssign(ele, attrs);
        if (text) ele.appendChild(document.createTextNode(text));
        return ele;
    },
    recurAssign: function(obj, attrs) {
        for (var key in attrs) {
            if (typeof attrs[key] === 'object') {
                this.recurAssign(obj[key], attrs[key]);
            } else {
                obj[key] = attrs[key];
            }
        }
    },
    append: function(container, child, type, x, y, measure) {
        var refer = type.split('-');
        if (refer.length > 0) {
            child.style.position = 'absolute';
            child.style[refer[0]] = this.getUnit(x, null, measure);
            child.style[refer[1]] = this.getUnit(y, null, measure);
        }
        container.appendChild(child);
    },
    getEle: function(id) {
        return document.getElementById(id);
    },
    cycle: function(angle) {
        if (angle >= 0) return angle % 360;
        else return 360 - (-angle) % 360;
    },
    getUnit: function(x, unit, measure) {
        if (isNaN(x)) return x;
        if (measure) return x + measure;
        if (!unit) unit = this.defaultValues.unit;
        measure = this.defaultValues.measure;
        return (x * unit) + measure;
    },
    limit: function(value, valueMin, valueMax) {
        if (value < valueMin) return valueMin;
        else if (value > valueMax) return valueMax;
        return value;
    },
    trim: function(str) {
        if (String.prototype.trim) {
            return str.trim();
        } else {
            return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        }
    },
    log: function(container, str, color) {
        var timeP = this.createEle("p", {
            "className": "logTime"
        }, new Date().toLocaleString());
        if (!color) color = 'white';
        var logP = this.createEle("p", {
            'style': {
                'color': color,
                'marginBottom': '0.5em'
            }
        }, str);
        container.appendChild(timeP);
        container.appendChild(logP);
    },
    'defaultValues': {
        'unit': 50,
        'measure': 'px',
        'step': 1,
        'angle': 90
    }
};

module.exports = util;

},{}]},{},[6]);
