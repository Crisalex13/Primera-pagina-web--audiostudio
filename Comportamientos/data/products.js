/* ============================================================
   products.js - Datos de Productos (con API)
   ============================================================
   TABLA DE CONTENIDO
   ============================================================
   1. Variable Global
      1.1 products (array)

   2. Carga desde API
      2.1 cargarProductosDesdeAPI()
      2.2 recargarProductos()

   3. Inicialización
      3.1 Carga automática al iniciar
   ============================================================ */

// ──────────────────────────────────────────────────────────────
// 1. VARIABLE GLOBAL
// ──────────────────────────────────────────────────────────────

let products = [];
let productosCargados = false;

// ──────────────────────────────────────────────────────────────
// 2. CARGA DESDE API
// ──────────────────────────────────────────────────────────────

/**
 * Carga los productos desde el backend (Node.js + MongoDB)
 */
async function cargarProductosDesdeAPI() {
  try {
    console.log('📦 Cargando productos desde la API...');
    
    // Verificar que api existe
    if (typeof api === 'undefined') {
      console.error('❌ apiService no está cargado');
      return [];
    }
    
    const productosAPI = await api.getProducts();
    products = productosAPI;
    productosCargados = true;
    
    console.log('✅ Productos cargados desde API:', products.length);
    
    // Actualizar la galería
    if (typeof renderizarProductos === 'function') {
      renderizarProductos();
    }
    
    // Actualizar el panel de administración
    if (window.adminController) {
      window.adminController.products = [...products];
      window.adminController.renderProductsTable();
      window.adminController.updateStats();
    }
    
    return products;
  } catch (error) {
    console.error('❌ Error cargando productos desde API:', error.message);
    
    // Fallback: usar productos locales si existen
    if (typeof productosLocales !== 'undefined' && productosLocales.length > 0) {
      console.warn('⚠️ Usando productos locales como fallback');
      products = productosLocales;
      productosCargados = true;
      
      if (typeof renderizarProductos === 'function') {
        renderizarProductos();
      }
      
      return products;
    }
    
    products = [];
    productosCargados = true;
    return products;
  }
}

/**
 * Recarga los productos desde la API
 */
async function recargarProductos() {
  console.log('🔄 Recargando productos...');
  return await cargarProductosDesdeAPI();
}

// ──────────────────────────────────────────────────────────────
// 3. INICIALIZACIÓN AUTOMÁTICA
// ──────────────────────────────────────────────────────────────

// Cargar productos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Esperar un momento para que apiService se cargue
  setTimeout(() => {
    cargarProductosDesdeAPI();
  }, 100);
});

// También exponer la función globalmente
window.cargarProductosDesdeAPI = cargarProductosDesdeAPI;
window.recargarProductos = recargarProductos;

console.log('📦 Sistema de productos inicializado (modo API)');