(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var util = require('./util');

function Displayer(width, height, imgUrls) {
    this.width = width;
    this.height = height;
    this.imgUrls = imgUrls;
}

Displayer.prototype = {
    show: function () {
        this.frame = util.createEle("div", "container");
        this.frame.style.width = this.width + 'px';
        this.frame.style.height = this.height + 'px';
        var imgUrls = this.imgUrls;
        switch (imgUrls.length) {
            case 1: this.drawOne(imgUrls); break;
            case 2: this.drawTwo(imgUrls); break;
            case 3: this.drawThree(imgUrls); break;
            case 4: this.drawFour(imgUrls); break;
            case 5: this.drawFive(imgUrls); break;
            case 6: this.drawSix(imgUrls); break;
            default: this.drawSix(imgUrls.slice(0, 6));
        }
        return this.frame;
    },
    drawOne: function (imgUrls) {
        var loadingDiv = util.createEle("div", "loading");
        this.frame.appendChild(loadingDiv);
        util.fetch(imgUrls[0], (data) => {
            this.frame.removeChild(loadingDiv);
            var arrayBufferView = new Uint8Array(data);
            var blob = new Blob([arrayBufferView], { type: "image/png" });
            var img = util.createEle("img", "one");
            img.src = URL.createObjectURL(blob);
            this.frame.appendChild(img);
        }, () => {
            this.frame.removeChild(loadingDiv);
            this.frame.appendChild(util.createEle("div", "error"));
        });
    },
    drawTwo: function (imgs) {

    },
    drawThree: function (imgs) {

    },
    drawFour: function (imgs) {

    },
    drawFive: function (imgs) {

    },
    drawSix: function (imgs) {

    }
};

Object.defineProperty(Displayer.prototype, 'constructor', {
    value: Displayer,
    enumerable: false
});

module.exports = Displayer;
},{"./util":3}],2:[function(require,module,exports){
var util = require('./util');
var Displayer = require('./Displayer');

var count = 1;

for(var i = 1; i <= count; i++){
    document.body.appendChild(new Displayer(240, 180, util.getimgs(i, 16, './imgsbed/')).show());
}
},{"./Displayer":1,"./util":3}],3:[function(require,module,exports){
module.exports = {
    fetch: function (url, resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if(xhr.status === 200){
                    resolve(xhr.response);
                } else {
                    reject();
                }
            } 
        }
        xhr.responseType = 'arraybuffer';
        xhr.send();
    },
    createEle: function (name, className) {
        var ele = document.createElement(name);
        ele.className = className;
        return ele;
    },
    getimgs: function (count, max, baseUrl) {
        var arr = [];
        for (var i = 0; i < count; i++) {
            arr.push(baseUrl + Math.floor(Math.random() * max + 1) + '.png');
        }
        return arr;
    }
}
},{}]},{},[2]);
