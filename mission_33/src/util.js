var util = {
    defineConstructor: function(ClassObject) {
        Object.defineProperty(ClassObject.prototype, 'constructor', {
            value: ClassObject,
            enumerable: false
        });
    },
    createEle: function(name, attrs, text) {
        var ele = document.createElement(name);
        if (attrs)
            for (var key in attrs) ele[key] = attrs[key];
        if (text) ele.appendChild(document.createTextNode(text));
        return ele;
    },
    append: function(container, child, type, x, y, isPX) {
        var refer = type.split('-');
        if (refer.length > 0) {
            child.style.position = 'absolute';
            if (isPX) {
                child.style[refer[0]] = x;
                child.style[refer[1]] = y;
            } else {
                child.style[refer[0]] = this.getUnit(x);
                child.style[refer[1]] = this.getUnit(y);
            }
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
    getUnit: function(x, unit) {
        if (!unit) unit = this.defaultValues.unit;
        return (x * unit) + 'px';
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
        var timeP = this.createEle("p", null, "logTime", null, new Date().toLocaleString());
        var logP = this.createEle("p", null, null, null, str);
        if (color) logP.style.color = color;
        logP.style.marginBottom = '0.5em';
        container.appendChild(timeP);
        container.appendChild(logP);
    },
    'defaultValues': {
        'unit': 50,
        'step': 1,
        'angle': 90
    }
};

module.exports = util;
