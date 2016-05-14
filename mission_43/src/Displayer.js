function Displayer(width, height, imgs) {
    this.width = width;
    this.height = height;
    this.imgs = imgs;
    var div = document.createElement("div");
    div.style.width = this.width;
    div.style.height = this.height;
    this.frame = div;
}

Displayer.prototype = {
    show: function () {
        var images = this.imgs;
        for(var i = 0; i < images.length; i++){
            this.frame.appendChild(images[i]);
        }
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