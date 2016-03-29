var util = require('./util');

function Board(w, h){
    this.width = w;
    this.height = h;
}
Board.prototype = {
    createBoardView: function(id){
        var divView = util.createView("div", id, 'boardView');

        return divView;
    }
};
util.defineConstructor(Board);

module.exprots = Board;
