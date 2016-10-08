var util = {
    defineConstructor: function(ClassObject) {
        Object.defineProperty(ClassObject.prototype, 'constructor', {
            value: ClassObject,
            enumerable: false
        });
    },
    createStyle: function(arg){
        var style = {};
        if(typeof arg === 'string'){
            style.forCSS = function(){
                return arg;
            };
            style.forJS = function(){
                return this.css2jsStyle(arg);
            }.bind(this);
        }else if(typeof arg === 'object'){
            style.forCSS = function(){
                return this.js2cssStyle(arg);
            }.bind(this);
            style.forJS = function(){
                return arg;
            };
        }
        return style;
    },
    css2jsStyle: function(styleStr){
        var style = {};
        var props = styleStr.split(";");
        for(var i = 0; i < props.length; i++){
            var prop = props[i];
            var kv = prop.split(":");
            var key = kv[0].replace(/-([a-z])/, function(match, p1, offset, string){
                return p1.toUpperCase();
            });
            style[key] = kv[1];
        }
        return style;
    },
    js2cssStyle: function(styleObj){
        var style = [];
        for(var key in styleObj){
            style.push(key.replace(/([a-z])([A-Z])/, function(match, p1, p2, offset, string){
                return p1 + '-' + p2.toLowerCase();
            }) + ":" + styleObj[key]);
        }
        return style.join(";");
    },
    createEle: function(name, attrs, text) {
        var ele = document.createElement(name);
        this.recurAssign(ele, attrs);
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
    append: function(container, child, type, x, y, measure) {
        var refer = type.split('-');
        if (refer.length > 0) {
            child.style.position = 'absolute';
            child.style[refer[0]] = this.getUnit(x, null, measure);
            child.style[refer[1]] = this.getUnit(y, null, measure);
        }
        container.appendChild(child);
    },
    getEle: function(id) {
        return document.getElementById(id);
    },
    cycle: function(angle) {
        if (angle >= 0) return angle % 360;
        else return 360 - (-angle) % 360;
    },
    getUnit: function(x, unit, measure) {
        if (isNaN(x)) return x;
        if (measure) return x + measure;
        if (!unit) unit = this.defaultValues.unit;
        measure = this.defaultValues.measure;
        return (x * unit) + measure;
    },
    limit: function(value, valueMin, valueMax) {
        if (value < valueMin) return valueMin;
        else if (value > valueMax) return valueMax;
        return value;
    },
    trim: function(str) {
        if (String.prototype.trim) {
            return str.trim();
        } else {
            return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        }
    },
    log: function(container, str, color) {
        if (!color) color = 'white';
        var timeStr = new Date().toLocaleString(),
            timeStyle = "font-size:0.8em;color:green",
            logStyle = {
                'color': color,
                'marginBottom': '0.5em'
            };
        if (container) {
            container.appendChild(this.createEle("p", {
                'style': this.createStyle(timeStyle).forJS()
            }, timeStr));
            container.appendChild(this.createEle("p", {
                'style': this.createStyle(logStyle).forJS()
            }, str));
        } else {
            console.log("%c" + timeStr, this.createStyle(timeStyle).forCSS());
            console.log("%c" + str, this.createStyle(logStyle).forCSS());
        }
    },
    err: function(str, container){
        this.log(container, str, 'red');
    },
    'defaultValues': {
        'unit': 50,
        'measure': 'px'
    }
};

module.exports = util;
