import React from 'react'
import { useOutletContext } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader'

function AdminPlaceholderScreen({ title, subtitle }) {
  const triggerToast = useOutletContext()

  return (
    <>
      <AdminHeader 
        title={title} 
        subtitle={subtitle || "Área administrativa"} 
        onShowToast={triggerToast}
      />
      <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
        <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '450px', width: '100%' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.5rem' }}>
            Em desenvolvimento
          </h2>
          <p style={{ color: 'var(--ink-muted)', fontSize: '0.9rem' }}>
            Esta funcionalidade está sendo preparada e estará disponível em breve.
          </p>
        </div>
      </div>
    </>
  )
}

export default AdminPlaceholderScreen
