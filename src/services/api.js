import axios from 'axios'

// Configura a URL base do backend Spring Boot
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptador de Requisição: Adiciona o token JWT do localStorage caso exista
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptador de Resposta: Trata erros globais (como token expirado)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Se receber 401 Unauthorized, limpa o token e redireciona para login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Serviços de Autenticação
export const authService = {
  async login(email, senha) {
    const response = await apiClient.post('/api/auth/login', { email, senha })
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify({
        email: response.data.email,
        role: response.data.role
      }))
    }
    return response.data
  },

  async registro(nome, email, senha, role) {
    const response = await apiClient.post('/api/auth/registro', { nome, email, senha, role })
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify({
        email: response.data.email,
        role: response.data.role
      }))
    }
    return response.data
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  isAuthenticated() {
    return !!localStorage.getItem('token')
  }
}

// Serviços de Cursos
export const cursoService = {
  // GET /api/cursos
  async listar(params = {}) {
    const response = await apiClient.get('/api/cursos', { params })
    return response.data // Retorna o Page<CursoResponse> do Spring
  },

  // GET /api/cursos/{id}
  async buscarPorId(id) {
    const response = await apiClient.get(`/api/cursos/${id}`)
    return response.data
  },

  // POST /api/instrutor/cursos (apenas Instrutor/Admin)
  async criar(cursoData) {
    const response = await apiClient.post('/api/instrutor/cursos', cursoData)
    return response.data
  },

  // PUT /api/instrutor/cursos/{id} (apenas Instrutor/Admin)
  async atualizar(id, cursoData) {
    const response = await apiClient.put(`/api/instrutor/cursos/${id}`, cursoData)
    return response.data
  },

  // PATCH /api/instrutor/cursos/{id}/publicar (apenas Instrutor/Admin)
  async publicar(id) {
    const response = await apiClient.patch(`/api/instrutor/cursos/${id}/publicar`)
    return response.data
  },

  // DELETE /api/instrutor/cursos/{id} (apenas Instrutor/Admin)
  async excluir(id) {
    const response = await apiClient.delete(`/api/instrutor/cursos/${id}`)
    return response.data
  }
}

export default apiClient
