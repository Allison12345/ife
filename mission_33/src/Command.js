var util = require('./util');

function Command(name, func, args, master){
    this.name = name;
    this.func = func;
    if(!args) this.args = [];
    else this.args = args;
    if(master)this.master = master;
}

Command.prototype = {
    setMaster: function(master){
        this.master = master;
    },
    addArg: function(arg){
        this.args.push(arg);
    },
    exe: function(){
        func.apply(this.master, this.args);
    },
    parse: function(str){
        var map = {};
        if(this.master)map = this.master.getCmdMap();
        str = util.trim(str);
        var cmd = str.split(/\s+/);
    },
    toString: function(){
        return this.name;
    }
};

util.defineConstructor(Command);

module.exports = Command;
