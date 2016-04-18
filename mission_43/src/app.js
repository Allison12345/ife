var Displayer = require('./Displayer');

for(var i = 1; i < 7; i++){
    document.body.appendChild(new Displayer(240, 180, i).display());
}