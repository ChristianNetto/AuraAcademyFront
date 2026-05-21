import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { cursoService } from '../../services/api'

const statusBadge = (status) => {
  const styles = {
    PUBLICADO: { background: '#e8f5f0', color: '#1a7f5a', border: '1px solid #b2dfcf' },
    RASCUNHO:  { background: '#f5f5f5', color: '#888', border: '1px solid #ddd' },
  }
  return (
    <span style={{ ...styles[status], padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
      {status === 'PUBLICADO' ? 'Publicado' : 'Rascunho'}
    </span>
  )
}

export default function InstructorDashboardPage() {
  const navigate = useNavigate()
  const { triggerToast } = useOutletContext()
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadCursos() }, [])

  const loadCursos = async () => {
    try {
      const res = await cursoService.listarMeusCursos({ size: 50, sort: 'criadoEm,desc' })
      setCursos(res.content || res)
    } catch {
      triggerToast('Erro ao carregar cursos.')
    } finally {
      setLoading(false)
    }
  }

  const handlePublicar = async (id, e) => {
    e.stopPropagation()
    try {
      await cursoService.publicar(id)
      triggerToast('Curso publicado com sucesso!')
      loadCursos()
    } catch (err) {
      triggerToast(err.response?.data?.mensagem || 'Erro ao publicar. Verifique se o curso tem módulos.')
    }
  }

  const handleExcluir = async (id, titulo, e) => {
    e.stopPropagation()
    if (!window.confirm(`Excluir o curso "${titulo}"? Esta ação não pode ser desfeita.`)) return
    try {
      await cursoService.excluir(id)
      triggerToast('Curso excluído.')
      loadCursos()
    } catch (err) {
      triggerToast(err.response?.data?.mensagem || 'Erro ao excluir. Arquive o curso antes.')
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <header className="admin-header">
        <div className="header-title">
          <h1>Meus Cursos</h1>
          <p>Gerencie seus cursos, módulos e aulas.</p>
        </div>
        <div className="header-actions">
          <button className="btn-action primary" onClick={() => navigate('/instrutor/cursos/novo')}>
            + Novo Curso
          </button>
        </div>
      </header>

      {loading ? (
        <p style={{ color: '#888', marginTop: '2rem' }}>Carregando cursos...</p>
      ) : cursos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#888' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Você ainda não criou nenhum curso.</p>
          <button className="btn-action primary" onClick={() => navigate('/instrutor/cursos/novo')}>
            Criar meu primeiro curso
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem', marginTop: '1.5rem' }}>
          {cursos.map(curso => (
            <div
              key={curso.id}
              onClick={() => navigate(`/instrutor/cursos/${curso.id}`)}
              style={{
                background: '#fff',
                border: '1px solid #eee',
                borderRadius: '12px',
                padding: '1.4rem',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '2rem' }}>{curso.thumbUrl?.length <= 4 ? curso.thumbUrl : '🎓'}</span>
                {statusBadge(curso.status)}
              </div>

              <h3 style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: 600, color: '#1a1a2e' }}>
                {curso.titulo}
              </h3>
              <p style={{ margin: '0 0 1rem', fontSize: '0.82rem', color: '#888' }}>
                {curso.categoria || 'Sem categoria'} · {curso.nivel}
              </p>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button
                  className="btn-action secondary"
                  style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                  onClick={e => { e.stopPropagation(); navigate(`/instrutor/cursos/${curso.id}`) }}
                >
                  ✏️ Gerenciar
                </button>
                {curso.status === 'RASCUNHO' && (
                  <button
                    className="btn-action primary"
                    style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                    onClick={e => handlePublicar(curso.id, e)}
                  >
                    🚀 Publicar
                  </button>
                )}
                {curso.status === 'RASCUNHO' && (
                  <button
                    style={{ background: 'none', border: '1px solid #ffcccc', color: '#e74c3c', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.8rem' }}
                    onClick={e => handleExcluir(curso.id, curso.titulo, e)}
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}