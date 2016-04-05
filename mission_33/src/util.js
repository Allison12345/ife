var util = {
    defineConstructor: function(ClassObject) {
        Object.defineProperty(ClassObject.prototype, 'constructor', {
            value: ClassObject,
            enumerable: false
        });
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
        var timeP = this.createEle("p", {
            "className": "logTime"
        }, new Date().toLocaleString());
        if (!color) color = 'white';
        var logP = this.createEle("p", {
            'style': {
                'color': color,
                'marginBottom': '0.5em'
            }
        }, str);
        container.appendChild(timeP);
        container.appendChild(logP);
    },
    'defaultValues': {
        'unit': 50,
        'measure': 'px',
        'step': 1,
        'angle': 90
    }
};

module.exports = util;
