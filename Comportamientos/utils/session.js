/* ============================================================
   session.js - Sistema de Autenticación
   ============================================================
   TABLA DE CONTENIDO
   ============================================================
   1. Sistema de Usuarios
      1.1 Lista de Usuarios

   2. Gestión de Sesión
      2.1 login
      2.2 logout
      2.3 isLoggedIn
      2.4 getCurrentUser

   3. Interfaz de Usuario
      3.1 updateUIForSession

   4. Modal de Inicio de Sesión
      4.1 showLoginModal

   5. Eventos e Inicialización
      5.1 Carga Inicial
      5.2 Evento Login
      5.3 Evento Logout
      5.4 Evento Perfil
   ============================================================ */

// ── 1. Sistema de Usuarios ──
const users = [
  { id: 1, name: "Admin User", email: "admin@audiostudio.com", password: "admin123", role: "admin" },
  { id: 2, name: "Juan Pérez", email: "juan@example.com", password: "cliente123", role: "user" }
];

// ── 2. Gestión de Sesión ──
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

function logout() {
  localStorage.removeItem('sn_session');
  updateUIForSession();
  showToastNotification('👋 Sesión cerrada correctamente');
}

function isLoggedIn() {
  return localStorage.getItem('sn_session') !== null;
}

function getCurrentUser() {
  const session = localStorage.getItem('sn_session');
  return session ? JSON.parse(session) : null;
}

// ── 3. Interfaz de Usuario ──
function updateUIForSession() {
  const user = getCurrentUser();
  const statusDisplay = document.getElementById('statusDisplay');
  const userRoleText = document.getElementById('userRoleText');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginBtn = document.getElementById('loginBtn');
  const perfilBtn = document.getElementById('btnPerfil');
  const adminBtn = document.getElementById('adminBtn');
  
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
    
    // Mostrar botón admin SOLO si es administrador
    if (adminBtn && user.role === 'admin') {
      adminBtn.style.display = 'inline-flex';
    } else if (adminBtn) {
      adminBtn.style.display = 'none';
    }
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
    if (adminBtn) adminBtn.style.display = 'none';
  }
}

// ── 4. Modal de Inicio de Sesión ──
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
      // Recargar para actualizar el estado del admin
      setTimeout(() => location.reload(), 500);
    } else {
      modal.querySelector('#loginPassword').value = '';
    }
  });
}

// ── 5. Eventos e Inicialización ──
document.addEventListener('DOMContentLoaded', () => {
  updateUIForSession();
  
  document.getElementById('loginBtn').addEventListener('click', showLoginModal);
  
  document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('¿Seguro que quieres cerrar sesión?')) {
      logout();
      location.reload();
    }
  });
  
  document.getElementById('btnPerfil').addEventListener('click', () => {
    const user = getCurrentUser();
    if (user) {
      alert(`📋 MI PERFIL\n\n👤 Nombre: ${user.name}\n📧 Email: ${user.email}\n👑 Rol: ${user.role === 'admin' ? 'Administrador' : 'Cliente'}\n\n🛒 Historial de compras próximamente...`);
    } else {
      showLoginModal();
    }
  });
});