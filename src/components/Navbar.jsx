import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      <div className="logo">Aura<span>Academy</span></div>
      <ul className="nav-links">
        <li><a href="#">Cursos</a></li>
        <li><a href="#">Instrutores</a></li>
        <li><a href="#">Planos</a></li>
        <li><a href="#">Blog</a></li>
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
