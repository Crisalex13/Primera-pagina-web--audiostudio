// - Esquema de productos
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    minlength: [5, 'La descripción debe tener al menos 5 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: ['audifonos', 'parlantes', 'microfonos', 'accesorios', 'instrumentos', 'estudios']
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x200/1a1a2e/5fc234?text=Producto'
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  stock: {
    type: Number,
    required: [true, 'El stock es obligatorio'],
    min: [0, 'El stock no puede ser negativo']
  },
  badge: {
    type: String,
    default: null,
    enum: [null, 'Oferta', 'Nuevo', 'Premium', 'Agotado']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware para actualizar updatedAt
productSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

module.exports = mongoose.model('Product', productSchema);