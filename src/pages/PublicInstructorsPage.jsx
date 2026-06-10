import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { mockInstructors } from '../data/mockInstructors'
import '../styles/stylelanding_page.css'

function PublicInstructorsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Set Page Title and Meta for SEO on mount
  useEffect(() => {
    document.title = "Corpo Docente e Especialistas | AuraAcademy"
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Conheça os instrutores e especialistas da AuraAcademy. Aprenda diretamente com profissionais experientes e líderes de tecnologia do mercado.')
    }
  }, [])

  // Filter instructors based on search term
  const filteredInstructors = mockInstructors.filter((inst) => {
    const q = searchQuery.toLowerCase()
    return (
      inst.nome.toLowerCase().includes(q) ||
      inst.cargo.toLowerCase().includes(q) ||
      inst.especialidade.toLowerCase().includes(q) ||
      inst.biografia.toLowerCase().includes(q)
    )
  })

  return (
    <div className="catalog-page-container">
      {/* Institutional Navbar */}
      <Navbar />

      {/* Instructors Page Hero */}
      <section className="instructors-hero" id="instructors-hero-section">
        <div className="catalog-hero-content">
          <span className="hero-tag" style={{ marginBottom: '1rem' }}>Nossa Equipe</span>
          <h1 id="main-instructors-title"><em>Nossos Instrutores</em></h1>
          <p>
            Aprenda diretamente com especialistas renomados da indústria.
            Nossos mentores combinam sólidos conhecimentos teóricos com anos de prática em produção.
          </p>
        </div>
      </section>

      {/* Main Instructors Catalog */}
      <main className="catalog-main" id="instructors-main-content">
        {/* Search Bar Toolbar */}
        <div className="catalog-toolbar" style={{ justifyContent: 'center', marginBottom: '4rem' }}>
          <div className="catalog-search-bar" style={{ maxWidth: '600px' }} id="instructor-search-bar-container">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="instructor-search-input"
              type="text"
              placeholder="Buscar por nome, especialidade ou tecnologia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar instrutor"
            />
          </div>
        </div>

        {/* Empty Search State */}
        {filteredInstructors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--white)', borderRadius: '24px', border: '1px solid var(--cream-dark)', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>👥</span>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', color: 'var(--ink)', marginBottom: '0.4rem', fontWeight: 600 }}>Nenhum instrutor encontrado</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
              Não encontramos nenhum instrutor com esse termo. Tente buscar por nomes como "Lucas", "Julia" ou palavras-chave como "React", "Spring Boot", "Design".
            </p>
          </div>
        ) : (
          /* Instructors Cards Grid */
          <div className="instructors-grid" id="instructors-profile-grid">
            {filteredInstructors.map((inst) => (
              <div
                key={inst.id}
                id={`instructor-card-${inst.id}`}
                className="instructor-card"
              >
                {/* Rectangular Portrait Photo */}
                <div className="instructor-img-wrapper">
                  <img src={inst.avatar} alt={`Foto de ${inst.nome}`} className="instructor-img" />
                </div>

                {/* Content Card Info */}
                <div className="instructor-card-content">
                  <h3 className="instructor-name">{inst.nome}</h3>
                  <span className="instructor-title">{inst.cargo}</span>

                  {/* Specialty Box highlight */}
                  <div className="instructor-specialty-box">
                    {inst.especialidade}
                  </div>

                  {/* Biography description */}
                  <p className="instructor-bio">{inst.biografia}</p>

                  {/* Dynamic Courses taught section */}
                  {inst.cursos && inst.cursos.length > 0 && (
                    <div className="instructor-courses-section">
                      <span className="instructor-courses-label">Cursos Ministrados:</span>
                      <div className="instructor-courses-tags">
                        {inst.cursos.map((curso, idx) => (
                          <Link
                            key={idx}
                            to="/cursos"
                            className="instructor-course-tag"
                            title={`Ver catálogo para encontrar ${curso}`}
                          >
                            📚 {curso}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer id="instructors-footer">
        <div className="logo" style={{ fontSize: '1.2rem' }}>Aura<span style={{ color: 'var(--gold)' }}>Academy</span></div>
        <p className="footer-copy">© 2025 AuraAcademy. Todos os direitos reservados.</p>
        <div className="footer-links">
          <a href="#">Privacidade</a>
          <a href="#">Termos</a>
          <a href="#">Suporte</a>
          <a href="#">Contato</a>
        </div>
      </footer>
    </div>
  )
}

export default PublicInstructorsPage
