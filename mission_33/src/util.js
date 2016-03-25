module.exports = {
    defineConstrutor: function(ClassObject){
        Object.define(ClassObject, 'constructor', {
            value: ClassObject,
            enumerable: false
        });
    }
};
