// - Rutas API
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getStats
} = require('../controllers/productController');

// ── RUTAS ──
router.get('/', getProducts);
router.get('/stats', getStats);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;