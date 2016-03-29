var Position = require('./Pointer');
var Direction = require('./Direction');
var util = require('./util');

function Robot(direction, position) {
    // 默认坐标：(1, 1), 左下角为原点
    if (!(position instanceof Pointer)) this.position = new Pointer(1, 1);
    else this.position = position;
    // 默认朝向：NORTH
    if (!(direction instanceof Direction)) this.direction = Direction.EAST;
    this.direction = direction;
}

Robot.prototype = {
    go: function(step) {
        this.position = this.position.add(this.direction.getVector().multiply(step));
    },
    back: function(step) {
        this.go(-step);
    },
    //逆时针旋转
    turn: function(angle){
        this.direction.add(angle);
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
    createRobotView: function(){
        
    }
};
util.defineConstrutor(Robot);

module.exports = Robot;
