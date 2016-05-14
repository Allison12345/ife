var util = require('./util');
var Displayer = require('./Displayer');

var count = 1;

for(var i = 1; i <= count; i++){
    document.body.appendChild(new Displayer(240, 180, util.getimgs(i, 16, './imgsbed/')).show());
}