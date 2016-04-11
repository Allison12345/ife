var util = require('./util');

function SpaceShip(w, h) {
    this.width = w;
    this.height = h;
}
SpaceShip.prototype = {
    init: function(id, distance, angle, aroundCorner, referPoint) {
        this.id = id;
        this.distance = distance;
        this.originAngle = angle;
        this.angle = angle;
        this.aroundCorner = aroundCorner;
        this.referPoint = referPoint;
        this.fuel = 100;
        this.direction = 1; // 默认逆时针转动
        this.mode = 1; // 默认为自适应姿势模式；-1：姿势不变的模式
        this.view = util.createDom("div", {
            className: 'ship',
            style: {
                width: this.width + 'px',
                height: this.height + 'px',
                borderRadius: (this.height) / 2 + 'px'
            }
        }, id);
        this.adjust();
        return this;
    },
    start: function(velocity) {
        if (velocity > 0) {
            this.velocity = velocity; //角速度
            this.updateView();
        }
    },
    stop: function() {
        this.velocity = 0;
        this.originAngle = this.angle;
    },
    destroy: function() {

    },
    exeCmd: function(cmd) {

    },
    updateView: function() {
        var that = this,
            start,
            progress;

        function turn(timestamp) {
            if (that.velocity > 0) {
                if (!start) start = timestamp;
                progress = timestamp - start;
                that.angle = util.cycle(that.originAngle + that.direction * that.velocity * progress);
                var lt = that.getCoordinate().toLT(that.referPoint.x, that.referPoint.y);
                that.view.style.left = lt.left;
                that.view.style.top = lt.top;
                that.adjust();
                window.requestAnimationFrame(turn);
            }
        }
        window.requestAnimationFrame(turn);
    },
    adjust: function() {
        if (this.mode === 1) {
            this.view.style.transform = 'rotate(' + util.cycle((90 - this.angle)) + 'deg)';
        } else if (this.mode === -1) {
            this.view.style.transform = null;
        }
    },
    changeMode: function() {
        this.mode *= -1;
    },
    changeDirection: function() {
        this.direction *= -1;
    },
    getCenter: function() {
        var ap = util.an2pi(this.angle);
        return this.aroundCorner.move(this.distance * Math.cos(ap), this.distance * Math.sin(ap));
    },
    getView: function() {
        return this.view;
    },
    getCoordinate: function() {
        return this.getCenter().move(-this.width / 2, this.height / 2);
    }
};
util.defineConstructor(SpaceShip);

SpaceShip.TANK = 100;

module.exports = SpaceShip;
