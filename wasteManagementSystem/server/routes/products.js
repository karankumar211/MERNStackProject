// server/routes/products.js

const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
} = require('../controllers/productController');

// We will add authentication middleware later to protect admin routes
// const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only route
// For now it's public, we will protect it later
router.post('/', createProduct);


module.exports = router;