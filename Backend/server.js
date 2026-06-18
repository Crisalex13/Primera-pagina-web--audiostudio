// - Servidor principal
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const productRoutes = require('./routes/products');

// ── 1. CONECTAR A MONGODB ──
connectDB();

// ── 2. CREAR APP ──
const app = express();
const PORT = process.env.PORT || 5000;

// ── 3. MIDDLEWARE ──
app.use(cors({
  origin: ['http://127.0.0.1:5501', 'http://localhost:5501', 'http://127.0.0.1:5500'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── 4. LOG DE PETICIONES ──
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// ── 5. RUTAS ──
app.use('/api/products', productRoutes);

// ── 6. RUTA DE BIENVENIDA ──
app.get('/', (req, res) => {
  res.json({
    message: '🎵 AudioStudio API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      stats: '/api/products/stats',
      product: '/api/products/:id'
    }
  });
});

// ── 7. MANEJO DE ERRORES 404 ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`
  });
});

// ── 8. INICIAR SERVIDOR ──
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api/products`);
});