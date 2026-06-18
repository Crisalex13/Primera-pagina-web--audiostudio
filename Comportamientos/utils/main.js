/* ============================================================
   main.js - Inicialización Principal (Con API)
   ============================================================
   TABLA DE CONTENIDO
   ============================================================
   1. Renderizado de Productos
      1.1 renderizarProductos()
      1.2 renderizarProductosConDatos(datos)

   2. Notificaciones
      2.1 showAddToCartNotification()

   3. Inicialización
      3.1 Carga desde API
      3.2 DOMContentLoaded

   4. Header Ocultable
      4.1 Scroll detection

   5. Proceso de Compra
      5.1 Checkout

   6. Mensajes de Consola
   ============================================================ */

// ──────────────────────────────────────────────────────────────
// 1. RENDERIZADO DE PRODUCTOS
// ──────────────────────────────────────────────────────────────

/**
 * Renderiza los productos en la galería
 * Usa la variable global products
 */
function renderizarProductos() {
  console.log('🚀 Renderizando productos...');
  
  // Verificar que products existe
  if (typeof products === 'undefined' || products.length === 0) {
    console.warn('⚠️ No hay productos para renderizar');
    const gallery = document.getElementById('productGallery');
    if (gallery) {
      gallery.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <p>Cargando productos...</p>
        </div>
      `;
    }
    return;
  }

  renderizarProductosConDatos(products);
}

/**
 * Renderiza productos con datos específicos
 */
function renderizarProductosConDatos(datos) {
  const gallery = document.getElementById('productGallery');
  if (!gallery) {
    console.error('❌ No se encontró #productGallery');
    return;
  }

  if (!datos || datos.length === 0) {
    gallery.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <p>No hay productos disponibles</p>
      </div>
    `;
    return;
  }

  let html = '';
  for (let i = 0; i < datos.length; i++) {
    const p = datos[i];
    html += `
      <div class="card" data-category="${p.category}" data-id="${p.id || p._id}" data-price="${p.price}">
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
              <i class="fas fa-star"></i> ${p.rating || 4.5}
            </span>
          </div>
          <button class="btn-add-to-cart" data-id="${p.id || p._id}">
            <i class="fas fa-cart-plus"></i> Agregar al carrito
          </button>
        </div>
      </div>
    `;
  }

  gallery.innerHTML = html;

  // ── Eventos de botones ──
  document.querySelectorAll('.btn-add-to-cart').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      // ⚠️ Obtener el ID (puede ser _id o id)
      const productId = this.dataset.id;
      const product = datos.find(p => (p._id || p.id) == productId);

      if (product) {
        // Pasar el producto completo a addToCart
        if (typeof addToCart === 'function') {
          addToCart(product);
        } else {
          console.error('❌ addToCart no está definida');
        }
      }
    });
  });
}

// ──────────────────────────────────────────────────────────────
// 2. NOTIFICACIONES
// ──────────────────────────────────────────────────────────────

function showAddToCartNotification(productName) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #5fc234;
    color: #0a0a0f;
    padding: 12px 24px;
    border-radius: 40px;
    font-weight: 600;
    z-index: 10000;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    animation: slideIn 0.3s ease;
  `;
  toast.textContent = `✅ ${productName} agregado al carrito`;
  document.body.appendChild(toast);

  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(function() {
      toast.remove();
    }, 300);
  }, 2000);
}

// ──────────────────────────────────────────────────────────────
// 3. INICIALIZACIÓN
// ──────────────────────────────────────────────────────────────

// Cargar productos desde la API al iniciar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    console.log('📦 Inicializando main.js...');
    // Esperar a que apiService cargue
    setTimeout(() => {
      if (typeof cargarProductosDesdeAPI === 'function') {
        cargarProductosDesdeAPI().then(() => {
          renderizarProductos();
        });
      } else {
        renderizarProductos();
      }
    }, 200);
  });
} else {
  // Si el DOM ya está cargado
  setTimeout(() => {
    if (typeof cargarProductosDesdeAPI === 'function') {
      cargarProductosDesdeAPI().then(() => {
        renderizarProductos();
      });
    } else {
      renderizarProductos();
    }
  }, 200);
}

// ──────────────────────────────────────────────────────────────
// 4. HEADER OCULTABLE AL SCROLL
// ──────────────────────────────────────────────────────────────

let lastScroll = 0;
const header = document.querySelector('.header');
const SCROLL_THRESHOLD = 50;

if (header) {
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= SCROLL_THRESHOLD) {
      header.classList.remove('hide');
      return;
    }

    if (currentScroll > lastScroll && currentScroll > SCROLL_THRESHOLD) {
      header.classList.add('hide');
    } else if (currentScroll < lastScroll) {
      header.classList.remove('hide');
    }

    lastScroll = currentScroll;
  });
}

// ──────────────────────────────────────────────────────────────
// 5. PROCESO DE COMPRA (CHECKOUT)
// ──────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      if (typeof cart !== 'undefined' && cart.length > 0) {
        if (typeof getCurrentUser === 'function') {
          const user = getCurrentUser();
          if (user) {
            alert(`🎉 ¡Gracias por tu compra, ${user.name}!\n\nTotal: $${calculateTotal ? calculateTotal().toFixed(2) : '0.00'}`);
            cart = [];
            if (typeof saveCart === 'function') saveCart();
            if (typeof closeCartSidebar === 'function') closeCartSidebar();
          } else {
            alert('⚠️ Debes iniciar sesión para finalizar la compra');
            if (typeof showLoginModal === 'function') showLoginModal();
          }
        } else {
          alert('🎉 ¡Gracias por tu compra!');
        }
      } else {
        alert('🛒 Tu carrito está vacío.');
      }
    });
  }
});

// ──────────────────────────────────────────────────────────────
// 6. MENSAJES DE CONSOLA
// ──────────────────────────────────────────────────────────────

console.log('%c🎧 AudioStudio - Tu tienda de sonido profesional', 'font-size: 18px; font-weight: bold; color: #5fc234;');
console.log('%c💡 Demo Administrador: admin@audiostudio.com / admin123', 'color: #f59e0b;');
console.log('%c💡 Demo Cliente: juan@example.com / cliente123', 'color: #1198eb;');
console.log('%c✅ Modo API (Node.js + MongoDB) activado', 'color: #4ade80;');

// Exponer funciones globalmente
window.renderizarProductos = renderizarProductos;
window.renderizarProductosConDatos = renderizarProductosConDatos;
window.showAddToCartNotification = showAddToCartNotification;