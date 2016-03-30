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
