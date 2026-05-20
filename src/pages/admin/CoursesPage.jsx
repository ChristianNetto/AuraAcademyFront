import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader'
import StatCard from '../../components/StatCard'

function CoursesPage() {
  const triggerToast = useOutletContext()

  // Initial course list based on original HTML courses
  const [courses, setCourses] = useState([
    { id: 1, name: 'UX Design Avançado', category: 'Design · 6h de conteúdo', instructor: 'Fernanda Lima', students: '3.240', rating: '4,9', modules: 14, status: 'Publicado', rawStatus: 'publicado', thumb: '📐', bg: '#e8f5f0' },
    { id: 2, name: 'APIs com Spring Boot', category: 'Back-end · 18h de conteúdo', instructor: 'Carlos Nunes', students: '2.980', rating: '4,8', modules: 22, status: 'Publicado', rawStatus: 'publicado', thumb: '⚙️', bg: '#fef3e2' },
    { id: 3, name: 'Gestão Ágil de Projetos', category: 'Gestão · 9h de conteúdo', instructor: 'Renata Alves', students: '2.541', rating: '4,7', modules: 8, status: 'Publicado', rawStatus: 'publicado', thumb: '🎯', bg: '#f0eeff' },
    { id: 4, name: 'Python para Dados', category: 'Data Science · 22h de conteúdo', instructor: 'Lucas Braga', students: '2.310', rating: '4,9', modules: 18, status: 'Publicado', rawStatus: 'publicado', thumb: '🐍', bg: '#fde8e8' },
    { id: 5, name: 'React Native Completo', category: 'Mobile · 28h de conteúdo', instructor: 'Marcos Vieira', students: '1.875', rating: '4,6', modules: 20, status: 'Publicado', rawStatus: 'publicado', thumb: '📱', bg: '#e8f0fe' },
    { id: 6, name: 'IA Generativa na Prática', category: 'IA · Em produção', instructor: 'Dra. Sofia Ramos', students: '—', rating: '—', modules: 12, status: 'Rascunho', rawStatus: 'rascunho', thumb: '🤖', bg: '#f5f5f5' },
    { id: 7, name: 'AWS para Iniciantes', category: 'Cloud · Em produção', instructor: 'Bruno Castillo', students: '—', rating: '—', modules: 15, status: 'Rascunho', rawStatus: 'rascunho', thumb: '☁️', bg: '#f5f5f5' },
  ])

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('todos')

  // Derive filtered list
  const filteredCourses = courses.filter(course => {
    const q = searchQuery.toLowerCase()
    const matchesSearch = course.name.toLowerCase().includes(q) || 
                          course.category.toLowerCase().includes(q) || 
                          course.instructor.toLowerCase().includes(q)
    
    const matchesFilter = activeFilter === 'todos' || course.rawStatus === activeFilter

    return matchesSearch && matchesFilter
  })

  // Action slots for header
  const headerActions = (
    <>
      <button className="btn-action secondary" onClick={() => triggerToast('Exportar CSV — em desenvolvimento')}>
        ↓ Exportar
      </button>
      <button className="btn-action primary" onClick={() => triggerToast('Formulário de novo curso — em desenvolvimento')}>
        + Novo Curso
      </button>
    </>
  )

  const handleAction = (type, course) => {
    if (type === 'delete') {
      triggerToast('Ação irreversível — confirme antes de excluir')
    } else if (type === 'publicar') {
      // Reatively change status of the course as a cool React bonus!
      setCourses(courses.map(c => c.id === course.id ? { ...c, status: 'Publicado', rawStatus: 'publicado' } : c))
      triggerToast(`Curso "${course.name}" publicado com sucesso!`)
    } else {
      triggerToast(`${type} ${course.name}`)
    }
  }

  return (
    <>
      <AdminHeader 
        title="Cursos" 
        subtitle="Gerencie o catálogo completo de cursos da plataforma." 
        actions={headerActions}
        onShowToast={triggerToast}
      />

      <div className="page-content">
        {/* STATS */}
        <div className="stats-grid">
          <StatCard icon="🎓" iconColor="teal" value="384" label="Total de Cursos" />
          <StatCard change="↑ 3" icon="✅" iconColor="gold" value="361" label="Publicados" />
          <StatCard icon="📝" iconColor="accent" value="23" label="Em Rascunho" />
          <StatCard change="↑ 4,9" icon="⭐" iconColor="red" value="4,8" label="Avaliação Média" />
        </div>

        {/* TABLE CARD */}
        <div className="card" style={{ animationDelay: '0.3s' }}>
          <div className="card-header">
            <span className="card-title">Catálogo de Cursos</span>
            <span style={{ fontSize: '0.76rem', color: 'var(--ink-muted)' }}>
              {filteredCourses.length} cursos exibidos
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
                  placeholder="Buscar por título ou instrutor..." 
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
                              background: course.bg, 
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
                      Nenhum curso encontrado com as configurações atuais.
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
              <button className="page-btn" onClick={() => triggerToast('Ir para página 2')}>2</button>
              <button className="page-btn" onClick={() => triggerToast('Ir para página 3')}>3</button>
              <button className="page-btn">…</button>
              <button className="page-btn" onClick={() => triggerToast('Ir para última página')}>49</button>
              <button className="page-btn" onClick={() => triggerToast('Próxima página')}>›</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CoursesPage
