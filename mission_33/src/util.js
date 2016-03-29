var util = {
    defineConstrutor: function(ClassObject) {
        Object.define(ClassObject.prototype, 'constructor', {
            value: ClassObject,
            enumerable: false
        });
    },
    createElement: function(name, id, className) {
        var ele = document.createElement(name);
        if (id) ele.id = id;
        if (className) ele.class = className;
    }
};

module.exports = util;
