/* ============================================
   main.js
   ============================================
   TABLA DE CONTENIDO
   1. Inicialización Principal
      1.1 Variables Globales
      1.2 Configuración Inicial

   2. Header Ocultable
      2.1 Detección de Scroll
      2.2 Mostrar Header
      2.3 Ocultar Header
      2.4 Umbral de Activación

   3. Proceso de Compra
      3.1 Botón Checkout
      3.2 Validación del Carrito
      3.3 Verificación de Sesión
      3.4 Confirmación de Compra
      3.5 Limpieza del Carrito

   4. Mensajes de Consola
      4.1 Bienvenida
      4.2 Credenciales Demo

   ============================================ */

// 1. Inicialización Principal
// Header ocultable al hacer scroll
let lastScroll = 0;
const header = document.querySelector('.header');
const scrollThreshold = 50;

// 2. Header Ocultable
if (header) {
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= scrollThreshold) {
      header.classList.remove('hide');
      return;
    }
    
    if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
      header.classList.add('hide');
    } else if (currentScroll < lastScroll) {
      header.classList.remove('hide');
    }
    
    lastScroll = currentScroll;
  });
}

// 3. Proceso de Compra
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('🛒 Tu carrito está vacío. Agrega productos primero.');
    } else {
      const user = getCurrentUser();
      if (!user) {
        alert('⚠️ Debes iniciar sesión para finalizar la compra');
        showLoginModal();
      } else {
        alert(`🎉 ¡Gracias por tu compra, ${user.name}!\n\nTotal: $${calculateTotal().toFixed(2)}\n\nRecibirás un correo de confirmación.`);
        cart = [];
        saveCart();
        closeCartSidebar();
      }
    }
  });
}

// 4. Mensajes de Consola
// Mensaje de bienvenida en consola
console.log('🎧 AudioStudio - Tu tienda de sonido profesional');
console.log('💡 Demo: admin@audiostudio.com / admin123');
console.log('💡 Demo cliente: juan@example.com / cliente123');