import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { mockCourses } from '../../data/mockCourses'
import { authService, cursoService, alunoService, matriculaService } from '../../services/api'
import '../../styles/styleStudent.css'

function DashboardPage() {
  const navigate = useNavigate()
  
  // Tab states: 'catalog' | 'my-courses' | 'certificates'
  const [activeTab, setActiveTab] = useState('catalog')
  
  // Base states
  const [currentUser, setCurrentUser] = useState({ nome: 'Christian Netto', email: 'aluno@aura.com', role: 'ALUNO' })
  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [backendConnected, setBackendConnected] = useState(false)
  
  // Loaded list states
  const [catalogCourses, setCatalogCourses] = useState([])
  const [myCourses, setMyCourses] = useState([])
  const [certificates, setCertificates] = useState([])

  // Modal details state
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [isEnrolling, setIsEnrolling] = useState(false)

  // Load user profile
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

  // Load Catalog, Student Dashboard and Certificates
  useEffect(() => {
    async function loadData() {
      // 1. Fetch Catalog (Published)
      try {
        const response = await cursoService.listar()
        const fetchedList = response.content || response
        if (Array.isArray(fetchedList)) {
          setCatalogCourses(fetchedList.map(c => ({
            id: c.id,
            titulo: c.titulo,
            instrutor: c.instrutorNome || 'Instrutor Aura',
            categoria: c.categoria || 'Geral',
            progresso: 0,
            thumbnail: getThumbUrlOrFallback(c.thumbUrl),
            descricaoCurta: c.descricao || 'Sem descrição cadastrada.',
            cargaHoraria: c.cargaHorariaMinutos ? Math.round(c.cargaHorariaMinutos / 60) : 10,
            modulos: c.modulos || [],
            isEnrolled: false
          })))
          setBackendConnected(true)
        }
      } catch (err) {
        console.warn("Backend offline para o catálogo, carregando mocks.")
        setCatalogCourses(mockCourses.map(c => ({
          ...c,
          cargaHoraria: c.totalAulas ? c.totalAulas * 2 : 12,
          isEnrolled: false
        })))
      }

      // 2. Fetch Enrolled Courses (Student space)
      try {
        const dashboard = await alunoService.getDashboard()
        const enrolledList = dashboard.matriculas || dashboard
        if (Array.isArray(enrolledList)) {
          setMyCourses(enrolledList.map(m => ({
            id: m.curso.id,
            matriculaId: m.id,
            titulo: m.curso.titulo,
            instrutor: m.curso.instrutorNome || 'Instrutor Aura',
            categoria: m.curso.categoria || 'Geral',
            progresso: Math.round(m.progresso || 0),
            thumbnail: getThumbUrlOrFallback(m.curso.thumbUrl),
            descricaoCurta: m.curso.descricao || 'Sem descrição cadastrada.',
            cargaHoraria: m.curso.cargaHorariaMinutos ? Math.round(m.curso.cargaHorariaMinutos / 60) : 10,
            modulos: m.curso.modulos || [],
            isEnrolled: true
          })))
          setBackendConnected(true)
        }
      } catch (err) {
        console.warn("Backend offline para as matrículas, carregando mocks em progresso.")
        setMyCourses(mockCourses.filter(c => c.progresso > 0).map(c => ({
          ...c,
          cargaHoraria: c.totalAulas ? c.totalAulas * 2 : 12,
          isEnrolled: true
        })))
      }

      // 3. Fetch Certificates
      try {
        const certList = await alunoService.getCertificados()
        if (Array.isArray(certList)) {
          setCertificates(certList.map(cert => ({
            id: cert.id,
            hash: cert.hash,
            dataEmissao: cert.dataEmissao,
            cursoTitulo: cert.curso.titulo,
            cargaHoraria: Math.round(cert.curso.cargaHorariaMinutos / 60) || 12,
            alunoNome: cert.aluno.nome
          })))
        }
      } catch (err) {
        console.warn("Backend offline para certificados, simulando completados.")
        setCertificates([
          {
            id: 'cert_sim_1',
            hash: 'a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d',
            dataEmissao: new Date().toISOString(),
            cursoTitulo: 'UX/UI Design: Interfaces Premium de Alta Conversão',
            cargaHoraria: 18,
            alunoNome: currentUser.nome
          }
        ])
      }
    }
    loadData()
  }, [currentUser.nome])

  const getThumbUrlOrFallback = (thumb) => {
    if (thumb && thumb.startsWith('http')) return thumb
    // Mapping symbols to nice Unsplash templates
    const map = {
      '📐': 'https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=600&q=80',
      '⚙️': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80',
      '🎯': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
      '🐍': 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&q=80',
      '💻': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
      '🎓': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
    }
    return map[thumb] || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
  }

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

  const handleCourseClick = (course) => {
    // Check if enrolled
    const enrolledMatch = myCourses.find(c => c.id === course.id)
    if (enrolledMatch) {
      navigate(`/aluno/curso/${course.id}`)
    } else {
      setSelectedCourse(course)
      setShowDetailsModal(true)
    }
  }

  const handleEnrollSubmit = async () => {
    if (!selectedCourse) return
    setIsEnrolling(true)
    
    try {
      const newMat = await matriculaService.matricular(selectedCourse.id)
      triggerToast(`Matrícula efetuada com sucesso no curso "${selectedCourse.titulo}"! 🎉`)
      
      // Update UI state
      const enrolledCourse = {
        ...selectedCourse,
        matriculaId: newMat.id,
        progresso: 0,
        isEnrolled: true
      }
      setMyCourses([...myCourses, enrolledCourse])
      setShowDetailsModal(false)
      
      // Redirect straight to player
      setTimeout(() => {
        navigate(`/aluno/curso/${selectedCourse.id}`)
      }, 1000)
    } catch (err) {
      console.warn("Erro ao se matricular no backend, simulando matrícula local.")
      triggerToast(`Matriculado (Simulado - Backend desconectado)! 🎉`)
      
      const enrolledCourseSim = {
        ...selectedCourse,
        matriculaId: 'mat_' + Date.now(),
        progresso: 0,
        isEnrolled: true
      }
      setMyCourses([...myCourses, enrolledCourseSim])
      setShowDetailsModal(false)
      
      setTimeout(() => {
        navigate(`/aluno/curso/${selectedCourse.id}`)
      }, 1000)
    } finally {
      setIsEnrolling(false)
    }
  }

  // Live filter computed lists
  const getFilteredList = () => {
    const list = activeTab === 'catalog' ? catalogCourses : myCourses
    if (!searchQuery.trim()) return list
    const q = searchQuery.toLowerCase()
    return list.filter(c => 
      c.titulo.toLowerCase().includes(q) || 
      c.instrutor.toLowerCase().includes(q) ||
      c.categoria.toLowerCase().includes(q)
    )
  }

  const filteredItems = getFilteredList()

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
              <button className="dropdown-item" onClick={() => { setDropdownOpen(false); setActiveTab('catalog'); }}>
                🎓 Catálogo de Cursos
              </button>
              <button className="dropdown-item" onClick={() => { setDropdownOpen(false); setActiveTab('my-courses'); }}>
                📚 Cursos Matriculados
              </button>
              <button className="dropdown-item" onClick={() => { setDropdownOpen(false); setActiveTab('certificates'); }}>
                🏅 Meus Certificados
              </button>
              <button className="dropdown-item danger" onClick={handleLogout}>
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
            <span className="hero-badge">
              {backendConnected ? '✦ Conectado ao AuraServer' : '✦ Espaço do Aluno (Simulado)'}
            </span>
            <h1 className="hero-title">
              Evolua na velocidade<br />da tecnologia.
            </h1>
            <p className="hero-subtitle">
              Bem-vindo de volta, <strong>{currentUser.nome}</strong>! Você possui <strong>{myCourses.filter(c => c.progresso < 100).length} curso(s) em andamento</strong> e <strong>{certificates.length} certificado(s) emitido(s)</strong>.
            </p>
          </div>
          <div className="hero-stats">
            <div className="hero-stat-card" onClick={() => setActiveTab('catalog')} style={{ cursor: 'pointer' }}>
              <div className="hero-stat-num">{catalogCourses.length}</div>
              <div className="hero-stat-label">Disponíveis</div>
            </div>
            <div className="hero-stat-card" onClick={() => setActiveTab('my-courses')} style={{ cursor: 'pointer', borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="hero-stat-num">{myCourses.filter(c => c.progresso < 100).length}</div>
              <div className="hero-stat-label">Em curso</div>
            </div>
            <div className="hero-stat-card" onClick={() => setActiveTab('certificates')} style={{ cursor: 'pointer' }}>
              <div className="hero-stat-num">{certificates.length}</div>
              <div className="hero-stat-label">Certificados</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="student-main-content">
        
        {/* TABS SWITCHER */}
        <div className="dashboard-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--cream-dark)', paddingBottom: '0.8rem' }}>
          <button 
            className={`tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.92rem',
              fontWeight: activeTab === 'catalog' ? '700' : '500',
              color: activeTab === 'catalog' ? 'var(--teal)' : 'var(--ink-muted)',
              cursor: 'pointer',
              padding: '0.4rem 0.8rem',
              borderBottom: activeTab === 'catalog' ? '2.5px solid var(--teal)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            🎓 Catálogo Completo
          </button>
          <button 
            className={`tab-btn ${activeTab === 'my-courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-courses')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.92rem',
              fontWeight: activeTab === 'my-courses' ? '700' : '500',
              color: activeTab === 'my-courses' ? 'var(--teal)' : 'var(--ink-muted)',
              cursor: 'pointer',
              padding: '0.4rem 0.8rem',
              borderBottom: activeTab === 'my-courses' ? '2.5px solid var(--teal)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            📚 Cursos Matriculados
          </button>
          <button 
            className={`tab-btn ${activeTab === 'certificates' ? 'active' : ''}`}
            onClick={() => setActiveTab('certificates')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.92rem',
              fontWeight: activeTab === 'certificates' ? '700' : '500',
              color: activeTab === 'certificates' ? 'var(--teal)' : 'var(--ink-muted)',
              cursor: 'pointer',
              padding: '0.4rem 0.8rem',
              borderBottom: activeTab === 'certificates' ? '2.5px solid var(--teal)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            🏅 Meus Certificados
          </button>
        </div>

        {/* RENDERING DIRECT TAB CONTENTS */}
        {activeTab !== 'certificates' ? (
          <div>
            <h2 className="section-title" style={{ marginTop: 0 }}>
              {activeTab === 'catalog' ? 'Explorar Conteúdos' : 'Cursos Em Andamento'}
              <span className="section-subtitle-counter">
                {filteredItems.length} listados
              </span>
            </h2>

            {filteredItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--white)', borderRadius: '20px', border: '1px solid var(--cream-dark)' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.8rem' }}>🔍</span>
                <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.15rem', marginBottom: '0.3rem', color: 'var(--ink)', fontWeight: 700 }}>Nenhum curso encontrado</h3>
                <p style={{ color: 'var(--ink-soft)', fontSize: '0.84rem' }}>Não há cursos registrados ou correspondendo à busca atual.</p>
              </div>
            ) : (
              <div className="courses-grid">
                {filteredItems.map((course) => (
                  <div 
                    onClick={() => handleCourseClick(course)} 
                    key={course.id} 
                    className="course-card-interactive"
                    style={{ cursor: 'pointer' }}
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
                        {course.isEnrolled ? (
                          <>
                            <div className="card-progress-bar-container">
                              <div className="card-progress-bar" style={{ width: `${course.progresso}%` }}></div>
                            </div>
                            <div className="card-progress-info">
                              <span>Progresso</span>
                              <span className="card-progress-num">{course.progresso}%</span>
                            </div>
                          </>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderTop: '1px solid var(--cream-dark)', paddingTop: '0.8rem', marginTop: '0.2rem' }}>
                            <span style={{ fontSize: '0.74rem', color: 'var(--ink-muted)' }}>⏱ {course.cargaHoraria}h totais</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--teal)', fontWeight: 700 }}>+ Detalhes</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* TAB 3: CERTIFICADOS GRID */
          <div>
            <h2 className="section-title" style={{ marginTop: 0 }}>
              Meus Certificados Emitidos
              <span className="section-subtitle-counter">
                {certificates.length} conquistados
              </span>
            </h2>

            {certificates.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--white)', borderRadius: '20px', border: '1px solid var(--cream-dark)' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.8rem' }}>🏅</span>
                <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.15rem', marginBottom: '0.3rem', color: 'var(--ink)', fontWeight: 700 }}>Nenhum certificado emitido</h3>
                <p style={{ color: 'var(--ink-soft)', fontSize: '0.84rem' }}>Ao concluir 100% das aulas de um curso matriculado, seu certificado aparecerá aqui.</p>
              </div>
            ) : (
              <div className="courses-grid">
                {certificates.map((cert) => (
                  <div 
                    key={cert.id} 
                    className="card" 
                    style={{ 
                      padding: '1.8rem', 
                      background: 'linear-gradient(135deg, rgba(253, 243, 219, 0.4) 0%, rgba(255, 255, 255, 0.8) 100%)', 
                      border: '1.5px solid rgba(212, 175, 55, 0.35)', 
                      borderRadius: '16px',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 8px 32px rgba(212,175,55,0.05)'
                    }}
                  >
                    {/* Golden emblem glow background */}
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4.5rem', opacity: 0.08, transform: 'rotate(15deg)' }}>🏅</div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#b8860b', background: 'rgba(218, 165, 32, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '20px', border: '1px solid rgba(218, 165, 32, 0.2)' }}>
                        CONCLUÍDO E ASSINADO
                      </span>
                      <span style={{ fontSize: '1.4rem' }}>🏅</span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.4rem', lineHeight: '1.3' }}>{cert.cursoTitulo}</h3>
                    <p style={{ fontSize: '0.74rem', color: 'var(--ink-soft)', marginBottom: '1rem' }}>Carga Horária: {cert.cargaHoraria} horas</p>
                    
                    <div style={{ borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: '0.8rem', marginTop: '0.8rem' }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--ink-muted)', fontFamily: 'monospace', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        ID: {cert.hash}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>
                          Emitido em {new Date(cert.dataEmissao).toLocaleDateString('pt-BR')}
                        </span>
                        <Link 
                          to={`/validar-certificado/${cert.hash}`} 
                          style={{ fontSize: '0.74rem', color: 'var(--teal)', fontWeight: 700, textDecoration: 'none' }}
                        >
                          Validar Selo →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL DE DETALHES E MATRÍCULA NO CURSO */}
      {showDetailsModal && selectedCourse && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px', borderRadius: '20px', padding: '1.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <span className="card-category-badge" style={{ position: 'static' }}>{selectedCourse.categoria}</span>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.5rem', lineHeight: '1.3' }}>
              {selectedCourse.titulo}
            </h2>
            
            <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', marginBottom: '1rem' }}>
              Instrutor: <strong style={{ color: 'var(--ink)' }}>{selectedCourse.instrutor}</strong> · ⏱ Carga Horária: <strong style={{ color: 'var(--ink)' }}>{selectedCourse.cargaHoraria} horas</strong>
            </p>

            <div style={{ padding: '1rem', background: 'var(--cream-light)', borderRadius: '12px', border: '1px solid var(--cream-dark)', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--ink-muted)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase' }}>O que você vai aprender</span>
              <p style={{ fontSize: '0.84rem', color: 'var(--ink)', lineHeight: '1.5' }}>{selectedCourse.descricaoCurta}</p>
            </div>

            <div style={{ borderTop: '1px solid var(--cream-dark)', paddingTop: '1.2rem', display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                className="btn-action secondary" 
                onClick={() => setShowDetailsModal(false)}
                style={{ padding: '0.6rem 1.2rem', borderRadius: '10px' }}
                disabled={isEnrolling}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn-action primary" 
                onClick={handleEnrollSubmit}
                style={{ padding: '0.6rem 1.4rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                disabled={isEnrolling}
              >
                {isEnrolling ? (
                  <>Efetuando Matrícula...</>
                ) : (
                  <>🚀 Quero me Matricular!</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      <div className={`toast ${showToast ? 'show' : ''}`}>{toastMsg}</div>
    </div>
  )
}

export default DashboardPage
