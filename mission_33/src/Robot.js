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
    else this.direction = direction;
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
    updatePointerView: function(fromPoint, time) {
        var start = null, that = this;
        function move(timestamp) {
            if(!start) start = timestamp;
            var progress = timestamp - start;
            if(fromPoint){
                that.pointer = fromPoint.add(that.direction.getVector().multiply(progress * that.runningSpeed));
                that.pointer.normalize(that.boundary);
            }
            that.view.style.left = util.getUnit(that.pointer.x);
            that.view.style.bottom = util.getUnit(that.pointer.y);
            if(progress <= time){
                window.requestAnimationFrame(arguments.callee);
            }
        }
        window.requestAnimationFrame(move);
    },
    updateDirectionView: function(fromDirection, time) {
        var start = null, that = this;
        function rotate(timestamp) {
            if(!start) start = timestamp;
            var progress = timestamp - start;
            if(fromDirection){
                that.direction = fromDirection.addAngle(parseInt(progress * that.rotatingSpeed));
            }
            that.view.style.transform = 'rotate(' + that.direction.forCSSRotation() + 'deg)';
            if(progress <= time){
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
