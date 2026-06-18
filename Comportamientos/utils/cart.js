/* ============================================================
   cart.js - Gestión del Carrito de Compras (VERSIÓN CORREGIDA)
   ============================================================
   TABLA DE CONTENIDO
   ============================================================
   1. Gestión del Carrito
      1.1 Variable del Carrito
      1.2 loadCart
      1.3 saveCart

   2. Operaciones del Carrito
      2.1 addToCart
      2.2 removeFromCart
      2.3 updateQuantity
      2.4 calculateTotal

   3. Interfaz del Carrito
      3.1 updateCartUI
      3.2 showToastNotification

   4. Sidebar del Carrito
      4.1 openCartSidebar
      4.2 closeCartSidebar

   5. Inicialización
      5.1 Eventos del DOM
   ============================================================ */

// ──────────────────────────────────────────────────────────────
// 1. GESTIÓN DEL CARRITO
// ──────────────────────────────────────────────────────────────

let cart = [];

function loadCart() {
  const savedCart = localStorage.getItem('sn_cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
      // Asegurar que todos los items tengan los campos necesarios
      cart = cart.filter(item => item.id && item.name);
    } catch (e) {
      cart = [];
    }
  }
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('sn_cart', JSON.stringify(cart));
  updateCartUI();
}

// ──────────────────────────────────────────────────────────────
// 2. OPERACIONES DEL CARRITO
// ──────────────────────────────────────────────────────────────

/**
 * Agrega un producto al carrito
 * Si ya existe, suma la cantidad
 */
function addToCart(product, quantity = 1) {
  // ⚠️ Obtener el ID correcto (MongoDB usa _id)
  const productId = product._id || product.id;
  
  if (!productId) {
    console.error('❌ Producto sin ID:', product);
    return;
  }
  
  // Buscar si el producto ya está en el carrito
  const existingIndex = cart.findIndex(item => item.id === productId);
  
  if (existingIndex !== -1) {
    // ✅ Si ya existe, sumar cantidad
    cart[existingIndex].quantity += quantity;
    console.log(`✅ Sumando ${quantity} a "${product.name}" (ahora ${cart[existingIndex].quantity})`);
  } else {
    // ✅ Si no existe, agregar nuevo
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image || 'Imagenes/placeholder.jpg',
      quantity: quantity
    });
    console.log(`✅ Agregando "${product.name}" al carrito (${quantity})`);
  }
  
  saveCart();
  showToastNotification(`✅ ${product.name} agregado al carrito`);
}

/**
 * Elimina un producto del carrito
 */
function removeFromCart(productId) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    console.log(`🗑️ Eliminando "${item.name}" del carrito`);
  }
  cart = cart.filter(item => item.id !== productId);
  saveCart();
}

/**
 * Actualiza la cantidad de un producto
 */
function updateQuantity(productId, newQuantity) {
  const item = cart.find(i => i.id === productId);
  
  if (!item) {
    console.warn('⚠️ Producto no encontrado en el carrito');
    return;
  }
  
  if (newQuantity <= 0) {
    // Si la cantidad es 0 o negativa, eliminar
    removeFromCart(productId);
  } else {
    item.quantity = newQuantity;
    console.log(`🔄 Actualizando "${item.name}" a ${newQuantity}`);
    saveCart();
  }
}

/**
 * Calcula el total del carrito
 */
function calculateTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// ──────────────────────────────────────────────────────────────
// 3. INTERFAZ DEL CARRITO
// ──────────────────────────────────────────────────────────────

function updateCartUI() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalSpan = document.getElementById('cartTotal');
  const cartCountSpan = document.getElementById('cartCount');
  
  if (!cartItemsContainer) return;
  
  // Calcular total de items
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountSpan) cartCountSpan.textContent = totalItems;
  
  // Si el carrito está vacío
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-cart" style="font-size: 3rem; display: block; margin-bottom: 1rem; opacity: 0.3;"></i>
        <p>Tu carrito está vacío</p>
      </div>
    `;
    if (cartTotalSpan) cartTotalSpan.textContent = '$0';
    return;
  }
  
  // Generar HTML de los items
  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image || 'Imagenes/placeholder.jpg'}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://via.placeholder.com/60x60/1a1a2e/5fc234?text=Producto'">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>$${item.price.toFixed(2)} c/u</p>
      </div>
      <div class="cart-item-actions">
        <button class="cart-qty-btn" data-action="decr" data-id="${item.id}">−</button>
        <span class="cart-qty">${item.quantity}</span>
        <button class="cart-qty-btn" data-action="incr" data-id="${item.id}">+</button>
        <button class="cart-remove-btn" data-id="${item.id}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
    </div>
  `).join('');
  
  // Actualizar total
  if (cartTotalSpan) cartTotalSpan.textContent = `$${calculateTotal().toFixed(2)}`;
  
  // ── Agregar eventos a los botones ──
  // Botones + y -
  document.querySelectorAll('.cart-qty-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const action = this.dataset.action;
      const productId = this.dataset.id;
      const item = cart.find(i => i.id === productId);
      
      if (!item) {
        console.warn('⚠️ Producto no encontrado:', productId);
        return;
      }
      
      if (action === 'incr') {
        updateQuantity(productId, item.quantity + 1);
      } else if (action === 'decr') {
        updateQuantity(productId, item.quantity - 1);
      }
    });
  });
  
  // Botones de eliminar
  document.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const productId = this.dataset.id;
      removeFromCart(productId);
    });
  });
}

// ── 3.2 Notificación ──
function showToastNotification(message) {
  // Eliminar notificaciones anteriores
  document.querySelectorAll('.toast-notification').forEach(el => el.remove());
  
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
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
    max-width: 90%;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ──────────────────────────────────────────────────────────────
// 4. SIDEBAR DEL CARRITO
// ──────────────────────────────────────────────────────────────

function openCartSidebar() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (sidebar) sidebar.classList.add('open');
  if (overlay) overlay.classList.add('active');
  // Actualizar UI al abrir
  updateCartUI();
}

function closeCartSidebar() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
}

// ──────────────────────────────────────────────────────────────
// 5. INICIALIZACIÓN
// ──────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
  console.log('🛒 Inicializando carrito...');
  loadCart();
  
  // Abrir carrito desde el header
  const navCarritoLink = document.getElementById('navCarritoLink');
  if (navCarritoLink) {
    navCarritoLink.addEventListener('click', function(e) {
      e.preventDefault();
      openCartSidebar();
    });
  }
  
  // Cerrar carrito
  const closeBtn = document.getElementById('cartCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeCartSidebar);
  }
  
  // Cerrar con overlay
  const overlay = document.getElementById('cartOverlay');
  if (overlay) {
    overlay.addEventListener('click', closeCartSidebar);
  }
  
  // Cerrar con tecla ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeCartSidebar();
    }
  });
  
  console.log('✅ Carrito inicializado con', cart.length, 'productos');
});

// ──────────────────────────────────────────────────────────────
// 6. EXPORTAR FUNCIONES PARA USO GLOBAL
// ──────────────────────────────────────────────────────────────

window.cart = cart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.calculateTotal = calculateTotal;
window.openCartSidebar = openCartSidebar;
window.closeCartSidebar = closeCartSidebar;
window.loadCart = loadCart;
window.saveCart = saveCart;