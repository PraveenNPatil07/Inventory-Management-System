const express = require('express');
const { createProducts, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { protect, authorizeRoles } = require('../utils/verifyUser');

const router = express.Router();

router.post('/createProd', protect, authorizeRoles('admin'), createProducts);

router.get('/getProducts', protect, authorizeRoles('admin', 'staff'), getProducts);

router.get('/getProduct/:id', protect, authorizeRoles('admin', 'staff'), getProductById);

router.put('/updateProd/:id', protect, authorizeRoles('admin'), updateProduct);

router.delete('/deleteProd/:id', protect, authorizeRoles('admin'), deleteProduct);

module.exports = router;