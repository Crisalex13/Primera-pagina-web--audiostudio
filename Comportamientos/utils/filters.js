/* ============================================================
   filters.js - Filtros de Productos (Versión Funcional)
   ============================================================
   TABLA DE CONTENIDO
   ============================================================
   1. Gestión de Filtros
      1.1 Función filtrarProductos
      1.2 Renderizado con filtros

   2. Inicialización
      2.1 Eventos de Filtros
   ============================================================ */

// ──────────────────────────────────────────────────────────────
// 1. GESTIÓN DE FILTROS
// ──────────────────────────────────────────────────────────────

function filtrarProductos() {
  console.log('🔍 Aplicando filtros...');

  // ── 1.1 Obtener valores de los filtros ──
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');

  if (!searchInput || !categoryFilter) {
    console.warn('⚠️ No se encontraron los filtros en el DOM');
    return;
  }

  const searchTerm = searchInput.value.toLowerCase().trim();
  const category = categoryFilter.value;
  const priceRange = priceFilter ? priceFilter.value : 'all';

  console.log('📝 Búsqueda:', searchTerm || '(vacío)');
  console.log('📂 Categoría:', category);
  console.log('💰 Precio:', priceRange);

  // ── 1.2 Obtener productos ──
  let productosFiltrados = [];

  if (typeof products !== 'undefined' && products.length > 0) {
    productosFiltrados = [...products];
  } else {
    console.warn('⚠️ No hay productos disponibles');
    const gallery = document.getElementById('productGallery');
    if (gallery) {
      gallery.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <p>No hay productos disponibles</p>
        </div>
      `;
    }
    return;
  }

  // ── 1.3 Filtrar por búsqueda ──
  if (searchTerm) {
    productosFiltrados = productosFiltrados.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }

  // ── 1.4 Filtrar por categoría ──
  if (category !== 'all') {
    productosFiltrados = productosFiltrados.filter(product =>
      product.category === category
    );
  }

  // ── 1.5 Filtrar por precio ──
  if (priceRange !== 'all') {
    const [min, max] = priceRange.split('-');
    if (max === '+') {
      productosFiltrados = productosFiltrados.filter(product =>
        product.price >= parseFloat(min)
      );
    } else {
      productosFiltrados = productosFiltrados.filter(product =>
        product.price >= parseFloat(min) && product.price <= parseFloat(max)
      );
    }
  }

  console.log('✅ Productos encontrados:', productosFiltrados.length);

  // ── 1.6 Renderizar resultados ──
  renderizarProductosFiltrados(productosFiltrados);
}

// ──────────────────────────────────────────────────────────────
// 2. RENDERIZADO CON FILTROS
// ──────────────────────────────────────────────────────────────

function renderizarProductosFiltrados(productos) {
  const gallery = document.getElementById('productGallery');
  if (!gallery) {
    console.error('❌ No se encontró #productGallery');
    return;
  }

  // Si no hay productos, mostrar mensaje
  if (productos.length === 0) {
    gallery.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <p>No se encontraron productos</p>
      </div>
    `;
    return;
  }

  // Generar HTML de las tarjetas
  let html = '';
  for (let i = 0; i < productos.length; i++) {
    const p = productos[i];
    html += `
      <div class="card" data-category="${p.category}" data-id="${p.id}" data-price="${p.price}">
        ${p.stock < 5 ? '<div class="badge">🔥 Stock bajo</div>' : ''}
        ${p.badge ? `<div class="badge">${p.badge}</div>` : ''}
        <img 
          src="${p.image || 'https://via.placeholder.com/300x200/1a1a2e/5fc234?text=Producto'}" 
          alt="${p.name}" 
          loading="lazy" 
          onerror="this.src='https://via.placeholder.com/300x200/1a1a2e/5fc234?text=Producto'"
        >
        <div class="card-content">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <div class="price-rating">
            <span class="price">$${p.price.toFixed(2)}</span>
            <span class="rating">
              <i class="fas fa-star"></i> ${p.rating}
            </span>
          </div>
          <button class="btn-add-to-cart" data-id="${p.id}">
            <i class="fas fa-cart-plus"></i> Agregar al carrito
          </button>
        </div>
      </div>
    `;
  }

  gallery.innerHTML = html;

  // ── Agregar eventos a los botones ──
  document.querySelectorAll('.btn-add-to-cart').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      const productId = parseInt(this.dataset.id);
      const product = productos.find(p => p.id === productId);

      if (product) {
        // Mostrar notificación
        if (typeof showAddToCartNotification === 'function') {
          showAddToCartNotification(product.name);
        } else {
          alert(`✅ ${product.name} agregado al carrito`);
        }

        // Agregar al carrito
        if (typeof addToCart === 'function') {
          addToCart(product);
        }
      }
    });
  });
}

// ──────────────────────────────────────────────────────────────
// 3. INICIALIZACIÓN
// ──────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
  console.log('🔧 Inicializando filtros...');

  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');

  // Eventos para filtrar en tiempo real
  if (searchInput) {
    searchInput.addEventListener('input', filtrarProductos);
    console.log('✅ Filtro de búsqueda activado');
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', filtrarProductos);
    console.log('✅ Filtro de categoría activado');
  }

  if (priceFilter) {
    priceFilter.addEventListener('change', filtrarProductos);
    console.log('✅ Filtro de precio activado');
  }

  console.log('✅ Filtros inicializados correctamente');
});