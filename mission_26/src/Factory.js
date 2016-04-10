function Factory(Product) {
    this.Product = Product;
    this.products = [];
}
Factory.prototype = {
    getAllProducts: function() {
        return this.products;
    },
    getProduct: function(id) {
        var i = 0;
        for (; i < this.products.length; i++) {
            if (id === this.products[i].id) break;
        }
        return this.products[i];
    },
    createProduct: function(id) {
        var product = this.getProduct(id);
        if (product) return product;
        product = new this.Product(id);
        this.products.push(product);
        return product;
    }
};
util.defineConstructor(Factory);
module.exports = Factory;
