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
