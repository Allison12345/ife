var util = require('./util');

function Command(master, name, func, args){
    this.master = master;
    if(name)this.name = name;
    if(func)this.func = func;
    if(!args) this.args = [];
    else this.args = args;
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
        if(this.func)this.func.apply(this.master, this.args);
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
            this.func = map.get(key);
            this.args = key.exec(str).slice(1);
        }else{
            util.err("无法解析该命令：" + str);
        }
    },
    toString: function(){
        if(this.args.length > 0)return this.name + ":" + this.args.join(",");
        else return this.name;
    }
};
util.defineConstructor(Command);

module.exports = Command;
