/* ============================================
   products.js
   ============================================
   TABLA DE CONTENIDO
   ============================================
   1. Catálogo de Productos
      1.1 Array de Productos
      1.2 Propiedades de Producto

   2. Renderizado de Productos
      2.1 Obtener Contenedor
      2.2 Validación de Resultados
      2.3 Generación de Tarjetas
      2.4 Inserción en el DOM
      2.5 Eventos de Botones

   3. Carrito de Compras
      3.1 Agregar al Carrito
      3.2 Búsqueda de Producto
      3.3 Validación de Funciones

   ============================================ */

// 1. Catálogo de Productos
const products = [
  {
    id: 1,
    name: "Audífonos Pro X",
    description: "Sonido envolvente 3D, cancelación de ruido",
    price: 129.99,
    category: "audifonos",
    image: "Imagenes/audifonos.jpg",
    rating: 4.5,
    stock: 15
  },
  {
    id: 2,
    name: "Parlante Boom 360",
    description: "Potencia 80W, Bluetooth 5.2",
    price: 89.99,
    category: "parlantes",
    image: "Imagenes/bocina.jpg",
    rating: 4.8,
    stock: 8,
    badge: "Oferta"
  },
  {
    id: 3,
    name: "Micrófono StudioCast",
    description: "Patrón cardioide, ideal para podcast",
    price: 79.99,
    category: "microfonos",
    image: "Imagenes/micrófono.jpg",
    rating: 4.6,
    stock: 12
  },
  {
    id: 4,
    name: "Earbuds AirFloat",
    description: "Inalámbricos, 30h de batería",
    price: 149.99,
    category: "audifonos",
    image: "Imagenes/audifonos 2.jpg",
    rating: 4.7,
    stock: 20
  }
];

// 2. Renderizado de Productos
function renderProducts(productsToRender = products) {
  const gallery = document.getElementById('productGallery');
  if (!gallery) return;
  
  if (productsToRender.length === 0) {
    gallery.innerHTML = '<div class="no-results"><i class="fas fa-search"></i><p>No se encontraron productos</p></div>';
    return;
  }
  
  gallery.innerHTML = productsToRender.map(product => `
    <div class="card" data-category="${product.category}" data-id="${product.id}" data-price="${product.price}">
      ${product.badge ? `<div class="badge">${product.badge}</div>` : ''}
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="card-content">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="price-rating">
          <span class="price">$${product.price.toFixed(2)}</span>
          <span class="rating"><i class="fas fa-star"></i> ${product.rating}</span>
        </div>
        <button class="btn-add-to-cart" data-id="${product.id}">
          <i class="fas fa-shopping-cart"></i> Agregar al carrito
        </button>
      </div>
    </div>
  `).join('');
  
  // Agregar event listeners a los botones de agregar al carrito
  document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
    btn.removeEventListener('click', handleAddToCart);
    btn.addEventListener('click', handleAddToCart);
  });
}

// 3. Carrito de Compras
function handleAddToCart(e) {
  e.stopPropagation();
  const productId = parseInt(e.currentTarget.dataset.id);
  const product = products.find(p => p.id === productId);
  
  if (product && typeof addToCart === 'function') {
    addToCart(product);
  }
}