const express = require('express');
const { createProducts, getProducts } = require('../controllers/product.controller');
const { protect, authorizeRoles } = require('../utils/verifyUser');

const router = express.Router();


router.post('/createProd',[protect , authorizeRoles],createProducts);
router.get('/getProducts',getProducts)

module.exports = router;