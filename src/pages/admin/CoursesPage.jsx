import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import StatCard from '../../components/StatCard'
import { cursoService, moduloService, aulaService } from '../../services/api'

function CoursesPage() {
  const { courses, setCourses, triggerToast, openNewCourseModal } = useOutletContext()

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('todos')

  // Content Manager states
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showManager, setShowManager] = useState(false)
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [courseModules, setCourseModules] = useState([])
  const [localModulesState, setLocalModulesState] = useState({})

  // Form states inside Manager
  const [newModuleName, setNewModuleName] = useState('')
  const [selectedModuloForAula, setSelectedModuloForAula] = useState('')
  const [newAulaName, setNewAulaName] = useState('')
  const [newAulaVideo, setNewAulaVideo] = useState('')
  const [newAulaDuration, setNewAulaDuration] = useState('15')

  // Derive filtered list
  const filteredCourses = courses.filter(course => {
    const q = searchQuery.toLowerCase()
    const matchesSearch = course.name.toLowerCase().includes(q) || 
                          course.category.toLowerCase().includes(q) || 
                          course.instructor.toLowerCase().includes(q)
    
    const matchesFilter = activeFilter === 'todos' || course.rawStatus === activeFilter

    return matchesSearch && matchesFilter
  })

  // Dynamic statistics
  const totalCourses = courses.length
  const publishedCourses = courses.filter(c => c.rawStatus === 'publicado').length
  const draftCourses = courses.filter(c => c.rawStatus === 'rascunho').length

  const getMockModules = (courseId) => {
    return [
      {
        id: 'm1_' + courseId,
        titulo: 'Módulo 1: Introdução e Conceitos Chave',
        ordem: 1,
        aulas: [
          { id: 'a1_' + courseId, titulo: 'Apresentação do Curso', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duracaoMinutos: 12, ordem: 1 },
          { id: 'a2_' + courseId, titulo: 'Fundamentos Básicos', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duracaoMinutos: 25, ordem: 2 }
        ]
      },
      {
        id: 'm2_' + courseId,
        titulo: 'Módulo 2: Práticas Recomendadas',
        ordem: 2,
        aulas: [
          { id: 'a3_' + courseId, titulo: 'Estudo de Casos Práticos', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duracaoMinutos: 40, ordem: 1 }
        ]
      }
    ]
  }

  const updateLocalModules = (courseId, updatedModules) => {
    setLocalModulesState(prev => ({
      ...prev,
      [courseId]: updatedModules
    }))
    setCourses(prevCourses => prevCourses.map(c => 
      c.id === courseId ? { ...c, modules: updatedModules.length } : c
    ))
  }

  const handleAction = async (type, course) => {
    if (type === 'delete') {
      try {
        await cursoService.excluir(course.id)
        setCourses(courses.filter(c => c.id !== course.id))
        triggerToast(`Curso "${course.name}" excluído no servidor.`)
      } catch (err) {
        console.warn("Erro ao excluir curso no backend, excluindo localmente.", err)
        setCourses(courses.filter(c => c.id !== course.id))
        triggerToast(`Curso "${course.name}" excluído (Simulado).`)
      }
    } else if (type === 'publicar') {
      try {
        await cursoService.publicar(course.id)
        setCourses(courses.map(c => c.id === course.id ? { ...c, status: 'Publicado', rawStatus: 'publicado', bg: '#e8f5f0' } : c))
        triggerToast(`Curso "${course.name}" publicado com sucesso! 🚀`)
      } catch (err) {
        console.warn("Erro ao publicar curso no backend. Nota: O backend exige pelo menos um módulo cadastrado para publicar.", err)
        setCourses(courses.map(c => c.id === course.id ? { ...c, status: 'Publicado', rawStatus: 'publicado', bg: '#e8f5f0' } : c))
        triggerToast(`Curso "${course.name}" publicado (Simulado - Backend requer >= 1 módulo).`)
      }
    } else if (type === 'Editar') {
      triggerToast(`Edição simulada para o curso "${course.name}"`)
    } else {
      triggerToast(`${type} "${course.name}"`)
    }
  }

  const handleOpenContentManager = async (course) => {
    setSelectedCourse(course)
    setShowManager(true)
    setIsLoadingContent(true)
    try {
      const detailedCourse = await cursoService.buscarPorId(course.id)
      if (detailedCourse && Array.isArray(detailedCourse.modulos)) {
        setCourseModules(detailedCourse.modulos)
      } else {
        const local = localModulesState[course.id] || getMockModules(course.id)
        setCourseModules(local)
      }
    } catch (err) {
      console.warn("Erro ao buscar detalhes no backend, carregando dados simulados.")
      const local = localModulesState[course.id] || getMockModules(course.id)
      setCourseModules(local)
    } finally {
      setIsLoadingContent(false)
    }
  }

  const handleAddModule = async (e) => {
    e.preventDefault()
    if (!newModuleName.trim()) return

    setIsSaving(true)
    const ord = courseModules.length + 1
    try {
      const newMod = await moduloService.criar(selectedCourse.id, { titulo: newModuleName.trim(), ordem: ord })
      const updated = [...courseModules, { ...newMod, aulas: newMod.aulas || [] }]
      setCourseModules(updated)
      updateLocalModules(selectedCourse.id, updated)
      triggerToast(`Módulo "${newModuleName}" criado no servidor!`)
      setNewModuleName('')
    } catch (err) {
      console.warn("Erro ao criar módulo no backend, criando simulado.")
      const newModSim = {
        id: 'm_' + Date.now(),
        titulo: newModuleName.trim(),
        ordem: ord,
        aulas: []
      }
      const updated = [...courseModules, newModSim]
      setCourseModules(updated)
      updateLocalModules(selectedCourse.id, updated)
      triggerToast(`Módulo "${newModuleName}" criado (Simulado)!`)
      setNewModuleName('')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteModule = async (moduloId) => {
    setIsSaving(true)
    try {
      await moduloService.excluir(selectedCourse.id, moduloId)
      const updated = courseModules.filter(m => m.id !== moduloId)
      setCourseModules(updated)
      updateLocalModules(selectedCourse.id, updated)
      triggerToast(`Módulo removido do servidor.`)
    } catch (err) {
      console.warn("Erro ao remover módulo no backend, excluindo localmente.")
      const updated = courseModules.filter(m => m.id !== moduloId)
      setCourseModules(updated)
      updateLocalModules(selectedCourse.id, updated)
      triggerToast(`Módulo removido (Simulado).`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddAula = async (e) => {
    e.preventDefault()
    if (!newAulaName.trim() || !selectedModuloForAula) return

    setIsSaving(true)
    const parentModulo = courseModules.find(m => m.id === selectedModuloForAula)
    const ord = (parentModulo.aulas ? parentModulo.aulas.length : 0) + 1

    const aulaPayload = {
      titulo: newAulaName.trim(),
      videoUrl: newAulaVideo.trim() || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duracaoMinutos: parseInt(newAulaDuration) || 15,
      ordem: ord
    }

    try {
      const newAula = await aulaService.criar(selectedModuloForAula, aulaPayload)
      const updated = courseModules.map(m => {
        if (m.id === selectedModuloForAula) {
          return { ...m, aulas: [...(m.aulas || []), newAula] }
        }
        return m
      })
      setCourseModules(updated)
      updateLocalModules(selectedCourse.id, updated)
      triggerToast(`Aula "${newAulaName}" criada no servidor!`)

      setNewAulaName('')
      setNewAulaVideo('')
      setNewAulaDuration('15')
      setSelectedModuloForAula('')
    } catch (err) {
      console.warn("Erro ao criar aula no backend, criando simulado.")
      const newAulaSim = {
        id: 'a_' + Date.now(),
        titulo: newAulaName.trim(),
        videoUrl: newAulaVideo.trim() || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duracaoMinutos: parseInt(newAulaDuration) || 15,
        ordem: ord
      }
      const updated = courseModules.map(m => {
        if (m.id === selectedModuloForAula) {
          return { ...m, aulas: [...(m.aulas || []), newAulaSim] }
        }
        return m
      })
      setCourseModules(updated)
      updateLocalModules(selectedCourse.id, updated)
      triggerToast(`Aula "${newAulaName}" criada (Simulado)!`)

      setNewAulaName('')
      setNewAulaVideo('')
      setNewAulaDuration('15')
      setSelectedModuloForAula('')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAula = async (moduloId, aulaId) => {
    setIsSaving(true)
    try {
      await aulaService.excluir(moduloId, aulaId)
      const updated = courseModules.map(m => {
        if (m.id === moduloId) {
          return { ...m, aulas: m.aulas.filter(a => a.id !== aulaId) }
        }
        return m
      })
      setCourseModules(updated)
      updateLocalModules(selectedCourse.id, updated)
      triggerToast(`Aula excluída com sucesso do servidor.`)
    } catch (err) {
      console.warn("Erro ao excluir aula no backend, excluindo localmente.")
      const updated = courseModules.map(m => {
        if (m.id === moduloId) {
          return { ...m, aulas: m.aulas.filter(a => a.id !== aulaId) }
        }
        return m
      })
      setCourseModules(updated)
      updateLocalModules(selectedCourse.id, updated)
      triggerToast(`Aula excluída (Simulado).`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="page-content">
      {/* STATS */}
      <div className="stats-grid">
        <StatCard icon="🎓" iconColor="teal" value={totalCourses.toString()} label="Total de Cursos" />
        <StatCard change="↑ Ativos" icon="✅" iconColor="gold" value={publishedCourses.toString()} label="Publicados" />
        <StatCard icon="📝" iconColor="accent" value={draftCourses.toString()} label="Em Rascunho" />
        <StatCard change="↑ 4,9" icon="⭐" iconColor="red" value="4,8" label="Avaliação Média" />
      </div>

      {/* TABLE CARD */}
      <div className="card" style={{ animationDelay: '0.3s' }}>
        <div className="card-header">
          <span className="card-title">Catálogo de Cursos</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--ink-muted)' }}>
              {filteredCourses.length} cursos exibidos
            </span>
            <button className="btn-action primary" onClick={openNewCourseModal} style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem' }}>
              + Novo Curso
            </button>
          </div>
        </div>

        {/* TOOLBAR */}
        <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid var(--cream-dark)' }}>
          <div className="toolbar" style={{ marginBottom: 0 }}>
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Buscar por título..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-btns">
              {['todos', 'publicado', 'rascunho'].map((f) => (
                <button 
                  key={f}
                  className={`filter-btn ${activeFilter === f ? 'active' : ''}`} 
                  onClick={() => setActiveFilter(f)}
                >
                  {f === 'todos' ? 'Todos' : f === 'publicado' ? 'Publicados' : 'Rascunhos'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Curso</th>
                <th>Instrutor</th>
                <th>Alunos</th>
                <th>Avaliação</th>
                <th>Módulos</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map(course => (
                  <tr key={course.id}>
                    <td>
                      <div className="user-cell">
                        <div 
                          className="course-thumb-sm" 
                          style={{ 
                            background: course.bg || '#f5f5f5', 
                            width: '38px', 
                            height: '38px', 
                            borderRadius: '9px', 
                            fontSize: '1.1rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            flexShrink: 0 
                          }}
                        >
                          {course.thumb}
                        </div>
                        <div>
                          <div className="user-name">{course.name}</div>
                          <div className="user-email">{course.category}</div>
                        </div>
                      </div>
                    </td>
                    <td>{course.instructor}</td>
                    <td>{course.students}</td>
                    <td>
                      <div className="rating">
                        {course.rating !== '—' ? (
                          <>
                            <span className="rating-stars">★★★★★</span>
                            <span className="rating-num">{course.rating}</span>
                          </>
                        ) : (
                          <>
                            <span className="rating-stars" style={{ color: 'var(--ink-muted)' }}>★★★★★</span>
                            <span className="rating-num">—</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td>{course.modules}</td>
                    <td>
                      <span className={`badge ${course.rawStatus}`}>{course.status}</span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="icon-btn" onClick={() => handleAction('Editar', course)}>✏️</button>
                        
                        <button className="icon-btn" onClick={() => handleOpenContentManager(course)} title="Gerenciar Módulos e Aulas">📚</button>

                        {course.rawStatus === 'rascunho' ? (
                          <button className="icon-btn" onClick={() => handleAction('publicar', course)} title="Publicar Curso">🚀</button>
                        ) : (
                          <button className="icon-btn" onClick={() => handleAction('Visualizar', course)} title="Visualizar Curso">👁</button>
                        )}

                        <button className="icon-btn del" onClick={() => handleAction('delete', course)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-muted)' }}>
                    Nenhum curso encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="pagination">
          <span className="pagination-info">Mostrando {filteredCourses.length} de {courses.length} cursos</span>
          <div className="pagination-btns">
            <button className="page-btn" onClick={() => triggerToast('Página anterior')}>‹</button>
            <button className="page-btn active">1</button>
            <button className="page-btn" onClick={() => triggerToast('Próxima página')}>›</button>
          </div>
        </div>
      </div>

      {/* MODAL GERENCIADOR DE MÓDULOS E AULAS */}
      {showManager && selectedCourse && (
        <div className="modal-overlay" onClick={() => setShowManager(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px', width: '90%' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{selectedCourse.thumb}</span>
                <div>
                  <span className="modal-title" style={{ fontSize: '1.15rem' }}>Gerenciar Módulos e Aulas</span>
                  <p style={{ fontSize: '0.74rem', color: 'var(--ink-muted)', marginTop: '0.1rem' }}>Curso: {selectedCourse.name}</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowManager(false)}>×</button>
            </div>

            {isLoadingContent ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 0', gap: '1rem' }}>
                <div className="loading-spinner" style={{ width: '40px', height: '40px', border: '3px solid var(--cream-dark)', borderTopColor: 'var(--teal)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <span style={{ fontSize: '0.82rem', color: 'var(--ink-muted)' }}>Carregando conteúdo programático...</span>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '1.5rem', maxHeight: '480px', overflow: 'hidden' }}>
                
                {/* COLUNA ESQUERDA: LISTAGEM DE CONTEÚDO */}
                <div style={{ flex: 1.2, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>Conteúdo Atual ({courseModules.length} módulos)</span>
                  
                  {courseModules.length === 0 ? (
                    <div style={{ padding: '3rem 1rem', border: '1.5px dashed var(--cream-dark)', borderRadius: '12px', textAlign: 'center', color: 'var(--ink-muted)' }}>
                      <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>📭</span>
                      <p style={{ fontSize: '0.78rem' }}>Nenhum módulo cadastrado ainda.</p>
                      <p style={{ fontSize: '0.72rem', marginTop: '0.2rem' }}>Utilize o painel ao lado para criar o primeiro módulo do curso.</p>
                    </div>
                  ) : (
                    courseModules.map((modulo, mIdx) => (
                      <div key={modulo.id} className="card" style={{ border: '1px solid var(--cream-dark)', background: 'rgba(255,255,255,0.4)', padding: '0.8rem 1rem', animationDelay: `${mIdx * 0.05}s` }}>
                        <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', borderBottom: '1px solid var(--cream-dark)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)' }}>
                            Mod {mIdx + 1}: {modulo.titulo}
                          </span>
                          <button 
                            type="button" 
                            className="icon-btn del" 
                            onClick={() => handleDeleteModule(modulo.id)} 
                            title="Remover Módulo"
                            disabled={isSaving}
                            style={{ padding: '0.2rem', fontSize: '0.78rem', background: 'none' }}
                          >
                            🗑
                          </button>
                        </div>

                        {/* LISTA DE AULAS */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '0.5rem' }}>
                          {!modulo.aulas || modulo.aulas.length === 0 ? (
                            <span style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', fontStyle: 'italic', padding: '0.2rem 0' }}>Sem aulas neste módulo.</span>
                          ) : (
                            modulo.aulas.map((aula, aIdx) => (
                              <div key={aula.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.35rem 0.5rem', background: 'var(--white)', borderRadius: '6px', border: '1px solid var(--cream-light)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <span style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>{aIdx + 1}.</span>
                                  <span style={{ fontSize: '0.76rem', color: 'var(--ink)' }}>{aula.titulo}</span>
                                  <span style={{ fontSize: '0.68rem', color: 'var(--teal)', background: '#e8f5f0', padding: '0.05rem 0.3rem', borderRadius: '4px' }}>
                                    ⏱ {aula.duracaoMinutos} min
                                  </span>
                                </div>
                                <button 
                                  type="button" 
                                  className="icon-btn del" 
                                  onClick={() => handleDeleteAula(modulo.id, aula.id)}
                                  disabled={isSaving}
                                  style={{ padding: '0.1rem', fontSize: '0.72rem', background: 'none' }}
                                >
                                  ×
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* COLUNA DIREITA: FORMULÁRIOS DE CRIAÇÃO */}
                <div style={{ flex: 1, borderLeft: '1px solid var(--cream-dark)', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.4rem', overflowY: 'auto' }}>
                  
                  {/* CRIAR MÓDULO */}
                  <form onSubmit={handleAddModule} className="modal-form" style={{ gap: '0.6rem', padding: '0.8rem', background: 'rgba(255,255,255,0.3)', border: '1px solid var(--cream-dark)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink)' }}>+ Novo Módulo</span>
                    <input 
                      type="text" 
                      placeholder="Ex: Introdução ao CSS Avançado"
                      value={newModuleName}
                      onChange={(e) => setNewModuleName(e.target.value)}
                      className="modal-input"
                      style={{ padding: '0.45rem 0.7rem', fontSize: '0.78rem' }}
                      disabled={isSaving}
                      required
                    />
                    <button 
                      type="submit" 
                      className="btn-action primary" 
                      style={{ padding: '0.45rem 0.8rem', fontSize: '0.74rem', alignSelf: 'flex-start' }}
                      disabled={isSaving}
                    >
                      Criar Módulo
                    </button>
                  </form>

                  {/* CRIAR AULA */}
                  <form onSubmit={handleAddAula} className="modal-form" style={{ gap: '0.6rem', padding: '0.8rem', background: 'rgba(255,255,255,0.3)', border: '1px solid var(--cream-dark)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink)' }}>+ Nova Aula</span>
                    
                    <div>
                      <label style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: '0.2rem' }}>Selecionar Módulo *</label>
                      <select
                        value={selectedModuloForAula}
                        onChange={(e) => setSelectedModuloForAula(e.target.value)}
                        className="modal-select"
                        style={{ padding: '0.45rem 0.7rem', fontSize: '0.78rem' }}
                        disabled={isSaving || courseModules.length === 0}
                        required
                      >
                        <option value="">-- Escolha o módulo pai --</option>
                        {courseModules.map((m, idx) => (
                          <option key={m.id} value={m.id}>Módulo {idx + 1}: {m.titulo}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: '0.2rem' }}>Título da Aula *</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Instalação e Configuração"
                        value={newAulaName}
                        onChange={(e) => setNewAulaName(e.target.value)}
                        className="modal-input"
                        style={{ padding: '0.45rem 0.7rem', fontSize: '0.78rem' }}
                        disabled={isSaving || courseModules.length === 0}
                        required
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <div style={{ flex: 1.5 }}>
                        <label style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: '0.2rem' }}>URL do Vídeo</label>
                        <input 
                          type="text" 
                          placeholder="Ex: https://youtube.com/embed/..."
                          value={newAulaVideo}
                          onChange={(e) => setNewAulaVideo(e.target.value)}
                          className="modal-input"
                          style={{ padding: '0.45rem 0.7rem', fontSize: '0.78rem' }}
                          disabled={isSaving || courseModules.length === 0}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: '0.2rem' }}>Duração (min)</label>
                        <input 
                          type="number" 
                          min="1"
                          value={newAulaDuration}
                          onChange={(e) => setNewAulaDuration(e.target.value)}
                          className="modal-input"
                          style={{ padding: '0.45rem 0.7rem', fontSize: '0.78rem' }}
                          disabled={isSaving || courseModules.length === 0}
                          required
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="btn-action primary" 
                      style={{ padding: '0.45rem 0.8rem', fontSize: '0.74rem', alignSelf: 'flex-start' }}
                      disabled={isSaving || courseModules.length === 0}
                    >
                      Criar Aula
                    </button>
                  </form>

                </div>
              </div>
            )}

            <div className="modal-footer" style={{ borderTop: '1px solid var(--cream-dark)', padding: '0.8rem 0 0 0', marginTop: '1rem' }}>
              <button type="button" className="btn-action primary" onClick={() => setShowManager(false)}>Fechar Gerenciador</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CoursesPage
