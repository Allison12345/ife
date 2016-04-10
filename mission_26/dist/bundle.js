(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Coordinate(x, y){
    this.x = x;
    this.y = y;
}
Coordinate.prototype = {
    toLT: function(x, y){
        return {
            left: (this.x - x).toFixed() + 'px',
            top: (y - this.y).toFixed() + 'px'
        };
    },
    move: function(x, y){
        return new Coordinate(this.x + x, this.y + y);
    }
};

module.exports = Coordinate;

},{}],2:[function(require,module,exports){
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
        });
        if (this.mode === 1) {
            this.view.style.transform = 'rotate(' + util.cycle((90 - this.angle)) + 'deg)';
        } else if (this.mode === -1) {
            this.view.style.transform = null;
        }
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
        this.originAngle = thia.angle;
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
                if (that.mode === 1) {
                    that.view.style.transform = 'rotate(' + util.cycle((90 - that.angle)) + 'deg)';
                } else if (that.mode === -1) {
                    that.view.style.transform = null;
                }
                window.requestAnimationFrame(turn);
            }
        }
        window.requestAnimationFrame(turn);
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

},{"./util":6}],3:[function(require,module,exports){
var util = require('./util');
var Coordinate = require('./Coordinate');

function Star(radius) {
    this.radius = radius;
}
Star.prototype = {
    getCoordinate: function() {
        return this.center.move(-this.radius, this.radius);
    },
    setCenter: function(x, y){
        this.center = new Coordinate(x, y);
    },
    getView: function(){
        var size = 2 * this.radius;
        var viewDiv = util.createDom("div", {
            className: 'star',
            style:{
                width: size + 'px',
                height: size + 'px'
            }
        });
        return viewDiv;
    }
};
util.defineConstructor(Star);

module.exports = Star;

},{"./Coordinate":1,"./util":6}],4:[function(require,module,exports){
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

},{"./util":6}],5:[function(require,module,exports){
var Universe = require('./Universe');
var Star = require('./Star');
var SpaceShip = require('./SpaceShip');
// var Mediator = require('./Mediator');
var util = require('./util');

var universe = new Universe(800, 600);
var star = new Star(150);
universe.addStar(star);
var ship = new SpaceShip(60, 20).init(1, star.radius + 90, 0, star.center, {
    x: 0,
    y: universe.height
});
universe.addEle(ship);

// var connector = new Mediator();
// var id = 0;
//
// util.get("init").addListener('click', mouseHandler);
util.get("start").addEventListener('click', mouseHandler);
// util.get("stop").addListener('click', mouseHandler);
//
function mouseHandler(e) {
    ship.start(0.1);
}

},{"./SpaceShip":2,"./Star":3,"./Universe":4,"./util":6}],6:[function(require,module,exports){
module.exports = {
    get: function(id){
        return document.getElementById(id);
    },
    defineConstructor: function(ClassObject) {
        Object.defineProperty(ClassObject.prototype, 'constructor', {
            value: ClassObject,
            enumerable: false
        });
    },
    draw: function(ele, lt, container) {
        ele.style.position = 'absolute';
        ele.style.left = lt.left;
        ele.style.top = lt.top;
        if(container)container.appendChild(ele);
    },
    createDom: function(name, attrs, text) {
        var ele = document.createElement(name);
        if (attrs) this.recurAssign(ele, attrs);
        if (text) ele.appendChild(document.createTextNode(text));
        return ele;
    },
    recurAssign: function(obj, attrs) {
        for (var key in attrs) {
            if (typeof attrs[key] === 'object') {
                this.recurAssign(obj[key], attrs[key]);
            } else {
                obj[key] = attrs[key];
            }
        }
    },
    an2pi: function(angle){
        return angle / 180 * Math.PI;
    },
    cycle: function(angle) {
        if (angle >= 0) return angle % 360;
        else return 360 - (-angle) % 360;
    }
};

},{}]},{},[5]);
