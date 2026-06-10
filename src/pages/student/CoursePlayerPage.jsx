import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { mockCourses } from '../../data/mockCourses'
import { cursoService, alunoService, matriculaService } from '../../services/api'
import '../../styles/styleStudent.css'

function extractYouTubeId(url) {
  if (!url) return null
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/))([\w-]{11})/
  )
  return match ? match[1] : null
}

function CoursePlayerPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  // Base detailed state
  const [courseDetails, setCourseDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [matriculaId, setMatriculaId] = useState(null)
  const [concludedAulas, setConcludedAulas] = useState([])
  const [progressPercent, setProgressPercent] = useState(0)

  // Player configurations
  const [activeLesson, setActiveLesson] = useState(null)
  const [activeModule, setActiveModule] = useState(null)
  const [expandedModules, setExpandedModules] = useState([])
  const [activeTab, setActiveTab] = useState('description')
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoSpeed, setVideoSpeed] = useState('1.0x')
  const [volume, setVolume] = useState(80)
  const [toastMsg, setToastMsg] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [certificateHash, setCertificateHash] = useState('gold-cert-hash-100')

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setShowToast(true)
  }

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  // Initial load
  useEffect(() => {
    async function loadCourseContent() {
      let detailed = null
      
      // 1. Fetch details
      try {
        detailed = await cursoService.buscarPorId(courseId)
      } catch (err) {
        console.warn("Backend offline para obter detalhes, usando dados simulados de mock.")
        detailed = mockCourses.find(c => c.id === courseId)
      }

      if (!detailed) {
        triggerToast("Curso não encontrado!")
        navigate('/aluno/dashboard')
        return
      }

      setCourseDetails(detailed)
      
      // Setup initial active items
      if (detailed.modulos && detailed.modulos.length > 0) {
        setActiveModule(detailed.modulos[0])
        setExpandedModules([detailed.modulos[0].id])
        if (detailed.modulos[0].aulas && detailed.modulos[0].aulas.length > 0) {
          setActiveLesson(detailed.modulos[0].aulas[0])
        }
      }

      // 2. Fetch progress and matriculaId
      const localConcludedSaved = localStorage.getItem('concluded_aulas_' + courseId)
      let initialConcluded = localConcludedSaved ? JSON.parse(localConcludedSaved) : []
      
      try {
        // /api/aluno/matriculas retorna uma lista plana de DashboardItemResponse
        // ({ matriculaId, cursoId, ... }). Comparação solta porque courseId vem
        // da URL como string e cursoId é número.
        const enrolledList = await alunoService.getMatriculas()
        if (Array.isArray(enrolledList)) {
          const match = enrolledList.find(m => String(m.cursoId) === String(courseId))
          if (match) {
            setMatriculaId(match.matriculaId)
          }
        }
      } catch (e) {
        console.warn("Backend offline para obter progresso, usando dados locais.")
      }

      setConcludedAulas(initialConcluded)
      
      // Calculate progress percent
      const totalAulasCount = detailed.modulos ? detailed.modulos.reduce((acc, m) => acc + (m.aulas ? m.aulas.length : 0), 0) : 0
      const percent = totalAulasCount > 0 ? Math.round((initialConcluded.length / totalAulasCount) * 100) : 0
      setProgressPercent(percent)

      setIsLoading(false)
    }

    loadCourseContent()
  }, [courseId, navigate])

  if (isLoading || !courseDetails) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem', background: '#faf9f6' }}>
        <div className="loading-spinner" style={{ width: '50px', height: '50px', border: '3px solid var(--cream-dark)', borderTopColor: 'var(--teal)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <span style={{ fontSize: '0.9rem', color: 'var(--ink-muted)' }}>Inicializando player interativo...</span>
      </div>
    )
  }

  // Accordion toggle handler
  const toggleModule = (moduleId) => {
    if (expandedModules.includes(moduleId)) {
      setExpandedModules(expandedModules.filter(id => id !== moduleId))
    } else {
      setExpandedModules([...expandedModules, moduleId])
    }
  }

  // Lesson switch handler
  const handleLessonClick = (lesson, module) => {
    setActiveLesson(lesson)
    setActiveModule(module)
    setIsPlaying(true)
    triggerToast(`Iniciando: ${lesson.titulo}`)
  }

  // Toggle lesson complete checkmark
  const handleToggleConclude = async (aulaId) => {
    const isAlreadyConcluded = concludedAulas.includes(aulaId)
    let nextConcluded = []

    if (isAlreadyConcluded) {
      nextConcluded = concludedAulas.filter(id => id !== aulaId)
    } else {
      nextConcluded = [...concludedAulas, aulaId]
    }

    setConcludedAulas(nextConcluded)
    localStorage.setItem('concluded_aulas_' + courseId, JSON.stringify(nextConcluded))

    const totalAulasCount = courseDetails.modulos.reduce((acc, m) => acc + (m.aulas ? m.aulas.length : 0), 0)
    const nextPercent = totalAulasCount > 0 ? Math.round((nextConcluded.length / totalAulasCount) * 100) : 0
    setProgressPercent(nextPercent)

    const justCompleted = nextPercent === 100 && !isAlreadyConcluded

    if (matriculaId) {
      try {
        const response = await matriculaService.concluirAula(matriculaId, aulaId)
        triggerToast(isAlreadyConcluded ? 'Aula marcada como pendente' : 'Aula marcada como concluída! ✓')

        if (justCompleted) {
          if (response?.urlCertificado) {
            const hash = response.urlCertificado.split('/').pop()
            setCertificateHash(hash)
          } else {
            setCertificateHash('da' + Math.floor(Math.random() * 10000000) + 'ea')
          }
          setShowCelebration(true)
          triggerToast('Excelente trabalho! Você concluiu 100% do curso! 🏆')
        }
      } catch (err) {
        console.warn("Erro ao atualizar conclusão no backend, mantido em cache local.")
        if (justCompleted) {
          setCertificateHash('da' + Math.floor(Math.random() * 10000000) + 'ea')
          setShowCelebration(true)
          triggerToast('Excelente trabalho! Você concluiu 100% do curso! 🏆')
        }
      }
    } else {
      triggerToast(isAlreadyConcluded ? 'Aula marcada como pendente (Simulado)' : 'Aula concluída (Simulado)! ✓')
      if (justCompleted) {
        setCertificateHash('da' + Math.floor(Math.random() * 10000000) + 'ea')
        setShowCelebration(true)
        triggerToast('Excelente trabalho! Você concluiu 100% do curso! 🏆')
      }
    }
  }

  return (
    <div className="player-page">
      {/* ── HEADER SIMPLIFICADO ── */}
      <header className="player-header">
        <Link to="/aluno/dashboard" className="student-logo">
          Aura<span>Academy</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)' }}>Progresso Geral</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--teal)' }}>{progressPercent}% Concluído</span>
          </div>

          <Link to="/aluno/dashboard" className="back-btn-header">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Sair do Player
          </Link>
        </div>
      </header>

      {/* ── LAYOUT DO PLAYER E SIDEBAR ── */}
      <div className="player-layout">
        
        {/* PLAYER PRINCIPAL (Esquerda/Centro) */}
        <main className="player-main">
          
          {/* Responsive Embedded Player */}
          <div className="video-wrapper">
            {(() => {
              const ytId = extractYouTubeId(activeLesson?.videoUrl) || activeLesson?.videoId
              const embedSrc = ytId
                ? `https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0`
                : activeLesson?.videoUrl || null

              return embedSrc ? (
                <iframe
                  key={embedSrc}
                  src={embedSrc}
                  title={activeLesson?.titulo}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', borderRadius: '12px' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--cream-dark)', background: '#222' }}>
                  <span style={{ fontSize: '3rem' }}>🎥</span>
                  <span style={{ fontSize: '0.85rem' }}>Aula teórica: conteúdo sem vídeo anexado</span>
                </div>
              )
            })()}
            <div className="video-watermark">AuraAcademy Premium</div>
          </div>

          {/* Lesson Info Meta Card */}
          <div className="lesson-meta-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="card-category-badge" style={{ position: 'static' }}>{courseDetails.categoria}</span>
              {progressPercent === 100 && (
                <button 
                  className="btn-action primary" 
                  onClick={() => setShowCelebration(true)}
                  style={{ padding: '0.35rem 0.8rem', fontSize: '0.74rem', background: 'var(--gold)', color: 'var(--ink)' }}
                >
                  🏅 Ver Certificado
                </button>
              )}
            </div>
            
            <h1 className="lesson-title-main" style={{ marginTop: '0.4rem' }}>{activeLesson?.titulo}</h1>
            
            {/* Tabs Bar */}
            <div className="tabs-navigation">
              <button 
                className={`tab-nav-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Descrição do Módulo
              </button>
              <button 
                className={`tab-nav-btn ${activeTab === 'resources' ? 'active' : ''}`}
                onClick={() => setActiveTab('resources')}
              >
                Materiais Extras
              </button>
            </div>

            {/* Tab Body */}
            <div className="tab-body">
              {activeTab === 'description' ? (
                <div>
                  <p>{activeModule?.descricao || 'Neste módulo prático estruturaremos os conceitos fundamentais para a criação e manutenção de produtos modernos.'}</p>
                  <p>Essas aulas foram programadas com foco estrito em aplicações de produção, com boas práticas de estruturação de software de alta performance.</p>
                  
                  <div className="instructor-brief">
                    <div className="instructor-avatar-sm" style={{ background: 'var(--teal)', color: 'var(--white)', fontWeight: 'bold' }}>
                      {courseDetails.instrutorNome ? courseDetails.instrutorNome.split(' ').map(n => n[0]).join('') : 'IA'}
                    </div>
                    <div className="instructor-meta-info">
                      <div className="instructor-meta-name">Instrutor: {courseDetails.instrutorNome || 'Especialista Aura'}</div>
                      <div className="instructor-meta-role">Mentor de Frontend Sênior AuraAcademy</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <p>Aproveite os recursos práticos abaixo para alavancar seu aprendizado e fixar os conceitos abordados.</p>
                  <a href="#" onClick={(e) => { e.preventDefault(); triggerToast('Download iniciado do projeto base!') }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--teal)', textDecoration: 'none', fontWeight: 600 }}>
                    📥 template-projeto-completo.zip <span style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>(14.2 MB)</span>
                  </a>
                  <a href="#" onClick={(e) => { e.preventDefault(); triggerToast('Link externo aberto') }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--teal)', textDecoration: 'none', fontWeight: 600 }}>
                    🔗 Link para repositório oficial do Github
                  </a>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* SIDEBAR DE CONTEÚDO (Direita) */}
        <aside className="player-sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">Grade do Curso</h2>
            <div style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', marginTop: '0.25rem', fontWeight: 500, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {courseDetails.titulo}
            </div>
          </div>

          <div className="sidebar-scrollable">
            {courseDetails.modulos && courseDetails.modulos.map((module, mIdx) => {
              const isExpanded = expandedModules.includes(module.id)
              
              return (
                <div 
                  key={module.id} 
                  className={`accordion-item ${isExpanded ? 'expanded' : ''}`}
                >
                  {/* Module Header accordion trigger */}
                  <button 
                    className="accordion-trigger"
                    onClick={() => toggleModule(module.id)}
                    aria-expanded={isExpanded}
                  >
                    <span className="accordion-trigger-text">
                      Módulo {mIdx + 1}: {module.titulo}
                    </span>
                    <svg 
                      className="accordion-icon" 
                      width="16" 
                      height="16" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Lessons List */}
                  {isExpanded && (
                    <div className="accordion-content">
                      <ul className="lesson-list">
                        {module.aulas && module.aulas.map((lesson) => {
                          const isActive = activeLesson?.id === lesson.id
                          const isConcluded = concludedAulas.includes(lesson.id)
                          
                          return (
                            <li key={lesson.id}>
                              <div 
                                className={`lesson-item-btn ${isActive ? 'active' : ''}`}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '0.5rem' }}
                              >
                                <div 
                                  onClick={() => handleLessonClick(lesson, module)}
                                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, cursor: 'pointer', overflow: 'hidden' }}
                                >
                                  <span className="lesson-icon-state" style={{ flexShrink: 0 }}>
                                    {isActive ? (
                                      <svg width="14" height="14" fill="var(--teal)" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                                      </svg>
                                    ) : (
                                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    )}
                                  </span>
                                  <span 
                                    className="lesson-title-sidebar" 
                                    title={lesson.titulo}
                                    style={{ 
                                      textDecoration: isConcluded ? 'line-through' : 'none', 
                                      color: isConcluded ? 'var(--ink-muted)' : 'inherit',
                                      fontSize: '0.78rem',
                                      fontWeight: isActive ? 700 : 500
                                    }}
                                  >
                                    {lesson.titulo}
                                  </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                                  <span className="lesson-duration" style={{ fontSize: '0.68rem', color: 'var(--ink-muted)' }}>
                                    {lesson.duracao || lesson.duracaoMinutos + 'm'}
                                  </span>
                                  
                                  {/* Checkbox toggler */}
                                  <div 
                                    onClick={() => handleToggleConclude(lesson.id)}
                                    style={{
                                      width: '15px',
                                      height: '15px',
                                      borderRadius: '4px',
                                      border: '1.5px solid ' + (isConcluded ? 'var(--teal)' : 'var(--cream-dark)'),
                                      background: isConcluded ? 'var(--teal)' : 'rgba(255,255,255,0.4)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s'
                                    }}
                                    title={isConcluded ? "Concluída! Clique para reabrir" : "Marcar como concluída"}
                                  >
                                    {isConcluded && (
                                      <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </aside>
      </div>

      {/* ── ULTRA PREMIUM CELEBRATION MODAL OVERLAY ── */}
      {showCelebration && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(10, 15, 20, 0.92)', backdropFilter: 'blur(12px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, animation: 'fadeIn 0.5s ease-out', color: 'var(--white)'
        }}>
          {/* Glowing particle effect rings */}
          <div style={{
            position: 'absolute', width: '220px', height: '220px', 
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, rgba(212,175,55,0) 70%)',
            animation: 'pulse 2s infinite', pointerEvents: 'none'
          }}></div>

          <div style={{ fontSize: '5rem', marginBottom: '1.2rem', filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.5))', animation: 'bounce 1.5s infinite' }}>🏅</div>
          
          <h1 style={{ 
            fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '2.2rem', 
            color: 'gold', textAlign: 'center', marginBottom: '0.8rem', letterSpacing: '-0.5px'
          }}>
            Excelência Conquistada!
          </h1>
          
          <p style={{ 
            fontSize: '0.94rem', color: 'rgba(255,255,255,0.85)', textAlign: 'center', 
            maxWidth: '450px', marginBottom: '2.2rem', lineHeight: '1.6', padding: '0 1rem'
          }}>
            Parabéns! Você concluiu com sucesso todas as etapas de <strong>{courseDetails.titulo}</strong>. Seu certificado oficial AuraAcademy assinado foi emitido com selo de autenticidade no blockchain.
          </p>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              type="button"
              className="btn-action secondary" 
              onClick={() => setShowCelebration(false)}
              style={{ padding: '0.7rem 1.4rem', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', color: 'var(--white)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Revisar Grade
            </button>
            <Link 
              to={`/validar-certificado/${certificateHash}`}
              className="btn-action primary"
              style={{ 
                padding: '0.7rem 1.6rem', borderRadius: '10px', background: 'gold', 
                color: '#111', border: 'none', fontWeight: 700, textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(212,175,55,0.3)'
              }}
            >
              🏅 Acessar Certificado
            </Link>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      <div className={`toast ${showToast ? 'show' : ''}`}>{toastMsg}</div>
    </div>
  )
}

export default CoursePlayerPage
