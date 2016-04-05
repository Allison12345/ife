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
