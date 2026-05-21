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

  // GET /api/instrutor/cursos/{id} — detalhes completos incluindo RASCUNHO
  async buscarMeuCurso(id) {
    const response = await apiClient.get(`/api/instrutor/cursos/${id}`)
    return response.data
  },

  // GET /api/instrutor/cursos (apenas Instrutor/Admin)
  async listarMeusCursos(params = {}) {
    const response = await apiClient.get('/api/instrutor/cursos', { params })
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

// Serviços de Usuários (Admin)
export const usuarioService = {
  // GET /api/usuarios ou /api/admin/usuarios
  async listar(params = {}) {
    const response = await apiClient.get('/api/usuarios', { params })
    return response.data
  },

  // GET /api/usuarios/{id}
  async buscarPorId(id) {
    const response = await apiClient.get(`/api/usuarios/${id}`)
    return response.data
  },

  // POST /api/usuarios
  async criar(usuarioData) {
    const response = await apiClient.post('/api/usuarios', usuarioData)
    return response.data
  },

  // PUT /api/usuarios/{id}
  async atualizar(id, usuarioData) {
    const response = await apiClient.put(`/api/usuarios/${id}`, usuarioData)
    return response.data
  },

  // DELETE /api/usuarios/{id}
  async excluir(id) {
    const response = await apiClient.delete(`/api/usuarios/${id}`)
    return response.data
  },

  // PATCH /api/usuarios/{id}/role
  async alterarRole(id, role) {
    const response = await apiClient.patch(`/api/usuarios/${id}/role`, { role })
    return response.data
  }
}

// Serviços do Aluno (Dashboard, Certificados)
export const alunoService = {
  // GET /api/aluno/dashboard
  async getDashboard(params = {}) {
    const response = await apiClient.get('/api/aluno/dashboard', { params })
    return response.data
  },

  // GET /api/aluno/certificados
  async getCertificados() {
    const response = await apiClient.get('/api/aluno/certificados')
    return response.data
  }
}

// Serviços de Matrícula e Progresso (Aluno)
export const matriculaService = {
  // POST /api/matriculas/cursos/{cursoId}
  async matricular(cursoId) {
    const response = await apiClient.post(`/api/matriculas/cursos/${cursoId}`)
    return response.data
  },

  // PATCH /api/matriculas/{matriculaId}/aulas/{aulaId}/concluir
  async concluirAula(matriculaId, aulaId) {
    const response = await apiClient.patch(`/api/matriculas/${matriculaId}/aulas/${aulaId}/concluir`)
    return response.data
  }
}

// Serviços de Módulos (Instrutor)
export const moduloService = {
  // POST /api/instrutor/cursos/{cursoId}/modulos
  async criar(cursoId, moduloData) {
    const response = await apiClient.post(`/api/instrutor/cursos/${cursoId}/modulos`, moduloData)
    return response.data
  },

  // PUT /api/instrutor/cursos/{cursoId}/modulos/{moduloId}
  async atualizar(cursoId, moduloId, moduloData) {
    const response = await apiClient.put(`/api/instrutor/cursos/${cursoId}/modulos/${moduloId}`, moduloData)
    return response.data
  },

  // DELETE /api/instrutor/cursos/{cursoId}/modulos/{moduloId}
  async excluir(cursoId, moduloId) {
    const response = await apiClient.delete(`/api/instrutor/cursos/${cursoId}/modulos/${moduloId}`)
    return response.data
  }
}

// Serviços de Aulas (Instrutor)
export const aulaService = {
  // POST /api/instrutor/modulos/{moduloId}/aulas
  async criar(moduloId, aulaData) {
    const response = await apiClient.post(`/api/instrutor/modulos/${moduloId}/aulas`, aulaData)
    return response.data
  },

  // PUT /api/instrutor/modulos/{moduloId}/aulas/{aulaId}
  async atualizar(moduloId, aulaId, aulaData) {
    const response = await apiClient.put(`/api/instrutor/modulos/${moduloId}/aulas/${aulaId}`, aulaData)
    return response.data
  },

  // DELETE /api/instrutor/modulos/{moduloId}/aulas/{aulaId}
  async excluir(moduloId, aulaId) {
    const response = await apiClient.delete(`/api/instrutor/modulos/${moduloId}/aulas/${aulaId}`)
    return response.data
  }
}

// Serviços de Certificado Público (Validação)
export const certificadoService = {
  // GET /public/certificados/{hash}
  async validar(hash) {
    const response = await apiClient.get(`/public/certificados/${hash}`)
    return response.data
  }
}

export default apiClient


