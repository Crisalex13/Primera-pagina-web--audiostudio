/* ============================================================
   productController.js - Controlador de productos (CRUD)
   ============================================================
   TABLA DE CONTENIDO
   ============================================================
   1. OBTENER TODOS LOS PRODUCTOS (GET)
   2. OBTENER UN PRODUCTO POR ID (GET)
   3. CREAR UN PRODUCTO (POST)
   4. ACTUALIZAR UN PRODUCTO (PUT)
   5. ELIMINAR UN PRODUCTO (DELETE)
   6. OBTENER ESTADÍSTICAS (GET)
   ============================================================ */

const Product = require('../models/Product');

// ──────────────────────────────────────────────────────────────
// 1. OBTENER TODOS LOS PRODUCTOS
// ──────────────────────────────────────────────────────────────

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message
    });
  }
};

// ──────────────────────────────────────────────────────────────
// 2. OBTENER UN PRODUCTO POR ID
// ──────────────────────────────────────────────────────────────

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('❌ Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el producto',
      error: error.message
    });
  }
};

// ──────────────────────────────────────────────────────────────
// 3. CREAR UN PRODUCTO
// ──────────────────────────────────────────────────────────────

exports.createProduct = async (req, res) => {
  try {
    console.log('📝 Creando producto:', req.body);
    
    const product = await Product.create(req.body);
    
    console.log('✅ Producto creado:', product._id);
    res.status(201).json({
      success: true,
      message: 'Producto creado correctamente',
      data: product
    });
  } catch (error) {
    console.error('❌ Error al crear producto:', error);
    
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error al crear el producto',
      error: error.message
    });
  }
};

// ──────────────────────────────────────────────────────────────
// 4. ACTUALIZAR UN PRODUCTO
// ──────────────────────────────────────────────────────────────

exports.updateProduct = async (req, res) => {
  try {
    console.log('📝 Actualizando producto ID:', req.params.id);
    console.log('📝 Datos:', req.body);
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true,           // Devuelve el documento actualizado
        runValidators: true  // Ejecuta las validaciones del esquema
      }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    console.log('✅ Producto actualizado:', product._id);
    res.status(200).json({
      success: true,
      message: 'Producto actualizado correctamente',
      data: product
    });
  } catch (error) {
    console.error('❌ Error al actualizar producto:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error al actualizar el producto',
      error: error.message
    });
  }
};

// ──────────────────────────────────────────────────────────────
// 5. ELIMINAR UN PRODUCTO
// ──────────────────────────────────────────────────────────────

exports.deleteProduct = async (req, res) => {
  try {
    console.log('🗑️ Eliminando producto ID:', req.params.id);
    
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    console.log('✅ Producto eliminado:', product._id);
    res.status(200).json({
      success: true,
      message: 'Producto eliminado correctamente',
      data: product
    });
  } catch (error) {
    console.error('❌ Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el producto',
      error: error.message
    });
  }
};

// ──────────────────────────────────────────────────────────────
// 6. OBTENER ESTADÍSTICAS
// ──────────────────────────────────────────────────────────────

exports.getStats = async (req, res) => {
  try {
    console.log('📊 Obteniendo estadísticas...');
    
    const totalProducts = await Product.countDocuments();
    const lowStock = await Product.countDocuments({ stock: { $lt: 5 } });
    
    // Calcular ventas simuladas (puedes personalizarlo)
    const totalSales = Math.floor(totalProducts * 2.5);
    
    // Agrupar por categoría
    const byCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    console.log('✅ Estadísticas obtenidas');
    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        lowStock,
        totalSales,
        byCategory
      }
    });
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};