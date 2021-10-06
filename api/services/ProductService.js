
module.exports = {
    fetchProducts: async () => {
        const products = await Product.find({ removed: false, stock: { '>': 0 } }).populate('productphotos');
        return products.map(product => sanitizeProduct(product));
    },

    fetchProduct: async id => {
        const product = await Product.findOne(id).populate('merchant').populate('productphotos').populate('keyfeatures');
        return sanitizeProduct(product);
    },

    fetchCategories: async req => {
        if (req.session.categories) return req.session.categories;

        req.session.categories = await Category.find({ removed: false, select: ['id', 'category_name'] })
            .populate('subcategories', { removed: false, select: ['id', 'sub_category_name'] });
        req.session.save();
        return req.session.categories;
    }
}

function sanitizeProduct(product) {
    return {
        id: product.id,
        product_name: product.product_name,
        description: product.description,
        quantity: product.stock,
        colour: product.color,
        price: UtillityService.formateCurrency(product.selling_price),
        unformatted_price: product.selling_price,
        productphotos: product.productphotos,
        photo: product.productphotos[0] && product.productphotos[0].photo_name || 'product.png',
        keyfeatures: product.keyfeatures || []
    }
}