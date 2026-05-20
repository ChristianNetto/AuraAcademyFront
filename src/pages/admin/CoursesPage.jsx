import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader'
import StatCard from '../../components/StatCard'
import { cursoService } from '../../services/api'

function CoursesPage() {
  const triggerToast = useOutletContext()

  // Lista padrão fictícia (fallback se o backend local não estiver rodando)
  const defaultCourses = [
    { id: 1, name: 'UX Design Avançado', category: 'Design · 6h de conteúdo', instructor: 'Fernanda Lima', students: '3.240', rating: '4,9', modules: 14, status: 'Publicado', rawStatus: 'publicado', thumb: '📐', bg: '#e8f5f0' },
    { id: 2, name: 'APIs com Spring Boot', category: 'Back-end · 18h de conteúdo', instructor: 'Carlos Nunes', students: '2.980', rating: '4,8', modules: 22, status: 'Publicado', rawStatus: 'publicado', thumb: '⚙️', bg: '#fef3e2' },
    { id: 3, name: 'Gestão Ágil de Projetos', category: 'Gestão · 9h de conteúdo', instructor: 'Renata Alves', students: '2.541', rating: '4,7', modules: 8, status: 'Publicado', rawStatus: 'publicado', thumb: '🎯', bg: '#f0eeff' },
    { id: 4, name: 'Python para Dados', category: 'Data Science · 22h de conteúdo', instructor: 'Lucas Braga', students: '2.310', rating: '4,9', modules: 18, status: 'Publicado', rawStatus: 'publicado', thumb: '🐍', bg: '#fde8e8' },
    { id: 5, name: 'React Native Completo', category: 'Mobile · 28h de conteúdo', instructor: 'Marcos Vieira', students: '1.875', rating: '4,6', modules: 20, status: 'Publicado', rawStatus: 'publicado', thumb: '📱', bg: '#e8f0fe' },
    { id: 6, name: 'IA Generativa na Prática', category: 'IA · Em produção', instructor: 'Dra. Sofia Ramos', students: '—', rating: '—', modules: 12, status: 'Rascunho', rawStatus: 'rascunho', thumb: '🤖', bg: '#f5f5f5' },
    { id: 7, name: 'AWS para Iniciantes', category: 'Cloud · Em produção', instructor: 'Bruno Castillo', students: '—', rating: '—', modules: 15, status: 'Rascunho', rawStatus: 'rascunho', thumb: '☁️', bg: '#f5f5f5' },
  ]

  const [courses, setCourses] = useState(defaultCourses)
  const [loading, setLoading] = useState(false)
  const [usingMockData, setUsingMockData] = useState(true)

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('todos')

  // Modal de criação states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newLevel, setNewLevel] = useState('INICIANTE')
  const [newHours, setNewHours] = useState('10')
  const [newThumb, setNewThumb] = useState('🎓')

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const data = await cursoService.listar({
        keyword: searchQuery || undefined,
        nivel: activeFilter !== 'todos' ? activeFilter.toUpperCase() : undefined
      })
      if (data && data.content) {
        if (data.content.length > 0) {
          const mapped = data.content.map(c => ({
            id: c.id,
            name: c.titulo,
            category: `${c.categoria || 'Geral'} · ${c.cargaHorariaMinutos ? Math.round(c.cargaHorariaMinutos / 60) : 0}h de conteúdo`,
            instructor: c.instrutorNome || 'Instrutor',
            students: '0',
            rating: '—',
            modules: 0,
            status: c.status === 'PUBLICADO' ? 'Publicado' : 'Rascunho',
            rawStatus: c.status.toLowerCase(),
            thumb: c.thumbUrl || '🎓',
            bg: c.status === 'PUBLICADO' ? '#e8f5f0' : '#f5f5f5'
          }))
          setCourses(mapped)
        } else {
          setCourses([])
        }
        setUsingMockData(false)
      }
    } catch (err) {
      console.warn("Backend não conectado na porta 8080. Usando dados mockados como fallback.", err)
      setUsingMockData(true)
      // Aplica os filtros locais aos dados de fallback
      const filteredMock = defaultCourses.filter(course => {
        const q = searchQuery.toLowerCase()
        const matchesSearch = course.name.toLowerCase().includes(q) || 
                              course.category.toLowerCase().includes(q) || 
                              course.instructor.toLowerCase().includes(q)
        
        const matchesFilter = activeFilter === 'todos' || course.rawStatus === activeFilter

        return matchesSearch && matchesFilter
      })
      setCourses(filteredMock)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [searchQuery, activeFilter])

  // Derive filtered list
  const filteredCourses = usingMockData 
    ? courses 
    : courses.filter(course => {
        const q = searchQuery.toLowerCase()
        return course.name.toLowerCase().includes(q) || 
               course.category.toLowerCase().includes(q) || 
               course.instructor.toLowerCase().includes(q)
      })

  // Action slots for header
  const headerActions = (
    <>
      <button className="btn-action secondary" onClick={() => triggerToast(usingMockData ? 'Recurso simulado localmente' : 'Exportar CSV — em desenvolvimento')}>
        ↓ Exportar
      </button>
      <button className="btn-action primary" onClick={() => setShowCreateModal(true)}>
        + Novo Curso
      </button>
    </>
  )

  const handleAction = async (type, course) => {
    if (type === 'delete') {
      if (usingMockData) {
        setCourses(courses.filter(c => c.id !== course.id))
        triggerToast(`Curso "${course.name}" removido localmente.`)
        return
      }
      try {
        await cursoService.excluir(course.id)
        triggerToast(`Curso "${course.name}" excluído com sucesso!`)
        fetchCourses()
      } catch (err) {
        triggerToast(err.response?.data?.message || 'Apenas o dono instrutor pode excluir este curso.')
      }
    } else if (type === 'publicar') {
      if (usingMockData) {
        setCourses(courses.map(c => c.id === course.id ? { ...c, status: 'Publicado', rawStatus: 'publicado', bg: '#e8f5f0' } : c))
        triggerToast(`Curso "${course.name}" publicado localmente!`)
        return
      }
      try {
        await cursoService.publicar(course.id)
        triggerToast(`Curso "${course.name}" publicado com sucesso!`)
        fetchCourses()
      } catch (err) {
        triggerToast(err.response?.data?.message || 'Curso precisa ter pelo menos um módulo para publicar.')
      }
    } else {
      triggerToast(`${type} "${course.name}"`)
    }
  }

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) {
      triggerToast('O título é obrigatório!')
      return
    }

    const payload = {
      titulo: newTitle,
      descricao: newDesc,
      categoria: newCategory || 'Desenvolvimento',
      nivel: newLevel,
      thumbUrl: newThumb,
      cargaHorariaMinutos: parseInt(newHours || '10') * 60
    }

    try {
      if (usingMockData) {
        const mockNew = {
          id: Date.now(),
          name: newTitle,
          category: `${payload.categoria} · ${newHours}h de conteúdo`,
          instructor: 'Você (Instrutor)',
          students: '0',
          rating: '—',
          modules: 0,
          status: 'Rascunho',
          rawStatus: 'rascunho',
          thumb: newThumb,
          bg: '#f5f5f5'
        }
        setCourses([mockNew, ...courses])
        triggerToast(`Curso "${newTitle}" criado localmente!`)
      } else {
        await cursoService.criar(payload)
        triggerToast(`Curso "${newTitle}" criado com sucesso!`)
        fetchCourses()
      }
      setShowCreateModal(false)
      // Reset form
      setNewTitle('')
      setNewDesc('')
      setNewCategory('')
      setNewLevel('INICIANTE')
      setNewHours('10')
      setNewThumb('🎓')
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Erro ao criar curso no backend (verifique login e permissões).')
    }
  }

  return (
    <>
      <AdminHeader 
        title="Cursos" 
        subtitle={
          usingMockData 
            ? "Catálogo administrativo (Modo Simulado - Backend desconectado)"
            : "Gerencie o catálogo completo de cursos integrado ao backend."
        }
        actions={headerActions}
        onShowToast={triggerToast}
      />

      <div className="page-content">
        {/* STATS */}
        <div className="stats-grid">
          <StatCard icon="🎓" iconColor="teal" value={usingMockData ? "384" : filteredCourses.length.toString()} label="Total de Cursos" />
          <StatCard change="↑ 3" icon="✅" iconColor="gold" value={usingMockData ? "361" : filteredCourses.filter(c => c.rawStatus === 'publicado').length.toString()} label="Publicados" />
          <StatCard icon="📝" iconColor="accent" value={usingMockData ? "23" : filteredCourses.filter(c => c.rawStatus === 'rascunho').length.toString()} label="Em Rascunho" />
          <StatCard change="↑ 4,9" icon="⭐" iconColor="red" value="4,8" label="Avaliação Média" />
        </div>

        {/* TABLE CARD */}
        <div className="card" style={{ animationDelay: '0.3s' }}>
          <div className="card-header">
            <span className="card-title">Catálogo de Cursos</span>
            <span style={{ fontSize: '0.76rem', color: 'var(--ink-muted)' }}>
              {filteredCourses.length} cursos exibidos {usingMockData && "⚠️ (Dados locais simulados)"}
            </span>
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
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--teal)' }}>
                      Carregando cursos...
                    </td>
                  </tr>
                ) : filteredCourses.length > 0 ? (
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
                          
                          {course.rawStatus === 'rascunho' ? (
                            <button className="icon-btn" onClick={() => handleAction('publicar', course)}>🚀</button>
                          ) : (
                            <button className="icon-btn" onClick={() => handleAction('Visualizar', course)}>👁</button>
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
      </div>

      {/* MODAL DE CRIAÇÃO DE CURSO */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Criar Novo Curso</span>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleCreateCourse} className="modal-form">
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <div style={{ width: '80px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: '0.35rem' }}>Ícone</label>
                  <select 
                    value={newThumb}
                    onChange={(e) => setNewThumb(e.target.value)}
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
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
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
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="modal-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: '0.35rem' }}>Nível *</label>
                  <select 
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
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
                    value={newHours}
                    onChange={(e) => setNewHours(e.target.value)}
                    className="modal-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: '0.35rem' }}>Descrição</label>
                <textarea 
                  placeholder="Descreva brevemente o que o aluno aprenderá..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="modal-input"
                  rows="3"
                  style={{ resize: 'none', height: '80px', fontFamily: 'inherit' }}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-action secondary" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                <button type="submit" className="btn-action primary">Salvar Curso</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default CoursesPage
