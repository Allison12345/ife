var util = require('./util');

function Universe(w, h) {
    this.width = w;
    this.height = h;
    this.view = this._createView();
}
Universe.prototype = {
    addEle: function(ele) {
        util.draw(ele.getView(), ele.getCoordinate().toLT(0, this.height), this.view);
    },
    addStar: function(star) {
        star.setCenter(this.width / 2, this.height / 2);
        this.addEle(star);
    },
    _createView: function() {
        var view = util.get('universe');
        view.style.width = this.width + 'px';
        view.style.height = this.height + 'px';
        return view;
    }
};
util.defineConstructor(Universe);

module.exports = Universe;
