const express = require('express');
const { 
  getProducts, 
  getProductById, 
  getProductSuggestions,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getProducts);
router.get('/suggestions', getProductSuggestions);
router.get('/:id', getProductById);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;