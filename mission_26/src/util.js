module.exports = {
    get: function(id){
        return document.getElementById(id);
    },
    defineConstructor: function(ClassObject) {
        Object.defineProperty(ClassObject.prototype, 'constructor', {
            value: ClassObject,
            enumerable: false
        });
    },
    draw: function(ele, lt, container) {
        ele.style.position = 'absolute';
        ele.style.left = lt.left;
        ele.style.top = lt.top;
        if(container)container.appendChild(ele);
    },
    createDom: function(name, attrs, text) {
        var ele = document.createElement(name);
        if (attrs) this.recurAssign(ele, attrs);
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
    an2pi: function(angle){
        return angle / 180 * Math.PI;
    },
    cycle: function(angle) {
        if (angle >= 0) return angle % 360;
        else return 360 - (-angle) % 360;
    }
};
