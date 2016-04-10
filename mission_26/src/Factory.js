var util = require('./util');

function Factory(Product, universe, star) {
    this.Product = Product;
    this.star = star;
    this.universe = universe;
    console.log(star);
    console.log(universe);
    this.products = [];
}
Factory.prototype = {
    getAllProducts: function () {
        return this.products;
    },
    getProduct: function (id) {
        var i = 0;
        for (; i < this.products.length; i++) {
            if (id === this.products[i].id) break;
        }
        if (i < this.products.length) return this.products[i];
        return this.createProduct(id);
    },
    createProduct: function () {
        var product = new this.Product(60, 20).init(this.id, this.star.radius + 90, 0, this.star.center, {
            x: 0,
            y: this.universe.height
        });
        this.products.push(product);
        this.universe.addEle(product);
        return product;
    }
};
util.defineConstructor(Factory);

module.exports = Factory;
