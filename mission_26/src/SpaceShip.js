function SpaceShip(id){
    this.id = id;
    this.fuel = 0;
    this.speed = 0;
    this.direction = 1;// 默认逆时针转动    
}
SpaceShip.prototype = {
    init: function(height){
        this.height = height;
        this.lifeBegin = new Date();
    },
    start: function(speed){
        this.speed = speed;
        this.fuel -= 1;
    },
    stop: function(){
        this.speed = 0;
    },    
    destroy: function(){
        
    },
    exeCmd: function(cmd){
        
    }
};
Object.defineProperty(SpaceShip.prototype, 'constructor', {
    value: 'SpaceShip',
    enumerable: false
});

SpaceShip.maxFuel = 100;

module.exports = SpaceShip;