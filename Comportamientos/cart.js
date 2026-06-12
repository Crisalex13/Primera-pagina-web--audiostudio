/* ============================================
   cart.js
   ============================================
   TABLA DE CONTENIDO
   ============================================
   1. Gestión del Carrito
      1.1 Variable del Carrito
      1.2 Cargar Carrito
      1.3 Guardar Carrito

   2. Operaciones del Carrito
      2.1 Agregar Producto
      2.2 Eliminar Producto
      2.3 Actualizar Cantidad
      2.4 Calcular Total

   3. Interfaz del Carrito
      3.1 Actualizar UI
      3.2 Renderizar Productos
      3.3 Actualizar Contador
      3.4 Mostrar Carrito Vacío
      3.5 Eventos de Cantidad
      3.6 Eventos de Eliminación

   4. Notificaciones
      4.1 Toast de Confirmación

   5. Sidebar del Carrito
      5.1 Abrir Sidebar
      5.2 Cerrar Sidebar

   6. Inicialización
      6.1 Cargar Datos Guardados
      6.2 Eventos del Menú Carrito
      6.3 Eventos de Cierre

   ============================================ */

// 1. Gestión del Carrito
let cart = [];

// Cargar carrito del localStorage
function loadCart() {
  const savedCart = localStorage.getItem('sn_cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  updateCartUI();
}

// Guardar carrito
function saveCart() {
  localStorage.setItem('sn_cart', JSON.stringify(cart));
  updateCartUI();
}

//2. Operaciones del Carrito
// Agregar producto al carrito
function addToCart(product, quantity = 1) {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }
  
  saveCart();
  showToastNotification(`✅ ${product.name} agregado al carrito`);
}

// Eliminar producto del carrito
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
}

// Actualizar cantidad
function updateQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(productId);
  } else {
    const item = cart.find(item => item.id === productId);
    if (item) item.quantity = newQuantity;
    saveCart();
  }
}

// Calcular total
function calculateTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

//3. Interfaz del Carrito
// Actualizar UI del carrito
function updateCartUI() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalSpan = document.getElementById('cartTotal');
  const cartCountSpan = document.getElementById('cartCount');
  
  if (!cartItemsContainer) return;
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountSpan) cartCountSpan.textContent = totalItems;
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="cart-empty"><i class="fas fa-shopping-cart"></i> Tu carrito está vacío</p>';
    if (cartTotalSpan) cartTotalSpan.textContent = '$0';
    return;
  }
  
  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image || 'Imagenes/placeholder.jpg'}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>$${item.price.toFixed(2)} c/u</p>
      </div>
      <div class="cart-item-actions">
        <button class="cart-qty-btn" data-action="decr" data-id="${item.id}">-</button>
        <span class="cart-qty">${item.quantity}</span>
        <button class="cart-qty-btn" data-action="incr" data-id="${item.id}">+</button>
        <button class="cart-remove-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
      </div>
      <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
    </div>
  `).join('');
  
  if (cartTotalSpan) cartTotalSpan.textContent = `$${calculateTotal().toFixed(2)}`;
  
  // Agregar event listeners a los botones del carrito
  document.querySelectorAll('.cart-qty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      const productId = parseInt(btn.dataset.id);
      const item = cart.find(i => i.id === productId);
      
      if (action === 'incr') {
        updateQuantity(productId, item.quantity + 1);
      } else if (action === 'decr') {
        updateQuantity(productId, item.quantity - 1);
      }
    });
  });
  
  document.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const productId = parseInt(btn.dataset.id);
      removeFromCart(productId);
    });
  });
}

// 4. Notificaciones toast
function showToastNotification(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `
    <div style="background: var(--accent); color: white; padding: 12px 24px; border-radius: 40px; margin-bottom: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
      ${message}
    </div>
  `;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.zIndex = '10000';
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

//5. Sidebar del Carrito
// Abrir/cerrar sidebar del carrito
function openCartSidebar() {
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  if (cartSidebar) cartSidebar.classList.add('open');
  if (cartOverlay) cartOverlay.classList.add('active');
}

function closeCartSidebar() {
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  if (cartSidebar) cartSidebar.classList.remove('open');
  if (cartOverlay) cartOverlay.classList.remove('active');
}

// 6. Inicialización del carrito
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  
  const navCarritoLink = document.getElementById('navCarritoLink');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartOverlay = document.getElementById('cartOverlay');
  
  if (navCarritoLink) {
    navCarritoLink.addEventListener('click', (e) => {
      e.preventDefault();
      openCartSidebar();
    });
  }
  
  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', closeCartSidebar);
  }
  
  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCartSidebar);
  }
});