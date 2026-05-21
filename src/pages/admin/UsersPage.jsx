import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import StatCard from '../../components/StatCard'
import { usuarioService } from '../../services/api'

function UsersPage() {
  const { users, setUsers, triggerToast, openNewUserModal } = useOutletContext()

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

  // Dynamic metrics
  const totalUsers = users.length
  const activeUsersCount = users.filter(u => u.rawStatus === 'ativo').length
  const premiumCount = users.filter(u => u.rawPlan === 'premium').length
  const recentCount = users.filter(u => u.date.includes('2026') || u.date.includes('abr')).length

  const handleRoleChange = async (userId, newRole) => {
    const apiRole = newRole === 'Admin' ? 'ADMIN' : newRole === 'Instrutor' ? 'INSTRUTOR' : 'ALUNO'
    
    // Optimistic UI update
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
    
    try {
      await usuarioService.alterarRole(userId, apiRole)
      triggerToast(`Papel de usuário atualizado para ${newRole}!`)
    } catch (err) {
      console.warn("Erro ao atualizar no backend, papel alterado localmente.")
      triggerToast(`Papel atualizado para ${newRole} (Simulado)`)
    }
  }

  const handleAction = async (type, user) => {
    if (type === 'delete') {
      if (user.role === 'Admin') {
        triggerToast('Não é possível excluir um administrador')
      } else {
        try {
          await usuarioService.excluir(user.id)
          setUsers(users.filter(u => u.id !== user.id))
          triggerToast(`Usuário "${user.name}" removido do servidor.`)
        } catch (err) {
          console.warn("Erro ao excluir no backend, removendo localmente.", err)
          setUsers(users.filter(u => u.id !== user.id))
          triggerToast(`Usuário "${user.name}" removido (Simulado).`)
        }
      }
    } else if (type === 'Editar') {
      triggerToast(`Edição simulada para ${user.name}`)
    } else {
      triggerToast(`${type} ${user.name}`)
    }
  }

  return (
    <div className="page-content">
      {/* STATS */}
      <div className="stats-grid">
        <StatCard icon="👥" iconColor="teal" value={totalUsers.toString()} label="Total de Usuários" />
        <StatCard change="↑ 4,1%" icon="✅" iconColor="gold" value={activeUsersCount.toString()} label="Usuários Ativos" />
        <StatCard icon="⭐" iconColor="accent" value={premiumCount.toString()} label="Plano Premium" />
        <StatCard change="↑ Novos" icon="🆕" iconColor="red" value={recentCount.toString()} label="Novos Recentes" />
      </div>

      {/* TABLE CARD */}
      <div className="card" style={{ animationDelay: '0.3s' }}>
        <div className="card-header">
          <span className="card-title">Lista de Usuários</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--ink-muted)' }}>
              {filteredUsers.length} registros exibidos
            </span>
            <button className="btn-action primary" onClick={openNewUserModal} style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem' }}>
              + Novo Usuário
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
                      <select 
                        className="role-select" 
                        value={user.role} 
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      >
                        <option value="Aluno">Aluno</option>
                        <option value="Instrutor">Instrutor</option>
                        <option value="Admin">Admin</option>
                      </select>
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
            <button className="page-btn" onClick={() => triggerToast('Próxima página')}>›</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersPage
