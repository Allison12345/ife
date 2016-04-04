var util = require('./util');

function Command(name, func, args, master){
    this.name = name;
    this.func = func;
    if(!args) this.args = [];
    else this.args = args;
    if(master)this.master = master;
}

Command.getCmds = function(master, cmdStrs){
    return cmdStrs.split("\r\n").map(function(cmdStr){
        var cmd = new Command();
        cmd.setMaster(master);
        cmd.parse(cmdStr);
        return cmd;
    });
};

Command.prototype = {
    setMaster: function(master){
        this.master = master;
    },
    addArg: function(arg){
        this.args.push(arg);
    },
    exe: function(){
        this.func.apply(this.master, this.args);
    },
    parse: function(str){
        var map = {};
        if(this.master)map = this.master.getCmdMap();
        str = util.trim(str);
        // for(var v of map){
        //     if(v[0].test(str))break;
        // }
        var mIter = map.keys();
        var key = mapIter.next().value;
        while(key){
            if(key.test(str))break;
            key = mapIter.next().value;
        }

    },
    toString: function(){
        return this.name;
    }
};
util.defineConstructor(Command);

module.exports = Command;
