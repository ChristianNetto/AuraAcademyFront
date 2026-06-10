import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
        Aura<span>Academy</span>
      </Link>
      <ul className="nav-links">
        <li><Link to="/cursos">Cursos</Link></li>
        <li><Link to="/instrutores">Instrutores</Link></li>
        <li><Link to="/planos">Planos</Link></li>
        <li>
          <Link to="/login" style={{ color: 'var(--teal)', fontWeight: 500 }}>
            Entrar
          </Link>
        </li>
      </ul>
      <Link to="/login" className="btn-nav" style={{ textDecoration: 'none' }}>
        Entrar
      </Link>
    </nav>
  )
}

export default Navbar
