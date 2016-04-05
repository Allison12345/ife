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
