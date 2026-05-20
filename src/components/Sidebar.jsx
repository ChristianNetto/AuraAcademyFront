import React from 'react'
import { NavLink, Link } from 'react-router-dom'

function Sidebar({ onShowToast }) {
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
        <button className="sidebar-link" onClick={() => onShowToast('Em desenvolvimento')} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
          <span className="icon">📈</span> Relatórios
        </button>
        <button className="sidebar-link" onClick={() => onShowToast('Em desenvolvimento')} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
          <span className="icon">💳</span> Financeiro
        </button>
        <button className="sidebar-link" onClick={() => onShowToast('Em desenvolvimento')} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
          <span className="icon">🔔</span> Notificações
        </button>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Sistema</div>
        <button className="sidebar-link" onClick={() => onShowToast('Em desenvolvimento')} style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
          <span className="icon">⚙️</span> Configurações
        </button>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">AD</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Administrador</div>
            <div className="sidebar-user-role">admin@auraacademy.com</div>
          </div>
        </div>
        <Link to="/login" className="sidebar-link">
          <span className="icon">🚪</span> Sair
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar
