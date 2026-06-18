/* ============================================================
   AdminController.js - Panel de administración (CRUD con API)
   ============================================================
   TABLA DE CONTENIDO
   ============================================================
   1. AdminController
      1.1 Constructor
      1.2 Inicialización

   2. Configuración del Panel
      2.1 setupEventListeners
      2.2 setupImageUpload

   3. Carga de Productos
      3.1 loadProducts
      3.2 refreshUI

   4. Apertura y Cierre
      4.1 openPanel
      4.2 closePanel

   5. Tabla de Productos
      5.1 renderProductsTable
      5.2 updateStats

   6. Operaciones CRUD (CON API)
      6.1 handleSubmit
      6.2 addProduct
      6.3 editProduct
      6.4 updateProduct
      6.5 deleteProduct
      6.6 resetForm

   7. Manejo de Imágenes
      7.1 handleFile
      7.2 removeImage

   8. Utilitarios
      8.1 getCategoryName
      8.2 showNotification
      8.3 escapeHtml

   9. Inicialización
   ============================================================ */

// ──────────────────────────────────────────────────────────────
// 1. ADMINCONTROLLER
// ──────────────────────────────────────────────────────────────

class AdminController {
  constructor() {
    // ── 1.1 Referencias al DOM ──
    this.panel = document.getElementById('adminPanel');
    this.adminBtn = document.getElementById('adminBtn');
    this.closeBtn = document.getElementById('closeAdminPanel');
    this.overlay = document.getElementById('adminPanelOverlay');
    this.form = document.getElementById('adminProductForm');
    this.cancelBtn = document.getElementById('cancelEdit');
    this.tbody = document.getElementById('adminProductsList');
    this.tableWrapper = document.querySelector('.table-wrapper');

    // ── 1.2 Estado ──
    this.currentProductId = null;
    this.products = [];
    this.isLoading = false;

    // ── 1.3 Inicializar ──
    this.init();
  }

  // ──────────────────────────────────────────────────────────────
  // 2. CONFIGURACIÓN
  // ──────────────────────────────────────────────────────────────

  init() {
    console.log('🔧 Inicializando AdminController...');
    this.setupEventListeners();
    this.setupImageUpload();
    this.loadProducts();
    console.log('✅ AdminController listo');
  }

  setupEventListeners() {
    if (this.adminBtn) {
      this.adminBtn.addEventListener('click', () => this.openPanel());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closePanel());
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closePanel());
    }

    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    if (this.cancelBtn) {
      this.cancelBtn.addEventListener('click', () => this.resetForm());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.panel && this.panel.style.display !== 'none') {
        this.closePanel();
      }
    });
  }

  // ── 2.2 Configurar subida de imágenes ──
  setupImageUpload() {
    const fileInput = document.getElementById('prodImageFile');
    const preview = document.getElementById('imagePreview');
    const hiddenInput = document.getElementById('prodImage');
    const uploadBtn = document.getElementById('uploadBtn');
    const removeBtn = document.getElementById('removeImageBtn');
    const form = document.getElementById('adminProductForm');

    if (!fileInput || !preview) return;

    preview.addEventListener('click', () => {
      fileInput.click();
    });

    if (uploadBtn) {
      uploadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.handleFile(file, preview, hiddenInput, removeBtn);
      }
    });

    preview.addEventListener('dragover', (e) => {
      e.preventDefault();
      preview.classList.add('dragover');
    });

    preview.addEventListener('dragleave', () => {
      preview.classList.remove('dragover');
    });

    preview.addEventListener('drop', (e) => {
      e.preventDefault();
      preview.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file) {
        this.handleFile(file, preview, hiddenInput, removeBtn);
      }
    });

    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        this.removeImage(preview, hiddenInput, removeBtn, fileInput);
      });
    }

    if (form) {
      form.addEventListener('reset', () => {
        this.removeImage(preview, hiddenInput, removeBtn, fileInput);
      });
    }
  }

  // ──────────────────────────────────────────────────────────────
  // 3. CARGA DE PRODUCTOS
  // ──────────────────────────────────────────────────────────────

  async loadProducts() {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      console.log('📦 Cargando productos desde API...');
      
      if (typeof api !== 'undefined' && api.getProducts) {
        const productos = await api.getProducts();
        this.products = productos;
        if (typeof products !== 'undefined') {
          products = productos;
        }
        console.log('✅ Productos cargados:', this.products.length);
      } else if (typeof products !== 'undefined') {
        this.products = [...products];
      } else {
        this.products = [];
      }
    } catch (error) {
      console.error('❌ Error cargando productos:', error);
      this.products = [];
    }

    this.isLoading = false;
    this.renderProductsTable();
    this.updateStats();
  }

  // ── 3.2 ACTUALIZAR SIN PARPADEOS ──
  async refreshUI() {
    const scrollTop = this.tableWrapper ? this.tableWrapper.scrollTop : 0;
    await this.loadProducts();
    if (this.tableWrapper) {
      this.tableWrapper.scrollTop = scrollTop;
    }
    if (typeof renderizarProductos === 'function') {
      renderizarProductos();
    }
  }

  // ──────────────────────────────────────────────────────────────
  // 4. APERTURA Y CIERRE
  // ──────────────────────────────────────────────────────────────

  openPanel() {
    if (this.panel) {
      this.panel.style.display = 'block';
      document.body.style.overflow = 'hidden';
      this.loadProducts();
      console.log('📂 Panel de administración abierto');
    }
  }

  closePanel() {
    if (this.panel) {
      this.panel.style.display = 'none';
      document.body.style.overflow = '';
    }
    this.resetForm();
    console.log('📂 Panel de administración cerrado');
  }

  // ──────────────────────────────────────────────────────────────
  // 5. TABLA DE PRODUCTOS
  // ──────────────────────────────────────────────────────────────

  renderProductsTable() {
    if (!this.tbody) return;

    if (this.products.length === 0) {
      this.tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text2); padding: 2rem;">
            <i class="fas fa-box-open" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>
            No hay productos registrados
          </td>
        </tr>
      `;
      return;
    }

    let html = '';
    for (let i = 0; i < this.products.length; i++) {
      const p = this.products[i];
      const id = p._id || p.id;
      html += `
        <tr>
          <td>${i + 1}</td>
          <td>
            <img 
              src="${p.image || 'Imagenes/placeholder.jpg'}" 
              alt="${p.name}"
              onerror="this.src='https://via.placeholder.com/50x50/1a1a2e/5fc234?text=Producto'"
            >
          </td>
          <td><strong>${this.escapeHtml(p.name)}</strong></td>
          <td><span class="category-badge">${this.getCategoryName(p.category)}</span></td>
          <td><span style="color: var(--accent); font-weight: 600;">$${p.price.toFixed(2)}</span></td>
          <td>${p.stock}</td>
          <td>
            <button class="btn-edit" data-id="${id}">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn-delete" data-id="${id}">
              <i class="fas fa-trash"></i> Eliminar
            </button>
          </td>
        </tr>
      `;
    }

    this.tbody.innerHTML = html;

    // ── Eventos ──
    this.tbody.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        this.editProduct(btn.dataset.id);
      });
    });

    this.tbody.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        this.deleteProduct(btn.dataset.id);
      });
    });
  }

  // ── 5.2 Estadísticas ──
  updateStats() {
    const totalProducts = this.products.length;
    const lowStock = this.products.filter(p => p.stock < 5).length;

    const totalEl = document.getElementById('statTotalProducts');
    const lowEl = document.getElementById('statLowStock');
    const salesEl = document.getElementById('statTotalSales');

    if (totalEl) totalEl.textContent = totalProducts;
    if (lowEl) lowEl.textContent = lowStock;
    if (salesEl) salesEl.textContent = Math.floor(totalProducts * 2.5);
  }

  // ──────────────────────────────────────────────────────────────
  // 6. OPERACIONES CRUD (CON API)
  // ──────────────────────────────────────────────────────────────

  handleSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('productId').value;
    const productData = {
      name: document.getElementById('prodName').value.trim(),
      category: document.getElementById('prodCategory').value,
      description: document.getElementById('prodDescription').value.trim(),
      price: parseFloat(document.getElementById('prodPrice').value),
      stock: parseInt(document.getElementById('prodStock').value),
      image: document.getElementById('prodImage').value.trim() || 'Imagenes/placeholder.jpg',
      rating: parseFloat(document.getElementById('prodRating').value) || 4.5,
      badge: document.getElementById('prodBadge').value.trim() || null
    };

    // ── Validaciones ──
    if (!productData.name) {
      this.showNotification('❌ El nombre es obligatorio', 'error');
      return;
    }
    if (!productData.description) {
      this.showNotification('❌ La descripción es obligatoria', 'error');
      return;
    }
    if (productData.price <= 0) {
      this.showNotification('❌ El precio debe ser mayor a 0', 'error');
      return;
    }
    if (productData.stock < 0) {
      this.showNotification('❌ El stock no puede ser negativo', 'error');
      return;
    }

    if (id) {
      this.updateProduct(id, productData);
    } else {
      this.addProduct(productData);
    }
  }

  // ── 6.2 Agregar Producto ──
  async addProduct(productData) {
    try {
      this.showNotification('⏳ Guardando producto...', 'info');
      
      // Verificar que api existe
      if (typeof api === 'undefined' || !api.createProduct) {
        throw new Error('apiService no está disponible');
      }
      
      const newProduct = await api.createProduct(productData);
      
      // Actualizar arrays
      this.products = [...this.products, newProduct];
      if (typeof products !== 'undefined') {
        products = this.products;
      }

      const id = newProduct._id || newProduct.id || 'Nuevo';
      this.showNotification(`✅ Producto agregado (ID: ${id})`, 'success');
      this.resetForm();
      await this.refreshUI();
      
      console.log('✅ Producto agregado:', newProduct.name);
    } catch (error) {
      console.error('❌ Error agregando producto:', error);
      this.showNotification(`❌ Error: ${error.message}`, 'error');
    }
  }

  // ── 6.3 Editar Producto ──
  editProduct(id) {
    const product = this.products.find(p => (p._id || p.id) === id);
    if (!product) {
      this.showNotification('❌ Producto no encontrado', 'error');
      return;
    }

    this.currentProductId = id;
    document.getElementById('productId').value = id;
    document.getElementById('prodName').value = product.name;
    document.getElementById('prodCategory').value = product.category;
    document.getElementById('prodDescription').value = product.description;
    document.getElementById('prodPrice').value = product.price;
    document.getElementById('prodStock').value = product.stock;
    document.getElementById('prodRating').value = product.rating || 4.5;
    document.getElementById('prodBadge').value = product.badge || '';
    document.getElementById('formTitle').innerHTML = '✏️ Editar Producto';

    const preview = document.getElementById('imagePreview');
    const hiddenInput = document.getElementById('prodImage');
    const removeBtn = document.getElementById('removeImageBtn');

    if (product.image && preview) {
      preview.innerHTML = `<img src="${product.image}" alt="${product.name}">`;
      preview.classList.add('has-image');
      hiddenInput.value = product.image;
      if (removeBtn) removeBtn.style.display = 'inline-flex';
    }

    const submitBtn = this.form.querySelector('.btn-save');
    if (submitBtn) submitBtn.textContent = '💾 Actualizar producto';

    document.querySelector('.admin-form-section').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    console.log('📝 Editando producto:', product.name);
  }

  // ── 6.4 Actualizar Producto ──
  async updateProduct(id, productData) {
    try {
      this.showNotification('⏳ Actualizando producto...', 'info');
      
      if (typeof api === 'undefined' || !api.updateProduct) {
        throw new Error('apiService no está disponible');
      }
      
      const updatedProduct = await api.updateProduct(id, productData);
      
      // Actualizar arrays
      const index = this.products.findIndex(p => (p._id || p.id) === id);
      if (index !== -1) {
        this.products[index] = updatedProduct;
      }
      if (typeof products !== 'undefined') {
        products = this.products;
      }

      this.showNotification('✅ Producto actualizado correctamente', 'success');
      this.resetForm();
      await this.refreshUI();
      
      console.log('✅ Producto actualizado:', updatedProduct.name);
    } catch (error) {
      console.error('❌ Error actualizando producto:', error);
      this.showNotification(`❌ Error: ${error.message}`, 'error');
    }
  }

  // ── 6.5 Eliminar Producto ──
  async deleteProduct(id) {
    const product = this.products.find(p => (p._id || p.id) === id);
    if (!product) {
      this.showNotification('❌ Producto no encontrado', 'error');
      return;
    }

    if (!confirm(`¿Eliminar "${product.name}"?`)) {
      return;
    }

    try {
      this.showNotification('⏳ Eliminando producto...', 'info');
      
      if (typeof api === 'undefined' || !api.deleteProduct) {
        throw new Error('apiService no está disponible');
      }
      
      await api.deleteProduct(id);
      
      // Actualizar arrays
      this.products = this.products.filter(p => (p._id || p.id) !== id);
      if (typeof products !== 'undefined') {
        products = this.products;
      }

      this.showNotification('🗑️ Producto eliminado correctamente', 'success');
      this.resetForm();
      await this.refreshUI();
      
      console.log('🗑️ Producto eliminado:', product.name);
    } catch (error) {
      console.error('❌ Error eliminando producto:', error);
      this.showNotification(`❌ Error: ${error.message}`, 'error');
    }
  }

  // ── 6.6 Resetear Formulario ──
  resetForm() {
    if (this.form) this.form.reset();
    document.getElementById('productId').value = '';
    document.getElementById('formTitle').innerHTML = '➕ Agregar Nuevo Producto';
    document.getElementById('prodRating').value = '4.5';
    document.getElementById('prodBadge').value = '';

    const preview = document.getElementById('imagePreview');
    const hiddenInput = document.getElementById('prodImage');
    const removeBtn = document.getElementById('removeImageBtn');
    const fileInput = document.getElementById('prodImageFile');

    if (preview) {
      preview.innerHTML = `
        <i class="fas fa-cloud-upload-alt"></i>
        <p>Arrastra una imagen o haz clic para seleccionar</p>
      `;
      preview.classList.remove('has-image');
    }
    if (hiddenInput) hiddenInput.value = 'Imagenes/placeholder.jpg';
    if (removeBtn) removeBtn.style.display = 'none';
    if (fileInput) fileInput.value = '';

    const submitBtn = this.form.querySelector('.btn-save');
    if (submitBtn) submitBtn.textContent = '💾 Guardar producto';

    this.currentProductId = null;
    console.log('🔄 Formulario reseteado');
  }

  // ──────────────────────────────────────────────────────────────
  // 7. MANEJO DE IMÁGENES
  // ──────────────────────────────────────────────────────────────

  handleFile(file, preview, hiddenInput, removeBtn) {
    if (!file.type.startsWith('image/')) {
      this.showNotification('❌ Por favor selecciona una imagen válida', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.showNotification('❌ La imagen no debe superar los 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;

      preview.innerHTML = `<img src="${imageUrl}" alt="Vista previa">`;
      preview.classList.add('has-image');
      hiddenInput.value = imageUrl;

      if (removeBtn) removeBtn.style.display = 'inline-flex';

      console.log('✅ Imagen cargada:', file.name);
    };

    reader.readAsDataURL(file);
  }

  removeImage(preview, hiddenInput, removeBtn, fileInput) {
    preview.innerHTML = `
      <i class="fas fa-cloud-upload-alt"></i>
      <p>Arrastra una imagen o haz clic para seleccionar</p>
    `;
    preview.classList.remove('has-image');
    hiddenInput.value = 'Imagenes/placeholder.jpg';
    if (removeBtn) removeBtn.style.display = 'none';
    if (fileInput) fileInput.value = '';
  }

  // ──────────────────────────────────────────────────────────────
  // 8. UTILITARIOS
  // ──────────────────────────────────────────────────────────────

  getCategoryName(category) {
    const categories = {
      'audifonos': '🎧 Audífonos',
      'parlantes': '🔊 Parlantes',
      'microfonos': '🎤 Micrófonos',
      'accesorios': '🔌 Accesorios',
      'instrumentos': '🎸 Instrumentos',
      'estudios': '🎛️ Estudios'
    };
    return categories[category] || category;
  }

  showNotification(message, type = 'success') {
    document.querySelectorAll('.admin-toast').forEach(el => el.remove());

    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    toast.textContent = message;

    const colors = {
      success: '#4ade80',
      error: '#dc3545',
      info: '#1198eb'
    };

    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 14px 28px;
      border-radius: 12px;
      z-index: 10000;
      font-weight: 600;
      font-size: 0.95rem;
      animation: slideIn 0.3s ease;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      background: ${colors[type] || colors.success};
      color: ${type === 'success' ? '#1a1a2e' : 'white'};
      max-width: 90%;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// ──────────────────────────────────────────────────────────────
// 9. INICIALIZACIÓN
// ──────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Inicializando AdminController...');
  const adminController = new AdminController();
  window.adminController = adminController;
  console.log('✅ AdminController inicializado');
});