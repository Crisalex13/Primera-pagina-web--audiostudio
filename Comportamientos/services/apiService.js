/* ============================================================
   apiService.js - Cliente API para Node.js + MongoDB
   ============================================================
   TABLA DE CONTENIDO
   ============================================================
   1. Configuración
      1.1 API_URL
      1.2 Constructor

   2. Peticiones Base
      2.1 request()

   3. Métodos de Productos
      3.1 getProducts()
      3.2 getProduct()
      3.3 createProduct()
      3.4 updateProduct()
      3.5 deleteProduct()

   4. Métodos de Estadísticas
      4.1 getStats()
   ============================================================ */

// ──────────────────────────────────────────────────────────────
// 1. CONFIGURACIÓN
// ──────────────────────────────────────────────────────────────

const API_URL = 'http://localhost:5000/api';

// ──────────────────────────────────────────────────────────────
// 2. API SERVICE
// ──────────────────────────────────────────────────────────────

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  // ── 2.1 Petición base ──
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      ...options
    };

    try {
      console.log(`📡 ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('❌ API Error:', error.message);
      throw error;
    }
  }

  // ──────────────────────────────────────────────────────────────
  // 3. MÉTODOS DE PRODUCTOS
  // ──────────────────────────────────────────────────────────────

  // ── 3.1 Obtener todos los productos ──
  async getProducts() {
    const response = await this.request('/products');
    return response.data || [];
  }

  // ── 3.2 Obtener un producto por ID ──
  async getProduct(id) {
    const response = await this.request(`/products/${id}`);
    return response.data;
  }

  // ── 3.3 Crear un producto ──
  async createProduct(product) {
    const response = await this.request('/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
    return response.data;
  }

  // ── 3.4 Actualizar un producto ──
  async updateProduct(id, product) {
    const response = await this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product)
    });
    return response.data;
  }

  // ── 3.5 Eliminar un producto ──
  async deleteProduct(id) {
    await this.request(`/products/${id}`, {
      method: 'DELETE'
    });
    return true;
  }

  // ──────────────────────────────────────────────────────────────
  // 4. MÉTODOS DE ESTADÍSTICAS
  // ──────────────────────────────────────────────────────────────

  // ── 4.1 Obtener estadísticas ──
  async getStats() {
    const response = await this.request('/products/stats');
    return response.data;
  }
}

// ──────────────────────────────────────────────────────────────
// 5. EXPORTAR INSTANCIA
// ──────────────────────────────────────────────────────────────

const api = new ApiService();
console.log('✅ API Service inicializado en:', API_URL);