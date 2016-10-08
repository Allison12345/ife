var util = require('./util');

function Factory(Product, universe, star) {
    this.Product = Product;
    this.star = star;
    this.universe = universe;
    this.products = [];
}
Factory.prototype = {
    getAllProducts: function () {
        return this.products;
    },
    getProduct: function (id) {        
        return this.products[this.getProductIndex(id)];
    },
    getProductIndex: function(id){
        var i = 0;
        for (; i < this.products.length; i++) {
            if (id === this.products[i].id) break;
        }
        return i;
    },
    createProduct: function (id) {
        var product = new this.Product(60, 20).init(id, this.star.radius + 90, 0, this.star.center, {
            x: 0,
            y: this.universe.height
        });
        this.products.push(product);
        this.universe.addEle(product);
        return product;
    },
    deleteProduct: function(id){
        var index = this.getProductIndex(id);
        this.products[index].destroy(this.universe);
        this.products.splice(index, 1);
    },
    operate: function(cmdStr, id){
        if(cmdStr === 'init'){
            this.createProduct(id);
        }else if(cmdStr === 'destroy'){
            this.deleteProduct(id);
        }else {
            this.getProduct(id).exeCmd(cmdStr);
        }
    }
};
util.defineConstructor(Factory);

module.exports = Factory;
