import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import '../styles/styleAdmin.css'

function AdminLayout() {
  const [toastMsg, setToastMsg] = useState('')
  const [showToast, setShowToast] = useState(false)

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setShowToast(true)
  }

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  return (
    <div className="admin-layout">
      <Sidebar onShowToast={triggerToast} />
      <main className="admin-main">
        {/* As páginas internas do Admin (Dashboard, Usuários, Cursos) serão injetadas aqui */}
        <Outlet context={triggerToast} />
      </main>

      {/* Toast Administrativo Global */}
      <div className={`toast ${showToast ? 'show' : ''}`}>
        {toastMsg}
      </div>
    </div>
  )
}

export default AdminLayout
