// const { protect, authorizeRoles } = require('../utils/verifyUser'); // Assuming this path
const Product = require('../models/product.model'); // Assuming this path
const { errorHandler } = require('../utils/error');


const createProducts =async(req,res,next)=>{

    console.log("inside create products")

     const { SKU, name, barcode, category, stock, threshold, expiryDate } = req.body;

    if (!SKU || !name || !category || stock === undefined || stock === null) {
        return next(errorHandler(400, 'Please include SKU, name, category, and initial stock.'));
    }
    if (stock < 0) { return next(errorHandler(400, 'Stock cannot be negative.')); }
    if (threshold !== undefined && threshold !== null && threshold < 0) { return next(errorHandler(400, 'Threshold cannot be negative.')); }
    if (expiryDate && isNaN(new Date(expiryDate).getTime())) { return next(errorHandler(400, 'Invalid expiry date format.')); }

    try {
        let existingProduct = await Product.findOne({ $or: [{ SKU }, { barcode }] });
        if (existingProduct) {
            return next(errorHandler(400, 'Product with this SKU or barcode already exists.'));
        }

        const newProduct = new Product({
            SKU, name, barcode, category, stock, threshold, expiryDate
        });

        const product = await newProduct.save();
        res.status(201).json(product);

    } catch (error) {
        next(error);
    }

}


const getProducts = async ( req, res,next)=>{
     try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};



const getProductById = async(req,res,next)=>{
      try {
        const product = await Product.findById(req.params.id);
        if (!product) { return next(errorHandler(404, 'Product not found.')); }
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
}


const updateProduct = async (req, res , next)=>{
    const { SKU, name, barcode, category, stock, threshold, expiryDate } = req.body;
    const productId = req.params.id;

    if (stock !== undefined && stock !== null && stock < 0) { return next(errorHandler(400, 'Stock cannot be negative.')); }
    if (threshold !== undefined && threshold !== null && threshold < 0) { return next(errorHandler(400, 'Threshold cannot be negative.')); }
    if (expiryDate && isNaN(new Date(expiryDate).getTime())) { return next(errorHandler(400, 'Invalid expiry date format.')); }

    try {
        let product = await Product.findById(productId);
        if (!product) { return next(errorHandler(404, 'Product not found.')); }

        // Check for unique SKU/barcode if they are being changed
        if (SKU && SKU !== product.SKU) {
            const existingSKU = await Product.findOne({ SKU });
            if (existingSKU && existingSKU._id.toString() !== productId) { return next(errorHandler(400, 'Product with this SKU already exists.')); }
        }
        if (barcode && barcode !== product.barcode) {
            const existingBarcode = await Product.findOne({ barcode });
            if (existingBarcode && existingBarcode._id.toString() !== productId) { return next(errorHandler(400, 'Product with this barcode already exists.')); }
        }

        // Apply updates
        product.SKU = SKU !== undefined ? SKU : product.SKU;
        product.name = name !== undefined ? name : product.name;
        product.barcode = barcode !== undefined ? barcode : product.barcode; // Allow null/empty string
        product.category = category !== undefined ? category : product.category;

        // Capture old stock for logging later (not implemented yet, but good to note)
        // const oldStock = product.stock; 
        product.stock = stock !== undefined ? stock : product.stock;

        product.threshold = threshold !== undefined ? threshold : product.threshold;
        product.expiryDate = expiryDate !== undefined ? expiryDate : product.expiryDate; // Allow null/undefined to clear

        await product.save();
        res.status(200).json(product);

    } catch (error) {
        next(error);
    }
}


const deleteProduct = async(req,res,next)=>{
    try {
        const product = await Product.findById(req.params.id);
        if (!product) { return next(errorHandler(404, 'Product not found.')); }

        await Product.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Product removed successfully.' });

    } catch (error) {
        next(error);
    }
}

module.exports={
    createProducts,
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct

}