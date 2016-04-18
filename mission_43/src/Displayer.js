function Displayer(width, height, count) {
    this.width = width;
    this.height = height;
    this.count = count;
}

Displayer.prototype = {
    show: function (images) {
        switch (images.length) {
            case 1: this.drawOne(images); break;
            case 2: this.drawTwo(images); break;
            case 3: this.drawThree(images); break;
            case 4: this.drawFour(images); break;
            case 5: this.drawFive(images); break;
            case 6: this.drawSix(images); break;
            default: this.drawSix(images.slice(0, 6)); 
        }
    },
    display: function () {
        var div = document.createElement("div");
        return div;
    },
    drawOne: function (imgs) {

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