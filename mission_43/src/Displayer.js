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
    drawTwo: function (imgUrls) {
        var loadingDivs = [];
        for (var i = 0; i < imgUrls.length; i++) {
            loadingDivs[i] = util.createEle("div", "loading");
            this.frame.appendChild(loadingDivs[i]);
            util.fetch(imgUrls[i], (data) => {
                this.frame.removeChild(loadingDivs[i]);
                var arrayBufferView = new Uint8Array(data);
                var blob = new Blob([arrayBufferView], { type: "image/png" });
                var img = util.createEle("img", "two");
                img.src = URL.createObjectURL(blob);
                this.frame.appendChild(img);
            }, () => {
                this.frame.removeChild(loadingDivs[i]);
                this.frame.appendChild(util.createEle("div", "error"));
            });
        }
    },
    drawThree: function (imgUrls) {

    },
    drawFour: function (imgUrls) {

    },
    drawFive: function (imgUrls) {

    },
    drawSix: function (imgUrls) {

    }
};

Object.defineProperty(Displayer.prototype, 'constructor', {
    value: Displayer,
    enumerable: false
});

module.exports = Displayer;