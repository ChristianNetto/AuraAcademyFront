import React from 'react'

function AdminHeader({ title, subtitle, actions, onShowToast }) {
  return (
    <header className="admin-header">
      <div className="header-title">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="header-actions">
        <button className="notif-btn" onClick={() => onShowToast('Nenhuma nova notificação')}>
          🔔 <span className="notif-dot"></span>
        </button>
        {actions}
      </div>
    </header>
  )
}

export default AdminHeader
