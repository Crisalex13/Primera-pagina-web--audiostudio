/* ============================================
   filters.js
   ============================================
   TABLA DE CONTENIDO
   ============================================
   1. Gestión de Filtros
      1.1 Productos Actuales
      1.2 Función Principal de Filtrado

   2. Filtro de Búsqueda
      2.1 Obtener Texto de Búsqueda
      2.2 Filtrar por Nombre
      2.3 Filtrar por Descripción

   3. Filtro de Categorías
      3.1 Obtener Categoría
      3.2 Filtrar Productos

   4. Filtro de Precio
      4.1 Obtener Rango
      4.2 Precio Mínimo
      4.3 Precio Máximo

   5. Renderizado de Resultados
      5.1 Actualizar Productos
      5.2 Renderizar Catálogo

   6. Inicialización
      6.1 Eventos de Búsqueda
      6.2 Eventos de Categoría
      6.3 Eventos de Precio
      6.4 Render Inicial

   ============================================ */

//1. Gestión de Filtros
// ========== FILTRO DE BÚSQUEDA Y CATEGORÍA ==========
let currentProducts = [...products];

function filterProducts() {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');
  
  if (!searchInput || !categoryFilter) return;
  
  const searchTerm = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const priceRange = priceFilter ? priceFilter.value : 'all';
  
  let filtered = [...products];
  
  // Filtrar por búsqueda
  if (searchTerm) {
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filtrar por categoría
  if (category !== 'all') {
    filtered = filtered.filter(product => product.category === category);
  }
  
  // Filtrar por precio
  if (priceRange !== 'all') {
    const [min, max] = priceRange.split('-');
    if (max === '+') {
      filtered = filtered.filter(product => product.price >= parseFloat(min));
    } else {
      filtered = filtered.filter(product => product.price >= parseFloat(min) && product.price <= parseFloat(max));
    }
  }
  
  currentProducts = filtered;
  renderProducts(filtered);
}

// Inicializar filtros
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');
  
  if (searchInput) searchInput.addEventListener('input', filterProducts);
  if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);
  if (priceFilter) priceFilter.addEventListener('change', filterProducts);
  
  // Render inicial
  renderProducts(products);
});