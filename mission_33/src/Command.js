var util = require('./util');

function Command(master, name, func, args){
    this.master = master;
    if(name)this.name = name;
    if(func)this.func = func;
    if(!args) this.args = [];
    else this.args = args;
}

Command.prototype = {
    setMaster: function(master){
        this.master = master;
    },
    addArg: function(arg){
        this.args.push(arg);
    },
    exe: function(){
        if(this.func){
            this.func.apply(this.master, this.args);
            util.log(util.getEle("logger"), this.toString());
        }
    },
    parse: function(str){
        var map = {};
        if(this.master)map = this.master.getCmdMap();
        str = util.trim(str);
        var mIter = map.keys();
        var key = mIter.next().value;
        while(key){
            if(key.test(str))break;
            key = mIter.next().value;
        }
        if(key){
            var out = key.exec(str);
            if(!this.name)this.name = out[1]
            this.func = map.get(key);
            this.args = out.slice(2);
        }else{
            util.err("无法解析该命令：" + str);
        }
    },
    toString: function(){
        var str = this.master.toString() + "->" + this.name;
        if(this.args.length > 0)str += ":" + this.args.join(",");
        return str;
    }
};
util.defineConstructor(Command);

Command.getCmds = function(master, cmdStrs){
    return cmdStrs.split("\n").map(function(cmdStr){
        var cmd = new Command(master);
        cmd.parse(cmdStr);
        cmd.exe();
        // return cmd;
    });
};

module.exports = Command;
