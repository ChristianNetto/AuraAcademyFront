import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader'
import StatCard from '../../components/StatCard'

function UsersPage() {
  const triggerToast = useOutletContext()

  // Initial user list based on the original HTML table rows
  const [users, setUsers] = useState([
    { id: 1, name: 'Carla Mendes', email: 'carla.mendes@email.com', initials: 'CM', bg: 'var(--teal)', plan: 'Premium', role: 'Aluno', status: 'Ativo', courses: '7 cursos', date: '14 jan 2025', rawStatus: 'ativo', rawPlan: 'premium' },
    { id: 2, name: 'Rafael Porto', email: 'rafael.porto@email.com', initials: 'RP', bg: 'var(--gold)', plan: 'Gratuito', role: 'Aluno', status: 'Ativo', courses: '2 cursos', date: '03 fev 2025', rawStatus: 'ativo', rawPlan: 'gratuito' },
    { id: 3, name: 'Lara Souza', email: 'lara.souza@email.com', initials: 'LS', bg: 'var(--accent)', plan: 'Premium', role: 'Aluno', status: 'Ativo', courses: '12 cursos', date: '20 mar 2025', rawStatus: 'ativo', rawPlan: 'premium' },
    { id: 4, name: 'João Mota', email: 'joao.mota@email.com', initials: 'JM', bg: '#e67e22', plan: 'Gratuito', role: 'Aluno', status: 'Inativo', courses: '1 curso', date: '08 abr 2025', rawStatus: 'inativo', rawPlan: 'gratuito' },
    { id: 5, name: 'Ana Silva', email: 'ana.silva@email.com', initials: 'AS', bg: '#2980b9', plan: 'Premium', role: 'Aluno', status: 'Ativo', courses: '5 cursos', date: '12 abr 2025', rawStatus: 'ativo', rawPlan: 'premium' },
    { id: 6, name: 'Marina Fernandes', email: 'marina.f@email.com', initials: 'MF', bg: 'var(--danger)', plan: 'Premium', role: 'Admin', status: 'Ativo', courses: '—', date: '01 jan 2025', rawStatus: 'ativo', rawPlan: 'premium' },
    { id: 7, name: 'Pedro Torres', email: 'pedro.torres@email.com', initials: 'PT', bg: '#16a085', plan: 'Premium', role: 'Aluno', status: 'Inativo', courses: '3 cursos', date: '22 mai 2025', rawStatus: 'inativo', rawPlan: 'premium' },
    { id: 8, name: 'Beatriz Castro', email: 'bia.castro@email.com', initials: 'BC', bg: '#8e44ad', plan: 'Gratuito', role: 'Aluno', status: 'Ativo', courses: '1 curso', date: '29 abr 2026', rawStatus: 'ativo', rawPlan: 'gratuito' },
  ])

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('todos')

  // Derive filtered list
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = activeFilter === 'todos' || 
                          user.rawStatus === activeFilter || 
                          user.rawPlan === activeFilter

    return matchesSearch && matchesFilter
  })

  // Action slots for header
  const headerActions = (
    <>
      <button className="btn-action secondary" onClick={() => triggerToast('Exportar CSV — em desenvolvimento')}>
        ↓ Exportar
      </button>
      <button className="btn-action primary" onClick={() => triggerToast('Formulário de novo usuário — em desenvolvimento')}>
        + Novo Usuário
      </button>
    </>
  )

  const handleAction = (type, user) => {
    if (type === 'delete') {
      if (user.role === 'Admin') {
        triggerToast('Não é possível excluir um administrador')
      } else {
        triggerToast('Ação irreversível — confirme antes de excluir')
      }
    } else {
      triggerToast(`${type} ${user.name}`)
    }
  }

  return (
    <>
      <AdminHeader 
        title="Usuários" 
        subtitle="Gerencie todos os alunos e administradores da plataforma." 
        actions={headerActions}
        onShowToast={triggerToast}
      />

      <div className="page-content">
        {/* STATS */}
        <div className="stats-grid">
          <StatCard icon="👥" iconColor="teal" value="12.483" label="Total de Usuários" />
          <StatCard change="↑ 4,1%" icon="✅" iconColor="gold" value="11.204" label="Usuários Ativos" />
          <StatCard icon="⭐" iconColor="accent" value="7.832" label="Plano Premium" />
          <StatCard change="↑ 312" icon="🆕" iconColor="red" value="312" label="Novos Este Mês" />
        </div>

        {/* TABLE CARD */}
        <div className="card" style={{ animationDelay: '0.3s' }}>
          <div className="card-header">
            <span className="card-title">Lista de Usuários</span>
            <span style={{ fontSize: '0.76rem', color: 'var(--ink-muted)' }}>
              {filteredUsers.length} registros exibidos
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
                  placeholder="Buscar por nome ou e-mail..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="filter-btns">
                {['todos', 'ativo', 'inativo', 'premium', 'gratuito'].map((f) => (
                  <button 
                    key={f}
                    className={`filter-btn ${activeFilter === f ? 'active' : ''}`} 
                    onClick={() => setActiveFilter(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1) + 's'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Plano</th>
                  <th>Função</th>
                  <th>Status</th>
                  <th>Cursos</th>
                  <th>Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar" style={{ background: user.bg }}>{user.initials}</div>
                          <div>
                            <div className="user-name">{user.name}</div>
                            <div className="user-email">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${user.rawPlan}`}>{user.plan}</span>
                      </td>
                      <td>
                        <span className="badge gratuito">{user.role}</span>
                      </td>
                      <td>
                        <span className={`badge ${user.rawStatus}`}>{user.status}</span>
                      </td>
                      <td>{user.courses}</td>
                      <td>{user.date}</td>
                      <td>
                        <div className="action-btns">
                          <button className="icon-btn" onClick={() => handleAction('Editar', user)}>✏️</button>
                          <button className="icon-btn" onClick={() => handleAction('Ver perfil de', user)}>👁</button>
                          <button className="icon-btn del" onClick={() => handleAction('delete', user)}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-muted)' }}>
                      Nenhum usuário encontrado com as configurações atuais.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="pagination">
            <span className="pagination-info">Mostrando {filteredUsers.length} de {users.length} usuários</span>
            <div className="pagination-btns">
              <button className="page-btn" onClick={() => triggerToast('Página anterior')}>‹</button>
              <button className="page-btn active">1</button>
              <button className="page-btn" onClick={() => triggerToast('Ir para página 2')}>2</button>
              <button className="page-btn" onClick={() => triggerToast('Ir para página 3')}>3</button>
              <button className="page-btn">…</button>
              <button className="page-btn" onClick={() => triggerToast('Ir para última página')}>1561</button>
              <button className="page-btn" onClick={() => triggerToast('Próxima página')}>›</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UsersPage
