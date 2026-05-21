import React, { useState, useEffect } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import Sidebar from './Sidebar'
import { recentRegistrations, initialCourses } from '../data/adminMockData'
import { usuarioService, cursoService, authService } from '../services/api'
import '../styles/styleAdmin.css'

const mapBackendUserToFrontend = (user) => {
  const nameParts = user.nome.trim().split(' ')
  const initials = nameParts.length > 1 
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : nameParts[0].substring(0, 2).toUpperCase()

  const bgColors = ['var(--teal)', 'var(--gold)', 'var(--accent)', '#e67e22', '#2980b9', '#16a085', '#8e44ad']
  const bg = bgColors[user.id % bgColors.length]

  const rawStatus = user.ativo ? 'ativo' : 'inativo'
  const status = user.ativo ? 'Ativo' : 'Inativo'
  const roleMapped = user.role === 'ADMIN' ? 'Admin' : user.role === 'INSTRUTOR' ? 'Instrutor' : 'Aluno'
  
  const createdDate = user.criadoEm 
    ? new Date(user.criadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '')
    : new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '')

  return {
    id: user.id,
    name: user.nome,
    email: user.email,
    initials,
    bg,
    plan: user.role === 'ADMIN' ? 'Premium' : 'Gratuito',
    status,
    date: createdDate,
    role: roleMapped,
    courses: '—',
    rawStatus,
    rawPlan: user.role === 'ADMIN' ? 'premium' : 'gratuito'
  }
}

const mapBackendCourseToFrontend = (course) => {
  const hours = course.cargaHorariaMinutos ? Math.round(course.cargaHorariaMinutos / 60) : 10
  const statusMapped = course.status === 'PUBLICADO' ? 'Publicado' : 'Rascunho'
  const rawStatus = course.status === 'PUBLICADO' ? 'publicado' : 'rascunho'
  
  let thumb = '🎓'
  if (course.thumbUrl && course.thumbUrl.length <= 4) {
    thumb = course.thumbUrl
  }

  return {
    id: course.id,
    name: course.titulo,
    category: `${course.categoria || 'Geral'} · ${hours}h de conteúdo`,
    instructor: course.instrutorNome || 'Instrutor',
    students: '—',
    rating: '—',
    modules: course.modulos ? course.modulos.length : 0,
    status: statusMapped,
    rawStatus: rawStatus,
    thumb: thumb,
    bg: course.status === 'PUBLICADO' ? '#e8f5f0' : '#f5f5f5'
  }
}

function AdminLayout() {
  const location = useLocation()
  const [toastMsg, setToastMsg] = useState('')
  const [showToast, setShowToast] = useState(false)

  // Shared state for users and courses
  const [users, setUsers] = useState(recentRegistrations)
  const [courses, setCourses] = useState(initialCourses)
  const [backendConnected, setBackendConnected] = useState(false)

  // Modals visibility state
  const [showUserModal, setShowUserModal] = useState(false)
  const [showCourseModal, setShowCourseModal] = useState(false)

  // Form states for New User
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [newUserPlan, setNewUserPlan] = useState('Premium')

  // Form states for New Course
  const [newCourseTitle, setNewCourseTitle] = useState('')
  const [newCourseCategory, setNewCourseCategory] = useState('')
  const [newCourseLevel, setNewCourseLevel] = useState('INICIANTE')
  const [newCourseHours, setNewCourseHours] = useState('10')
  const [newCourseDesc, setNewCourseDesc] = useState('')
  const [newCourseThumb, setNewCourseThumb] = useState('🎓')

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setShowToast(true)
  }

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  // Fetch real data on mount
  useEffect(() => {
    async function loadBackendData() {
      try {
        const uList = await usuarioService.listar()
        if (Array.isArray(uList)) {
          setUsers(uList.map(mapBackendUserToFrontend))
          setBackendConnected(true)
        }
      } catch (err) {
        console.warn("Backend indisponível para carregar usuários, utilizando mocks.")
      }

      try {
        // Fallback robusto a listarMeusCursos ou listar
        let cList = []
        try {
          const res = await cursoService.listarMeusCursos()
          cList = res.content || res
        } catch (e) {
          const res = await cursoService.listar()
          cList = res.content || res
        }
        if (Array.isArray(cList)) {
          setCourses(cList.map(mapBackendCourseToFrontend))
          setBackendConnected(true)
        }
      } catch (err) {
        console.warn("Backend indisponível para carregar cursos, utilizando mocks.")
      }
    }
    loadBackendData()
  }, [])

  // Get current page header title and subtitle based on path
  let currentTitle = "Dashboard"
  let currentSubtitle = backendConnected 
    ? "Bem-vindo de volta. Conectado ao servidor AuraAcademy." 
    : "Bem-vindo de volta. Aqui está o resumo de hoje — 30 de abril de 2026."

  const path = location.pathname
  if (path.includes('/admin/users')) {
    currentTitle = "Usuários"
    currentSubtitle = "Gerencie todos os alunos e administradores da plataforma."
  } else if (path.includes('/admin/courses')) {
    currentTitle = "Cursos"
    currentSubtitle = backendConnected
      ? "Gerencie o catálogo de cursos e estruture módulos."
      : "Catálogo administrativo (Modo Simulado - Backend desconectado)"
  } else if (path.includes('/admin/reports')) {
    currentTitle = "Relatórios"
    currentSubtitle = "Área administrativa"
  } else if (path.includes('/admin/financial')) {
    currentTitle = "Financeiro"
    currentSubtitle = "Área administrativa"
  } else if (path.includes('/admin/notifications')) {
    currentTitle = "Notificações"
    currentSubtitle = "Área administrativa"
  } else if (path.includes('/admin/settings')) {
    currentTitle = "Configurações"
    currentSubtitle = "Área administrativa"
  }

  // Handle New User creation
  const handleCreateUserSubmit = async (e) => {
    e.preventDefault()
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      triggerToast('Nome, e-mail e senha são obrigatórios!')
      return
    }

    let success = false
    let createdUser = null

    try {
      // Registrar no backend
      const data = await authService.registro(newUserName.trim(), newUserEmail.trim(), newUserPassword.trim())
      // Após registrar, se o plano for Premium (ou seja, quer virar ADMIN ou INSTRUTOR), tenta alterar
      // Por padrão Spring cria como ALUNO. Se o admin escolheu algo diferente:
      let finalRole = 'ALUNO'
      if (newUserPlan === 'Premium') {
        finalRole = 'ADMIN'
      }
      
      // O backend retorna UsuarioResponse criado, mas pode estar em formato diferente.
      // Vamos listar novamente para atualizar ou simular a inserção baseada na resposta.
      createdUser = {
        id: data.id || Date.now(),
        nome: newUserName.trim(),
        email: newUserEmail.trim(),
        role: finalRole,
        ativo: true,
        criadoEm: new Date().toISOString()
      }
      
      // Tenta atualizar papel se não for ALUNO
      if (finalRole !== 'ALUNO' && data.id) {
        try {
          await usuarioService.alterarRole(data.id, finalRole)
        } catch (e) {
          console.warn("Erro ao alterar papel no backend, mantido como ALUNO.")
        }
      }

      success = true
      triggerToast(`Usuário "${newUserName}" cadastrado com sucesso no servidor!`)
    } catch (err) {
      console.warn("Erro ao cadastrar no backend, utilizando fallback simulado.", err)
      const nameParts = newUserName.trim().split(' ')
      const initials = nameParts.length > 1 
        ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
        : nameParts[0].substring(0, 2).toUpperCase()

      const bgColors = ['var(--teal)', 'var(--gold)', 'var(--accent)', '#e67e22', '#2980b9', '#16a085', '#8e44ad']
      const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)]

      createdUser = {
        id: Date.now(),
        nome: newUserName.trim(),
        email: newUserEmail.trim(),
        ativo: true,
        role: newUserPlan === 'Premium' ? 'ADMIN' : 'ALUNO',
        criadoEm: new Date().toISOString()
      }
      success = true
      triggerToast(`Usuário "${newUserName}" cadastrado (Simulado - Off-line)!`)
    }

    if (success && createdUser) {
      const frontendUser = mapBackendUserToFrontend(createdUser)
      setUsers([frontendUser, ...users])
      
      // Reset and Close
      setNewUserName('')
      setNewUserEmail('')
      setNewUserPassword('')
      setNewUserPlan('Premium')
      setShowUserModal(false)
    }
  }

  // Handle New Course creation
  const handleCreateCourseSubmit = async (e) => {
    e.preventDefault()
    if (!newCourseTitle.trim()) {
      triggerToast('O título do curso é obrigatório!')
      return
    }

    let success = false
    let createdCourse = null

    try {
      const courseData = {
        titulo: newCourseTitle.trim(),
        descricao: newCourseDesc.trim() || 'Sem descrição cadastrada.',
        categoria: newCourseCategory.trim() || 'Geral',
        nivel: newCourseLevel, // INICIANTE, INTERMEDIARIO, AVANCADO
        cargaHorariaMinutos: parseInt(newCourseHours) * 60,
        thumbUrl: newCourseThumb
      }

      const response = await cursoService.criar(courseData)
      createdCourse = response
      success = true
      triggerToast(`Curso "${newCourseTitle}" criado no servidor!`)
    } catch (err) {
      console.warn("Erro ao criar curso no backend, utilizando fallback simulado.", err)
      createdCourse = {
        id: Date.now(),
        titulo: newCourseTitle.trim(),
        descricao: newCourseDesc.trim(),
        categoria: newCourseCategory.trim() || 'Geral',
        nivel: newCourseLevel,
        status: 'RASCUNHO',
        thumbUrl: newCourseThumb,
        cargaHorariaMinutos: parseInt(newCourseHours) * 60,
        instrutorNome: 'Você (Instrutor)',
        modulos: []
      }
      success = true
      triggerToast(`Curso "${newCourseTitle}" criado (Simulado - Off-line)!`)
    }

    if (success && createdCourse) {
      const frontendCourse = mapBackendCourseToFrontend(createdCourse)
      setCourses([frontendCourse, ...courses])

      // Reset and Close
      setNewCourseTitle('')
      setNewCourseCategory('')
      setNewCourseLevel('INICIANTE')
      setNewCourseHours('10')
      setNewCourseDesc('')
      setNewCourseThumb('🎓')
      setShowCourseModal(false)
    }
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      
      <main className="admin-main">
        {/* TOP HEADER */}
        <header className="admin-header">
          <div className="header-title">
            <h1>{currentTitle}</h1>
            <p>{currentSubtitle}</p>
          </div>
          <div className="header-actions">
            <button className="notif-btn" onClick={() => triggerToast('Nenhuma nova notificação')}>
              🔔 <span className="notif-dot"></span>
            </button>
            <button className="btn-action secondary" onClick={() => setShowCourseModal(true)}>
              + Novo Curso
            </button>
            <button className="btn-action primary" onClick={() => setShowUserModal(true)}>
              + Novo Usuário
            </button>
          </div>
        </header>

        {/* ACTIVE ROUTE PAGE */}
        <Outlet context={{ 
          users, 
          setUsers, 
          courses, 
          setCourses, 
          triggerToast, 
          openNewUserModal: () => setShowUserModal(true),
          openNewCourseModal: () => setShowCourseModal(true)
        }} />
      </main>

      {/* TOAST NOTIFICATION */}
      <div className={`toast ${showToast ? 'show' : ''}`}>
        {toastMsg}
      </div>

      {/* MODAL NOVO USUÁRIO */}
      {showUserModal && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Cadastrar Novo Usuário</span>
              <button className="modal-close" onClick={() => setShowUserModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleCreateUserSubmit} className="modal-form">
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: '0.35rem' }}>Nome Completo *</label>
                <input 
                  type="text" 
                  placeholder="Ex: Maria Oliveira"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="modal-input"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: '0.35rem' }}>E-mail *</label>
                <input 
                  type="email" 
                  placeholder="Ex: maria@email.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="modal-input"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: '0.35rem' }}>Senha *</label>
                <input 
                  type="password" 
                  placeholder="Defina uma senha"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="modal-input"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: '0.35rem' }}>Plano *</label>
                <select 
                  value={newUserPlan}
                  onChange={(e) => setNewUserPlan(e.target.value)}
                  className="modal-select"
                >
                  <option value="Premium">Premium</option>
                  <option value="Gratuito">Gratuito</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-action secondary" onClick={() => setShowUserModal(false)}>Cancelar</button>
                <button type="submit" className="btn-action primary">Salvar Usuário</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOVO CURSO */}
      {showCourseModal && (
        <div className="modal-overlay" onClick={() => setShowCourseModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Criar Novo Curso</span>
              <button className="modal-close" onClick={() => setShowCourseModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleCreateCourseSubmit} className="modal-form">
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <div style={{ width: '80px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: '0.35rem' }}>Ícone</label>
                  <select 
                    value={newCourseThumb}
                    onChange={(e) => setNewCourseThumb(e.target.value)}
                    className="modal-select"
                  >
                    <option value="🎓">🎓</option>
                    <option value="📐">📐</option>
                    <option value="⚙️">⚙️</option>
                    <option value="🎯">🎯</option>
                    <option value="🐍">🐍</option>
                    <option value="📱">📱</option>
                    <option value="🤖">🤖</option>
                    <option value="☁️">☁️</option>
                    <option value="💻">💻</option>
                    <option value="🎨">🎨</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: '0.35rem' }}>Título do Curso *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Spring Boot com React"
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    className="modal-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: '0.35rem' }}>Categoria</label>
                <input 
                  type="text" 
                  placeholder="Ex: Back-end, Design, Mobile..."
                  value={newCourseCategory}
                  onChange={(e) => setNewCourseCategory(e.target.value)}
                  className="modal-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: '0.35rem' }}>Nível *</label>
                  <select 
                    value={newCourseLevel}
                    onChange={(e) => setNewCourseLevel(e.target.value)}
                    className="modal-select"
                  >
                    <option value="INICIANTE">Iniciante</option>
                    <option value="INTERMEDIARIO">Intermediário</option>
                    <option value="AVANCADO">Avançado</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: '0.35rem' }}>Carga Horária (horas)</label>
                  <input 
                    type="number" 
                    min="1"
                    value={newCourseHours}
                    onChange={(e) => setNewCourseHours(e.target.value)}
                    className="modal-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: '0.35rem' }}>Descrição</label>
                <textarea 
                  placeholder="Descreva brevemente o que o aluno aprenderá..."
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  className="modal-input"
                  rows="3"
                  style={{ resize: 'none', height: '80px', fontFamily: 'inherit' }}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-action secondary" onClick={() => setShowCourseModal(false)}>Cancelar</button>
                <button type="submit" className="btn-action primary">Salvar Curso</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminLayout
