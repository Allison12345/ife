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

},{"./Pointer":7,"./util":10}],2:[function(require,module,exports){
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

},{"./Pointer":7,"./util":10}],3:[function(require,module,exports){
var util = require('./util');

function Command(master, name, func, args){
    this.master = master;
    if(name)this.name = name;
    if(func)this.func = func;
    if(!args) this.args = [];
    else this.args = args;
}

Command.prototype = {
    setMaster: function(master){
        this.master = master;
    },
    addArg: function(arg){
        this.args.push(arg);
    },
    exe: function(dispatcher){
        if(this.func){
            this.addArg(dispatcher);
            this.func.apply(this.master, this.args);
            util.log(util.getEle("logger"), this.toString());
        }
    },
    parse: function(str){
        var map = {};
        if(this.master)map = this.master.getCmdMap();
        str = util.trim(str);
        var mIter = map.keys();
        var key = mIter.next().value;
        while(key){
            if(key.test(str))break;
            key = mIter.next().value;
        }
        if(key){
            var out = key.exec(str);
            if(!this.name)this.name = out[1];
            this.func = map.get(key);
            this.args = out.slice(2);
        }else{
            util.err("无法解析该命令：" + str);
        }
    },
    toString: function(){
        var str = this.master.toString() + "->" + this.name;
        if(this.args.length > 1)str += ":" + this.args.slice(0, 1).join(",");
        return str;
    }
};
util.defineConstructor(Command);

Command.getCmds = function(master, cmdStrs){
    return cmdStrs.split("\n").map(function(cmdStr){
        var cmd = new Command(master);
        cmd.parse(cmdStr);
        return cmd;
    });
};

module.exports = Command;

},{"./util":10}],4:[function(require,module,exports){
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

},{"./Pointer":7,"./util":10}],5:[function(require,module,exports){
var util = require('./util');
var MsgQue = require('./MsgQue');

function Dispatcher() {
    this.going = false;
    this.mq = new MsgQue();
}

Dispatcher.prototype = {
    bind: function (cmd) {
        util.log(null, cmd, 'red');
        this.mq.push(cmd);
    },
    detach: function (cmd) {
        this.mq.del(cmd);
    },
    start: function () {
        if (this.mq.size() > 0) this.mq.pop().exe(this);
    },
    stop: function () {
        this.going = false;
    }
};
util.defineConstructor(Dispatcher);

module.exports = Dispatcher;

},{"./MsgQue":6,"./util":10}],6:[function(require,module,exports){
var util = require('./util');

function MsgQue() {
    this.msgs = [];
}

MsgQue.prototype = {
    del: function(cmd) {
        for (var i = 0; i < this.msgs.length; i++) {
            if(cmd === this.msgs[i]){
                this.msgs.splice(i, 1);
                break;
            }
        }
    },
    push: function(cmd) {
        this.msgs.push(cmd);
    },
    pop: function() {
        return this.msgs.shift();
    },
    size: function() {
        return this.msgs.length;
    }
};

util.defineConstructor(MsgQue);

module.exports = MsgQue;

},{"./util":10}],7:[function(require,module,exports){
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

},{"./util":10}],8:[function(require,module,exports){
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
    go: function (step, dispatcher) {
        if (!step) step = 1;
        if (step > 0) {
            this.updatePointerView(this.pointer.clone(), Math.abs(step) / this.runningSpeed, 1, dispatcher);
        } else if (step < 0) {
            this.back(-step);
        }
    },
    back: function (step, dispatcher) {
        if (!step) step = 1;
        if (step > 0) {
            this.updatePointerView(this.pointer.clone(), Math.abs(step) / this.runningSpeed, -1, dispatcher);
        } else if (step < 0) {
            this.go(-step);
        }
    },
    //逆时针旋转
    turn: function (angle, dispatcher) {
        if (!angle) angle = 90;
        if (angle > 0) {
            this.updateDirectionView(this.direction.clone(), Math.abs(angle) / this.rotatingSpeed, 1, dispatcher);
        } else if (angle < 0) {
            this.updateDirectionView(this.direction.clone(), Math.abs(angle) / this.rotatingSpeed, -1, dispatcher);
        }
    },
    turnRight: function (dispatcher) {
        this.turn(-90, dispatcher);
    },
    turnLeft: function (dispatcher) {
        this.turn(90, dispatcher);
    },
    turnBack: function (dispatcher) {
        this.turn(180, dispatcher);
    },
    setView: function (id, imgSrc) {
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
    updatePointerView: function (fromPointer, time, isPositive, dispatcher) {
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
                window.requestAnimationFrame(move);
                dispatcher.start();
            }
        }
        window.requestAnimationFrame(move);
    },
    updateDirectionView: function (fromDirection, time, isPositive, dispatcher) {
        var start = null,
            that = this;

        function rotate(timestamp) {
            if (!start) start = timestamp;
            var progress = (timestamp - start).toFixed();
            that.direction = fromDirection.addAngle(Math.round(isPositive * progress * that.rotatingSpeed));
            that.view.style.transform = 'rotate(' + that.direction.forCSSRotation() + 'deg)';
            if (progress < time) {
                window.requestAnimationFrame(rotate);
                dispatcher.start();
            }
        }
        window.requestAnimationFrame(rotate);
    },
    setBoundary: function (startPoint, endPoint) {
        this.boundary = new Boundary(startPoint, endPoint);
    },
    getCmdMap: function () {
        return Robot.CmdMap;
    },
    toString: function () {
        return 'Robot';
    }
};
util.defineConstructor(Robot);

// 不要写嵌套结构的正则表达式
// 获取原型里面的方法时要在原型定义之后获取
var cm = new Map();

cm.set(/^(go)\s+(-?\d+)$/i, Robot.prototype.go);
cm.set(/^(back)\s+(-?\d+)$/i, Robot.prototype.back);
cm.set(/^(turn)\s+(-?\d+)$/i, Robot.prototype.turn);

cm.set(/^(go)$/i, Robot.prototype.go);
cm.set(/^(back)$/i, Robot.prototype.back);
cm.set(/^(turn)$/i, Robot.prototype.turn);
cm.set(/^(turnLeft)$/i, Robot.prototype.turnLeft);
cm.set(/^(turnRight)$/i, Robot.prototype.turnRight);
cm.set(/^(turnBack)$/i, Robot.prototype.turnBack);

cm.set(/^(turn)\s+(l|left)$/i, Robot.prototype.turnLeft);
cm.set(/^(turn)\s+(r|right)$/i, Robot.prototype.turnRight);
cm.set(/^(turn)\s+(b|back)$/i, Robot.prototype.turnBack);

Robot.CmdMap = cm;

module.exports = Robot;

},{"./Boundary":2,"./Direction":4,"./Pointer":7,"./util":10}],9:[function(require,module,exports){
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

},{"./Board":1,"./Command":3,"./Direction":4,"./Dispatcher":5,"./Pointer":7,"./Robot":8,"./util":10}],10:[function(require,module,exports){
var util = {
    defineConstructor: function(ClassObject) {
        Object.defineProperty(ClassObject.prototype, 'constructor', {
            value: ClassObject,
            enumerable: false
        });
    },
    createStyle: function(arg){
        var style = {};
        if(typeof arg === 'string'){
            style.forCSS = function(){
                return arg;
            };
            style.forJS = function(){
                return this.css2jsStyle(arg);
            }.bind(this);
        }else if(typeof arg === 'object'){
            style.forCSS = function(){
                return this.js2cssStyle(arg);
            }.bind(this);
            style.forJS = function(){
                return arg;
            };
        }
        return style;
    },
    css2jsStyle: function(styleStr){
        var style = {};
        var props = styleStr.split(";");
        for(var i = 0; i < props.length; i++){
            var prop = props[i];
            var kv = prop.split(":");
            var key = kv[0].replace(/-([a-z])/, function(match, p1, offset, string){
                return p1.toUpperCase();
            });
            style[key] = kv[1];
        }
        return style;
    },
    js2cssStyle: function(styleObj){
        var style = [];
        for(var key in styleObj){
            style.push(key.replace(/([a-z])([A-Z])/, function(match, p1, p2, offset, string){
                return p1 + '-' + p2.toLowerCase();
            }) + ":" + styleObj[key]);
        }
        return style.join(";");
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
        if (!color) color = 'white';
        var timeStr = new Date().toLocaleString(),
            timeStyle = "font-size:0.8em;color:green",
            logStyle = {
                'color': color,
                'marginBottom': '0.5em'
            };
        if (container) {
            container.appendChild(this.createEle("p", {
                'style': this.createStyle(timeStyle).forJS()
            }, timeStr));
            container.appendChild(this.createEle("p", {
                'style': this.createStyle(logStyle).forJS()
            }, str));
        } else {
            console.log("%c" + timeStr, this.createStyle(timeStyle).forCSS());
            console.log("%c" + str, this.createStyle(logStyle).forCSS());
        }
    },
    err: function(str, container){
        this.log(container, str, 'red');
    },
    'defaultValues': {
        'unit': 50,
        'measure': 'px'
    }
};

module.exports = util;

},{}]},{},[9]);
