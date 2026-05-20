import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { mockCourses } from '../../data/mockCourses'
import '../../styles/styleStudent.css'

function CoursePlayerPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  // Find current course
  const course = mockCourses.find(c => c.id === courseId)

  // Redirect if course not found
  useEffect(() => {
    if (!course) {
      navigate('/aluno/dashboard')
    }
  }, [course, navigate])

  if (!course) return null

  // States
  const [activeLesson, setActiveLesson] = useState(course.modulos[0]?.aulas[0] || null)
  const [activeModule, setActiveModule] = useState(course.modulos[0] || null)
  const [expandedModules, setExpandedModules] = useState([course.modulos[0]?.id]) // Default open first module
  const [activeTab, setActiveTab] = useState('description')
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoSpeed, setVideoSpeed] = useState('1.0x')
  const [volume, setVolume] = useState(80)
  const [toastMsg, setToastMsg] = useState('')
  const [showToast, setShowToast] = useState(false)

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
    setIsPlaying(true) // auto-simulate play when switching lessons
    triggerToast(`Iniciando: ${lesson.titulo}`)
  }

  return (
    <div className="player-page">
      {/* ── HEADER SIMPLIFICADO ── */}
      <header className="player-header">
        <Link to="/aluno/dashboard" className="student-logo">
          Aura<span>Academy</span>
        </Link>
        <Link to="/aluno/dashboard" className="back-btn-header">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar ao Catálogo
        </Link>
      </header>

      {/* ── LAYOUT DO PLAYER E SIDEBAR ── */}
      <div className="player-layout">
        {/* PLAYER PRINCIPAL (Esquerda/Centro) */}
        <main className="player-main">
          {/* Visual Video Player Container */}
          <div className="video-wrapper">
            <img 
              src={course.banner || course.thumbnail} 
              alt={activeLesson?.titulo} 
              className="video-backdrop-img" 
            />
            <div className="video-watermark">AuraAcademy Premium</div>
            
            <div className="video-placeholder">
              <button 
                className="video-center-button"
                onClick={() => {
                  setIsPlaying(!isPlaying)
                  triggerToast(isPlaying ? 'Aula pausada' : 'Reproduzindo aula...')
                }}
                aria-label={isPlaying ? 'Pausar aula' : 'Iniciar aula'}
              >
                {isPlaying ? (
                  <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <div className="video-info-overlay">
                <span className="video-duration-badge">{activeLesson?.duracao}</span>
                
                {/* Timeline */}
                <div className="video-timeline" onClick={() => triggerToast('Avanço de vídeo simulado!')}>
                  <div className="video-timeline-filled" style={{ width: isPlaying ? '48%' : '32%' }}></div>
                  <div className="video-timeline-handle" style={{ left: isPlaying ? '48%' : '32%' }}></div>
                </div>

                {/* Controls overlay */}
                <div className="video-controls">
                  <div className="video-controls-left">
                    <button 
                      className="video-ctrl-btn" 
                      onClick={() => setIsPlaying(!isPlaying)}
                      title={isPlaying ? 'Pausar' : 'Reproduzir'}
                    >
                      {isPlaying ? (
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                    <button className="video-ctrl-btn" onClick={() => triggerToast('Avançando 10s')} title="Avançar 10s">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.33-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.33-4z" />
                      </svg>
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button 
                        className="video-ctrl-btn"
                        onClick={() => {
                          const nextVol = volume === 0 ? 80 : 0
                          setVolume(nextVol)
                          triggerToast(nextVol === 0 ? 'Áudio mutado' : 'Áudio ativado')
                        }}
                      >
                        {volume === 0 ? (
                          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                          </svg>
                        )}
                      </button>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>{volume}%</span>
                    </div>
                  </div>

                  <div className="video-controls-right">
                    <button 
                      className="video-ctrl-btn" 
                      onClick={() => {
                        const speeds = ['1.0x', '1.25x', '1.5x', '2.0x']
                        const nextIndex = (speeds.indexOf(videoSpeed) + 1) % speeds.length
                        setVideoSpeed(speeds[nextIndex])
                        triggerToast(`Velocidade: ${speeds[nextIndex]}`)
                      }}
                      style={{ fontSize: '0.75rem', fontWeight: 'bold' }}
                    >
                      {videoSpeed}
                    </button>
                    <button className="video-ctrl-btn" onClick={() => triggerToast('Modo de tela cheia')} title="Tela Cheia">
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                      </svg>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Lesson Info Meta Card */}
          <div className="lesson-meta-card">
            <h1 className="lesson-title-main">{activeLesson?.titulo}</h1>
            
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
                  <p>{activeModule?.descricao}</p>
                  <p>Esse curso foi estruturado com foco em cenários de produção. Ao final das aulas deste módulo, pratique os desafios e projetos práticos propostos.</p>
                  
                  <div className="instructor-brief">
                    <div className="instructor-avatar-sm">
                      {course.instrutor.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="instructor-meta-info">
                      <div className="instructor-meta-name">Instrutor: {course.instrutor}</div>
                      <div className="instructor-meta-role">Especialista Sênior AuraAcademy</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <p>Baixe os arquivos de código-fonte, slides ou resumos preparados para esta aula.</p>
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
            <h2 className="sidebar-title">Conteúdo do Curso</h2>
            <div style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', marginTop: '0.25rem', fontWeight: 500 }}>
              {course.titulo}
            </div>
          </div>

          <div className="sidebar-scrollable">
            {course.modulos.map((module) => {
              const isExpanded = expandedModules.includes(module.id)
              
              return (
                <div 
                  key={module.id} 
                  className={`accordion-item ${isExpanded ? 'expanded' : ''}`}
                >
                  {/* Module Header / Accordion Trigger */}
                  <button 
                    className="accordion-trigger"
                    onClick={() => toggleModule(module.id)}
                    aria-expanded={isExpanded}
                  >
                    <span className="accordion-trigger-text">{module.titulo}</span>
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

                  {/* Module Content / Lessons List */}
                  {isExpanded && (
                    <div className="accordion-content">
                      <ul className="lesson-list">
                        {module.aulas.map((lesson) => {
                          const isActive = activeLesson?.id === lesson.id
                          
                          return (
                            <li key={lesson.id}>
                              <button 
                                className={`lesson-item-btn ${isActive ? 'active' : ''}`}
                                onClick={() => handleLessonClick(lesson, module)}
                              >
                                <div className="lesson-item-left">
                                  <span className="lesson-icon-state">
                                    {isActive ? (
                                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                                      </svg>
                                    ) : (
                                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    )}
                                  </span>
                                  <span className="lesson-title-sidebar" title={lesson.titulo}>
                                    {lesson.titulo}
                                  </span>
                                </div>
                                <span className="lesson-duration">{lesson.duracao}</span>
                              </button>
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

      {/* Toast Alert */}
      <div className={`toast ${showToast ? 'show' : ''}`}>{toastMsg}</div>
    </div>
  )
}

export default CoursePlayerPage
