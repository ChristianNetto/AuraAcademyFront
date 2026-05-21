import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { cursoService, moduloService, aulaService } from '../../services/api'

const inputStyle = {
  width: '100%', padding: '0.7rem 0.9rem', border: '1px solid #ddd',
  borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none',
}
const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#555', marginBottom: '0.3rem' }
const sectionCard = { background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '1.4rem', marginBottom: '1.2rem' }

// ─── Formulário de criação de curso ──────────────────────────────────────────
function CriarCursoForm({ onCreated }) {
  const [form, setForm] = useState({ titulo: '', descricao: '', categoria: '', nivel: 'INICIANTE', cargaHorariaMinutos: 60, thumbUrl: '🎓' })
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.titulo.trim()) return
    setSaving(true)
    try {
      const created = await cursoService.criar({ ...form, cargaHorariaMinutos: Number(form.cargaHorariaMinutos) })
      onCreated(created.id)
    } catch (err) {
      alert(err.response?.data?.mensagem || 'Erro ao criar curso.')
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto', padding: '0 1rem' }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#1a1a2e' }}>Novo Curso</h2>
      <div style={sectionCard}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Ícone</label>
              <select value={form.thumbUrl} onChange={e => set('thumbUrl', e.target.value)} style={{ ...inputStyle }}>
                {['🎓','📐','⚙️','🎯','🐍','📱','🤖','☁️','💻','🎨'].map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Título *</label>
              <input style={inputStyle} value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Ex: Spring Boot para Iniciantes" required />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Descrição</label>
            <textarea style={{ ...inputStyle, height: '80px', resize: 'none' }} value={form.descricao} onChange={e => set('descricao', e.target.value)} placeholder="O que o aluno vai aprender..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Categoria</label>
              <input style={inputStyle} value={form.categoria} onChange={e => set('categoria', e.target.value)} placeholder="Ex: Back-end" />
            </div>
            <div>
              <label style={labelStyle}>Nível</label>
              <select style={inputStyle} value={form.nivel} onChange={e => set('nivel', e.target.value)}>
                <option value="INICIANTE">Iniciante</option>
                <option value="INTERMEDIARIO">Intermediário</option>
                <option value="AVANCADO">Avançado</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Carga (horas)</label>
              <input style={inputStyle} type="number" min="1" value={form.cargaHorariaMinutos / 60} onChange={e => set('cargaHorariaMinutos', e.target.value * 60)} />
            </div>
          </div>

          <button type="submit" className="btn-action primary" style={{ width: '100%' }} disabled={saving}>
            {saving ? 'Criando...' : 'Criar Curso e Adicionar Conteúdo →'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Editor de módulo (form de nova aula inline) ──────────────────────────────
function ModuloCard({ modulo, cursoId, onReload }) {
  const [showAddAula, setShowAddAula] = useState(false)
  const [aulaForm, setAulaForm] = useState({ titulo: '', videoUrl: '', duracaoMinutos: 10 })
  const [savingAula, setSavingAula] = useState(false)

  const setAula = (k, v) => setAulaForm(f => ({ ...f, [k]: v }))

  const handleAddAula = async (e) => {
    e.preventDefault()
    if (!aulaForm.titulo.trim()) return
    setSavingAula(true)
    try {
      await aulaService.criar(modulo.id, {
        titulo: aulaForm.titulo,
        videoUrl: aulaForm.videoUrl || null,
        duracaoMinutos: Number(aulaForm.duracaoMinutos),
        ordem: (modulo.aulas?.length || 0) + 1,
      })
      setAulaForm({ titulo: '', videoUrl: '', duracaoMinutos: 10 })
      setShowAddAula(false)
      onReload()
    } catch (err) {
      alert(err.response?.data?.mensagem || 'Erro ao adicionar aula.')
    } finally {
      setSavingAula(false)
    }
  }

  const handleExcluirAula = async (aulaId) => {
    if (!window.confirm('Excluir esta aula?')) return
    try {
      await aulaService.excluir(modulo.id, aulaId)
      onReload()
    } catch (err) {
      alert(err.response?.data?.mensagem || 'Erro ao excluir aula.')
    }
  }

  const handleExcluirModulo = async () => {
    if (!window.confirm(`Excluir o módulo "${modulo.titulo}" e todas as suas aulas?`)) return
    try {
      await moduloService.excluir(cursoId, modulo.id)
      onReload()
    } catch (err) {
      alert(err.response?.data?.mensagem || 'Erro ao excluir módulo.')
    }
  }

  return (
    <div style={{ ...sectionCard, background: '#fafafa' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#aaa', fontWeight: 600 }}>MÓDULO {modulo.ordem}</span>
          <h4 style={{ margin: '0.1rem 0 0', fontSize: '0.95rem', color: '#1a1a2e' }}>{modulo.titulo}</h4>
        </div>
        <button onClick={handleExcluirModulo} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: '1.1rem' }} title="Excluir módulo">🗑️</button>
      </div>

      {modulo.aulas?.length > 0 ? (
        <ul style={{ listStyle: 'none', margin: '0 0 0.8rem', padding: 0 }}>
          {modulo.aulas.map(aula => (
            <li key={aula.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
              <span style={{ fontSize: '0.88rem', color: '#333' }}>▶ {aula.titulo}</span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#aaa' }}>{aula.duracaoMinutos} min</span>
                <button onClick={() => handleExcluirAula(aula.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: '1rem' }}>✕</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontSize: '0.82rem', color: '#bbb', marginBottom: '0.8rem' }}>Nenhuma aula ainda.</p>
      )}

      {showAddAula ? (
        <form onSubmit={handleAddAula} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <input style={inputStyle} value={aulaForm.titulo} onChange={e => setAula('titulo', e.target.value)} placeholder="Título da aula *" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '0.6rem' }}>
            <input style={inputStyle} value={aulaForm.videoUrl} onChange={e => setAula('videoUrl', e.target.value)} placeholder="URL do vídeo (opcional)" />
            <input style={inputStyle} type="number" min="1" value={aulaForm.duracaoMinutos} onChange={e => setAula('duracaoMinutos', e.target.value)} placeholder="Min" />
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button type="submit" className="btn-action primary" style={{ flex: 1, fontSize: '0.82rem' }} disabled={savingAula}>
              {savingAula ? 'Salvando...' : '✓ Salvar Aula'}
            </button>
            <button type="button" className="btn-action secondary" style={{ fontSize: '0.82rem' }} onClick={() => setShowAddAula(false)}>Cancelar</button>
          </div>
        </form>
      ) : (
        <button className="btn-action secondary" style={{ fontSize: '0.82rem', width: '100%' }} onClick={() => setShowAddAula(true)}>
          + Adicionar Aula
        </button>
      )}
    </div>
  )
}

// ─── Página principal do editor ───────────────────────────────────────────────
export default function CursoEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { triggerToast } = useOutletContext()

  const [curso, setCurso] = useState(null)
  const [loading, setLoading] = useState(!!id)
  const [publishing, setPublishing] = useState(false)

  const [moduloForm, setModuloForm] = useState({ titulo: '' })
  const [showAddModulo, setShowAddModulo] = useState(false)
  const [savingModulo, setSavingModulo] = useState(false)

  useEffect(() => {
    if (id) loadCurso()
  }, [id])

  const loadCurso = async () => {
    try {
      const data = await cursoService.buscarMeuCurso(id)
      setCurso(data)
    } catch {
      triggerToast('Erro ao carregar curso.')
      navigate('/instrutor/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleCreated = (newId) => {
    navigate(`/instrutor/cursos/${newId}`)
  }

  const handleAddModulo = async (e) => {
    e.preventDefault()
    if (!moduloForm.titulo.trim()) return
    setSavingModulo(true)
    try {
      await moduloService.criar(id, {
        titulo: moduloForm.titulo,
        ordem: (curso?.modulos?.length || 0) + 1,
      })
      setModuloForm({ titulo: '' })
      setShowAddModulo(false)
      loadCurso()
    } catch (err) {
      triggerToast(err.response?.data?.mensagem || 'Erro ao adicionar módulo.')
    } finally {
      setSavingModulo(false)
    }
  }

  const handlePublicar = async () => {
    setPublishing(true)
    try {
      await cursoService.publicar(id)
      triggerToast('Curso publicado com sucesso!')
      loadCurso()
    } catch (err) {
      triggerToast(err.response?.data?.mensagem || 'Adicione ao menos um módulo antes de publicar.')
    } finally {
      setPublishing(false)
    }
  }

  if (!id) return <CriarCursoForm onCreated={handleCreated} />
  if (loading) return <p style={{ padding: '2rem', color: '#888' }}>Carregando...</p>
  if (!curso) return null

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '2rem 1rem' }}>

      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <button onClick={() => navigate('/instrutor/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '0.85rem', padding: 0, marginBottom: '0.4rem' }}>
            ← Voltar aos meus cursos
          </button>
          <h2 style={{ margin: 0, color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {curso.thumbUrl?.length <= 4 ? curso.thumbUrl : '🎓'} {curso.titulo}
          </h2>
        </div>
        {curso.status === 'RASCUNHO' ? (
          <button className="btn-action primary" onClick={handlePublicar} disabled={publishing}>
            {publishing ? 'Publicando...' : '🚀 Publicar Curso'}
          </button>
        ) : (
          <span style={{ background: '#e8f5f0', color: '#1a7f5a', border: '1px solid #b2dfcf', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
            ✓ Publicado
          </span>
        )}
      </div>

      {/* Info do curso */}
      <div style={{ ...sectionCard, display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div><span style={{ fontSize: '0.75rem', color: '#aaa' }}>CATEGORIA</span><p style={{ margin: '0.2rem 0 0', fontWeight: 500 }}>{curso.categoria || '—'}</p></div>
        <div><span style={{ fontSize: '0.75rem', color: '#aaa' }}>NÍVEL</span><p style={{ margin: '0.2rem 0 0', fontWeight: 500 }}>{curso.nivel}</p></div>
        <div><span style={{ fontSize: '0.75rem', color: '#aaa' }}>CARGA</span><p style={{ margin: '0.2rem 0 0', fontWeight: 500 }}>{Math.round((curso.cargaHorariaMinutos || 0) / 60)}h</p></div>
        <div><span style={{ fontSize: '0.75rem', color: '#aaa' }}>MÓDULOS</span><p style={{ margin: '0.2rem 0 0', fontWeight: 500 }}>{curso.modulos?.length || 0}</p></div>
      </div>

      {/* Módulos */}
      <h3 style={{ marginBottom: '1rem', color: '#1a1a2e' }}>Módulos e Aulas</h3>

      {curso.modulos?.length === 0 && !showAddModulo && (
        <p style={{ color: '#bbb', fontSize: '0.9rem', marginBottom: '1rem' }}>Nenhum módulo ainda. Adicione o primeiro abaixo.</p>
      )}

      {curso.modulos?.map(modulo => (
        <ModuloCard key={modulo.id} modulo={modulo} cursoId={id} onReload={loadCurso} />
      ))}

      {/* Adicionar módulo */}
      <div style={sectionCard}>
        {showAddModulo ? (
          <form onSubmit={handleAddModulo} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Título do Módulo *</label>
              <input style={inputStyle} value={moduloForm.titulo} onChange={e => setModuloForm({ titulo: e.target.value })} placeholder="Ex: Introdução ao Java" required autoFocus />
            </div>
            <button type="submit" className="btn-action primary" disabled={savingModulo}>
              {savingModulo ? '...' : '+ Adicionar'}
            </button>
            <button type="button" className="btn-action secondary" onClick={() => setShowAddModulo(false)}>Cancelar</button>
          </form>
        ) : (
          <button className="btn-action secondary" style={{ width: '100%' }} onClick={() => setShowAddModulo(true)}>
            + Adicionar Módulo
          </button>
        )}
      </div>
    </div>
  )
}