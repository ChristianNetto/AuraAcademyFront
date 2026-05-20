import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { mockCourses } from '../../data/mockCourses'
import { authService } from '../../services/api'
import '../../styles/styleStudent.css'

function DashboardPage() {
  const navigate = useNavigate()
  
  // States
  const [currentUser, setCurrentUser] = useState({ nome: 'Christian Netto', email: 'aluno@aura.com', role: 'ALUNO' })
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCourses, setFilteredCourses] = useState(mockCourses)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [showToast, setShowToast] = useState(false)

  // Load actual user if logged in
  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user) {
      setCurrentUser(prev => ({
        ...prev,
        email: user.email,
        nome: user.email.split('@')[0].toUpperCase(),
        role: user.role
      }))
    }
  }, [])

  // Filter courses based on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCourses(mockCourses)
    } else {
      const lowerQuery = searchQuery.toLowerCase()
      const filtered = mockCourses.filter(course => 
        course.titulo.toLowerCase().includes(lowerQuery) || 
        course.instrutor.toLowerCase().includes(lowerQuery) ||
        course.categoria.toLowerCase().includes(lowerQuery)
      )
      setFilteredCourses(filtered)
    }
  }, [searchQuery])

  const handleLogout = () => {
    authService.logout()
    triggerToast('Até logo! Finalizando sessão...')
    setTimeout(() => {
      navigate('/login')
    }, 1200)
  }

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

  // Stat summary calculations
  const totalCourses = mockCourses.length
  const completedCourses = mockCourses.filter(c => c.progresso === 100).length
  const inProgressCourses = mockCourses.filter(c => c.progresso > 0 && c.progresso < 100).length

  return (
    <div className="student-page">
      {/* ── HEADER ── */}
      <header className="student-header">
        <Link to="/aluno/dashboard" className="student-logo">
          Aura<span>Academy</span>
        </Link>

        {/* Visual Search Bar with live filter */}
        <div className="search-bar-visual">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="O que você deseja aprender hoje?" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Profile Avatar */}
        <div className="student-profile">
          <button 
            className="student-avatar-btn" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="Menu do Aluno"
          >
            {currentUser.nome.substring(0, 2)}
          </button>

          {dropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-user-info">
                <div className="dropdown-user-name">{currentUser.nome}</div>
                <div className="dropdown-user-role">{currentUser.role}</div>
              </div>
              <Link to="/aluno/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Catálogo de Cursos
              </Link>
              <button 
                className="dropdown-item" 
                onClick={() => {
                  setDropdownOpen(false)
                  triggerToast('Configurações da conta em breve!')
                }}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Configurações
              </button>
              <button className="dropdown-item danger" onClick={handleLogout}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <section className="student-hero">
        <div className="hero-container">
          <div className="hero-text">
            <span className="hero-badge">✦ Espaço do Aluno</span>
            <h1 className="hero-title">
              Evolua na velocidade<br />da tecnologia.
            </h1>
            <p className="hero-subtitle">
              Bem-vindo de volta, <strong>{currentUser.nome}</strong>! Você possui <strong>{inProgressCourses} curso(s) em andamento</strong>. Continue de onde parou ou explore novas tecnologias.
            </p>
          </div>
          <div className="hero-stats">
            <div className="hero-stat-card">
              <div className="hero-stat-num">{totalCourses}</div>
              <div className="hero-stat-label">Cursos</div>
            </div>
            <div className="hero-stat-card" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="hero-stat-num">{inProgressCourses}</div>
              <div className="hero-stat-label">Em curso</div>
            </div>
            <div className="hero-stat-card">
              <div className="hero-stat-num">{completedCourses}</div>
              <div className="hero-stat-label">Concluídos</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="student-main-content">
        <h2 className="section-title">
          Meus Cursos
          <span className="section-subtitle-counter">
            {filteredCourses.length} disponíveis
          </span>
        </h2>

        {filteredCourses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--white)', borderRadius: '20px', border: '1px solid var(--cream-dark)' }}>
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--ink-muted)', marginBottom: '1rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>Nenhum curso encontrado</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.88rem' }}>Tente refinar sua busca utilizando termos diferentes.</p>
          </div>
        ) : (
          <div className="courses-grid">
            {filteredCourses.map((course) => (
              <Link 
                to={`/aluno/curso/${course.id}`} 
                key={course.id} 
                className="course-card-interactive"
              >
                <div className="card-img-wrapper">
                  <img src={course.thumbnail} alt={course.titulo} className="card-img" />
                  <span className="card-category-badge">{course.categoria}</span>
                </div>
                <div className="card-content">
                  <div className="card-instructor">{course.instrutor}</div>
                  <h3 className="card-title">{course.titulo}</h3>
                  <p className="card-desc">{course.descricaoCurta}</p>
                  
                  <div className="card-footer">
                    <div className="card-progress-bar-container">
                      <div className="card-progress-bar" style={{ width: `${course.progresso}%` }}></div>
                    </div>
                    <div className="card-progress-info">
                      <span>Progresso</span>
                      <span className="card-progress-num">{course.progresso}%</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Toast Alert */}
      <div className={`toast ${showToast ? 'show' : ''}`}>{toastMsg}</div>
    </div>
  )
}

export default DashboardPage
