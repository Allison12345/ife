var Command = require('./Command');

var util = {
    defineConstructor: function(ClassObject) {
        Object.defineProperty(ClassObject.prototype, 'constructor', {
            value: ClassObject,
            enumerable: false
        });
    },
    createEle: function(name, id, className, value, text) {
        var ele = document.createElement(name);
        if (id) ele.id = id;
        if (className) ele.className = className;
        if(value)ele.value = value;
        if(text)ele.appendChild(document.createTextNode(text));
        return ele;
    },
    getEle: function(id){
        return document.getElementById(id);
    },
    cycle: function(angle){
        if (angle >= 0) return angle % 360;
        else return 360 - (-angle) % 360;
    },
    getUnit: function(x, unit){
        if(!unit) unit = 50;
        return (x * unit) + 'px';
    },
    limit: function (value, valueMin, valueMax){
        if(value < valueMin) return valueMin;
        else if(value > valueMax) return valueMax;
        return value;
    },
    getCmds: function(master, cmdStrs){
        return cmdStrs.split("\r\n").map(function(cmdStr){
            var cmd = new Command();
            cmd.setMaster(master);
            cmd.parse(cmdStr);
            return cmd;
        });
    },
    trim: function(str){
        if(String.prototype.trim){
            return str.trim();
        }else{
            return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        }
    }
};

module.exports = util;
