/* ============================================================
   cart.js - Gestión del Carrito de Compras
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

// ── 1. Gestión del Carrito ──
let cart = [];

function loadCart() {
  const savedCart = localStorage.getItem('sn_cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('sn_cart', JSON.stringify(cart));
  updateCartUI();
}

// ── 2. Operaciones del Carrito ──
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

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(productId);
  } else {
    const item = cart.find(item => item.id === productId);
    if (item) item.quantity = newQuantity;
    saveCart();
  }
}

function calculateTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// ── 3. Interfaz del Carrito ──
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

function showToastNotification(message) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--accent);
    color: var(--bg);
    padding: 12px 24px;
    border-radius: 40px;
    font-weight: 600;
    z-index: 10000;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ── 4. Sidebar del Carrito ──
function openCartSidebar() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('active');
}

function closeCartSidebar() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('active');
}

// ── 5. Inicialización ──
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  
  document.getElementById('navCarritoLink').addEventListener('click', (e) => {
    e.preventDefault();
    openCartSidebar();
  });
  
  document.getElementById('cartCloseBtn').addEventListener('click', closeCartSidebar);
  document.getElementById('cartOverlay').addEventListener('click', closeCartSidebar);
});