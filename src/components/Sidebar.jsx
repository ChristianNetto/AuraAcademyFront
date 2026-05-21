import React, { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { authService } from '../services/api'

function Sidebar() {
  const [currentUser, setCurrentUser] = useState({ 
    nome: 'Administrador', 
    email: 'admin@auraacademy.com', 
    initials: 'AD' 
  })

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user) {
      const email = user.email || 'admin@auraacademy.com'
      const nome = email.split('@')[0].toUpperCase()
      const initials = nome.substring(0, 2)
      setCurrentUser({
        nome: nome,
        email: email,
        initials: initials
      })
    }
  }, [])

  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-logo">
        Aura<span>Academy</span>
        <small>Painel Admin</small>
      </Link>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Principal</div>
        <NavLink to="/admin/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="icon">📊</span> Dashboard
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="icon">👥</span> Usuários
        </NavLink>
        <NavLink to="/admin/courses" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="icon">🎓</span> Cursos
        </NavLink>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Gestão</div>
        <NavLink to="/admin/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="icon">📈</span> Relatórios
        </NavLink>
        <NavLink to="/admin/financial" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="icon">💳</span> Financeiro
        </NavLink>
        <NavLink to="/admin/notifications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="icon">🔔</span> Notificações
        </NavLink>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Sistema</div>
        <NavLink to="/admin/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="icon">⚙️</span> Configurações
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{currentUser.initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{currentUser.nome}</div>
            <div className="sidebar-user-role">{currentUser.email}</div>
          </div>
        </div>
        <Link to="/login" className="sidebar-link" onClick={() => authService.logout()}>
          <span className="icon">🚪</span> Sair
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar
