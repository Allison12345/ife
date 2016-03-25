var Position = require('Position');
var util = require('util');

function Robot(position){
    if(!(position instanceof Position))this.position = new Position(1, 1);
    else this.position = position;
}

util.defineConstrutor(Robot);

Robot.prototype = {
    go: function(step){

    },
    back: function(step){

    },
    turnRight: function(){

    },
    turnLeft: function(){

    },
    turnBack: function(){

    }
};
