/* ============================================
   session.js
   ============================================
   TABLA DE CONTENIDO
   ============================================
   1. Sistema de Usuarios
      1.1 Lista de Usuarios
      1.2 Datos de Autenticación
      1.3 Roles de Usuario

   2. Gestión de Sesión
      2.1 Iniciar Sesión
      2.2 Cerrar Sesión
      2.3 Verificar Sesión Activa
      2.4 Obtener Usuario Actual

   3. Notificaciones
      3.1 Mostrar Toast
      3.2 Mensajes de Éxito
      3.3 Mensajes de Error

   4. Interfaz de Usuario
      4.1 Actualizar Estado de Sesión
      4.2 Mostrar Información del Usuario
      4.3 Mostrar/Ocultar Botones
      4.4 Gestión de Roles

   5. Modal de Inicio de Sesión
      5.1 Crear Modal
      5.2 Cerrar Modal
      5.3 Formulario de Acceso
      5.4 Validación de Credenciales

   6. Eventos e Inicialización
      6.1 Carga Inicial
      6.2 Evento Login
      6.3 Evento Logout
      6.4 Evento Perfil

   ============================================ */

// 1. Sistema de Usuarios
const users = [
  { id: 1, name: "Admin User", email: "admin@audiostudio.com", password: "admin123", role: "admin" },
  { id: 2, name: "Juan Pérez", email: "juan@example.com", password: "cliente123", role: "user" }
];

// 2. Gestión de Sesión
// Iniciar sesión
function login(email, password) {
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('sn_session', JSON.stringify(sessionData));
    updateUIForSession();
    showToastNotification(`✅ ¡Bienvenido ${user.name}!`);
    return true;
  }
  showToastNotification('❌ Correo o contraseña incorrectos', true);
  return false;
}

// Cerrar sesión
function logout() {
  localStorage.removeItem('sn_session');
  updateUIForSession();
  showToastNotification('👋 Sesión cerrada correctamente');
}

// Verificar si hay sesión activa
function isLoggedIn() {
  return localStorage.getItem('sn_session') !== null;
}

// Obtener usuario actual
function getCurrentUser() {
  const session = localStorage.getItem('sn_session');
  return session ? JSON.parse(session) : null;
}

// 3. Notificaciones
function showToastNotification(message, isError = false) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${isError ? '#dc3545' : '#4ade80'};
    color: ${isError ? 'white' : '#1a1a2e'};
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

//4. Interfaz de Usuario
// Actualizar UI según sesión
function updateUIForSession() {
  const user = getCurrentUser();
  const statusDisplay = document.getElementById('statusDisplay');
  const userRoleText = document.getElementById('userRoleText');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginBtn = document.getElementById('loginBtn');
  const perfilBtn = document.getElementById('btnPerfil');
  
  if (user) {
    if (userRoleText) userRoleText.textContent = user.role === 'admin' ? 'Administrador' : user.name;
    if (statusDisplay) {
      statusDisplay.setAttribute('data-role', user.role);
      const icon = statusDisplay.querySelector('i');
      if (icon) icon.className = user.role === 'admin' ? 'fas fa-crown' : 'fas fa-user-check';
    }
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';
    if (loginBtn) loginBtn.style.display = 'none';
    if (perfilBtn) perfilBtn.style.display = 'inline-flex';
  } else {
    if (userRoleText) userRoleText.textContent = 'Invitado';
    if (statusDisplay) {
      statusDisplay.setAttribute('data-role', 'guest');
      const icon = statusDisplay.querySelector('i');
      if (icon) icon.className = 'fas fa-user-circle';
    }
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (perfilBtn) perfilBtn.style.display = 'none';
  }
}

// 5. MODAL DE INICIO DE SESIÓN
function showLoginModal() {
  const modal = document.createElement('div');
  modal.className = 'login-modal';
  modal.innerHTML = `
    <div class="login-modal-content">
      <div class="login-modal-header">
        <h3><i class="fas fa-sign-in-alt"></i> Iniciar sesión</h3>
        <button class="login-modal-close">&times;</button>
      </div>
      <form id="loginForm">
        <div class="form-group">
          <label><i class="fas fa-envelope"></i> Correo electrónico</label>
          <input type="email" id="loginEmail" placeholder="ejemplo@correo.com" required>
        </div>
        <div class="form-group">
          <label><i class="fas fa-lock"></i> Contraseña</label>
          <input type="password" id="loginPassword" placeholder="••••••••" required>
        </div>
        <button type="submit" class="btn-login-submit">Ingresar</button>
        <p class="login-demo-hint">
          <small>Demo: admin@audiostudio.com / admin123<br>o juan@example.com / cliente123</small>
        </p>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  const closeModal = () => modal.remove();
  modal.querySelector('.login-modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  modal.querySelector('#loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = modal.querySelector('#loginEmail').value;
    const password = modal.querySelector('#loginPassword').value;
    
    if (login(email, password)) {
      closeModal();
      setTimeout(() => location.reload(), 500);
    } else {
      modal.querySelector('#loginPassword').value = '';
    }
  });
}

//6. Eventos e Inicialización
document.addEventListener('DOMContentLoaded', () => {
  updateUIForSession();
  
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const perfilBtn = document.getElementById('btnPerfil');
  
  if (loginBtn) {
    loginBtn.addEventListener('click', showLoginModal);
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('¿Seguro que quieres cerrar sesión?')) {
        logout();
        location.reload();
      }
    });
  }
  
  if (perfilBtn) {
    perfilBtn.addEventListener('click', () => {
      const user = getCurrentUser();
      if (user) {
        alert(`📋 MI PERFIL\n\n👤 Nombre: ${user.name}\n📧 Email: ${user.email}\n👑 Rol: ${user.role === 'admin' ? 'Administrador' : 'Cliente'}\n\n🛒 Historial de compras próximamente...`);
      } else {
        showLoginModal();
      }
    });
  }
});