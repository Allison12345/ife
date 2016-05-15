var util = require('./util');
var Displayer = require('./Displayer');

var count = 1,
    baseUrl = "http://7xq0r0.com1.z0.glb.clouddn.com/m43_imgsbed/";
    
for (var i = 1; i <= count; i++) {
    document.body.appendChild(new Displayer(240, 180, util.getimgs(i, 16, baseUrl)).show());
}