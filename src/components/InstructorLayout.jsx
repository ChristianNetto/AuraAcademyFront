import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/api'
import '../styles/styleAdmin.css'

export default function InstructorLayout() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState({ nome: 'Instrutor', email: '', initials: 'IN' })
  const [toast, setToast] = useState('')
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user) {
      const nome = user.email.split('@')[0]
      setCurrentUser({
        nome: nome.charAt(0).toUpperCase() + nome.slice(1),
        email: user.email,
        initials: nome.substring(0, 2).toUpperCase(),
      })
    }
  }, [])

  const triggerToast = (msg) => {
    setToast(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <Link to="/" className="sidebar-logo">
          Aura<span>Academy</span>
          <small>Área do Instrutor</small>
        </Link>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Cursos</div>
          <NavLink
            to="/instrutor/dashboard"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="icon">📚</span> Meus Cursos
          </NavLink>
          <NavLink
            to="/instrutor/cursos/novo"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="icon">➕</span> Novo Curso
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
          <button
            className="sidebar-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', padding: '0.6rem 0.8rem' }}
            onClick={handleLogout}
          >
            <span className="icon">🚪</span> Sair
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet context={{ triggerToast }} />
      </main>

      <div className={`toast ${showToast ? 'show' : ''}`}>{toast}</div>
    </div>
  )
}