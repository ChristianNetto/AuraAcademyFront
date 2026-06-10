import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { mockCourses } from '../data/mockCourses'
import { cursoService } from '../services/api'
import '../styles/stylelanding_page.css'

function PublicCoursesPage() {
  const navigate = useNavigate()
  
  // State variables
  const [courses, setCourses] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load courses on component mount
  useEffect(() => {
    // Set Page Title and Meta for SEO
    document.title = "Cursos Online Premium | AuraAcademy"
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Explore os cursos premium da AuraAcademy nas áreas de Desenvolvimento Web, Backend, Design e Gestão. Matricule-se e acelere sua carreira.')
    }

    async function loadData() {
      try {
        const response = await cursoService.listar()
        const fetchedList = response.content || response
        if (Array.isArray(fetchedList) && fetchedList.length > 0) {
          setCourses(fetchedList.map(c => ({
            id: c.id,
            titulo: c.titulo,
            instrutor: c.instrutorNome || 'Instrutor Aura',
            categoria: c.categoria || 'Geral',
            thumbnail: getThumbUrlOrFallback(c.thumbUrl),
            descricaoCurta: c.descricao || 'Sem descrição cadastrada.',
            cargaHoraria: c.cargaHorariaMinutos ? Math.round(c.cargaHorariaMinutos / 60) : 10,
            modulos: c.modulos || []
          })))
        } else {
          loadMocks()
        }
      } catch (err) {
        console.warn("Backend offline para catálogo público, carregando mocks.")
        loadMocks()
      } finally {
        setLoading(false)
      }
    }

    function loadMocks() {
      setCourses(mockCourses.map(c => ({
        id: c.id,
        titulo: c.titulo,
        instrutor: c.instrutor || 'Instrutor Aura',
        categoria: c.categoria || 'Geral',
        thumbnail: c.thumbnail,
        descricaoCurta: c.descricaoCurta || 'Sem descrição cadastrada.',
        cargaHoraria: c.totalAulas ? c.totalAulas * 2 : 12,
        modulos: c.modulos || []
      })))
    }

    loadData()
  }, [])

  const getThumbUrlOrFallback = (thumb) => {
    if (thumb && thumb.startsWith('http')) return thumb
    const map = {
      '📐': 'https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=600&q=80',
      '⚙️': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80',
      '🎯': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
      '🐍': 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&q=80',
      '💻': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
      '🎓': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
    }
    return map[thumb] || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
  }

  // Derive unique categories dynamically
  const categories = ['Todos', ...new Set(courses.map(c => c.categoria))]

  // Filter courses based on search query and selected category
  const filteredCourses = courses.filter(c => {
    const matchesCategory = selectedCategory === 'Todos' || c.categoria === selectedCategory
    const matchesSearch = c.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.instrutor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.descricaoCurta.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleCardClick = (course) => {
    setSelectedCourse(course)
    setShowModal(true)
  }

  return (
    <div className="catalog-page-container">
      {/* Navigation Header */}
      <Navbar />

      {/* Catalog Hero Banner */}
      <section className="catalog-hero" id="catalog-hero-section">
        <div className="catalog-hero-content">
          <span className="hero-tag" style={{ marginBottom: '1rem' }}>Nosso Portfólio</span>
          <h1 id="main-catalog-title">Explore nossos <em>Cursos</em></h1>
          <p>
            Capacite-se com trilhas de aprendizado completas e práticas. 
            Desenvolvido por especialistas da indústria para impulsionar sua carreira.
          </p>
        </div>
      </section>

      {/* Main Catalog Area */}
      <main className="catalog-main" id="catalog-main-content">
        {/* Search & Category Filter Toolbar */}
        <div className="catalog-toolbar">
          {/* Search Input */}
          <div className="catalog-search-bar" id="search-bar-container">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              id="course-search-input"
              type="text" 
              placeholder="O que você deseja aprender?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar curso"
            />
          </div>

          {/* Category Pill Filters */}
          <div className="catalog-filters" id="category-filters-container">
            {categories.map((category) => (
              <button
                key={category}
                id={`filter-btn-${category.toLowerCase().replace(/\s+/g, '-')}`}
                className={`catalog-filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6rem 0', gap: '1rem' }}>
            <div className="loading-spinner" style={{ width: '45px', height: '45px', border: '3px solid var(--cream-dark)', borderTopColor: 'var(--teal)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <span style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Carregando catálogo de trilhas...</span>
          </div>
        ) : filteredCourses.length === 0 ? (
          /* Empty Search/Filter State */
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--white)', borderRadius: '24px', border: '1px solid var(--cream-dark)', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', color: 'var(--ink)', marginBottom: '0.4rem', fontWeight: 600 }}>Nenhum curso encontrado</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
              Experimente alterar os termos de busca ou escolher outra categoria de filtro.
            </p>
          </div>
        ) : (
          /* Courses Grid */
          <div className="catalog-grid" id="catalog-courses-grid">
            {filteredCourses.map((course) => (
              <div 
                key={course.id}
                id={`course-card-${course.id}`}
                className="catalog-card"
                onClick={() => handleCardClick(course)}
              >
                <div className="catalog-card-img-wrapper">
                  <img src={course.thumbnail} alt={course.titulo} className="catalog-card-img" />
                  <span className="catalog-card-badge">{course.categoria}</span>
                </div>
                
                <div className="catalog-card-content">
                  <span className="catalog-card-instructor">{course.instrutor}</span>
                  <h3 className="catalog-card-title">{course.titulo}</h3>
                  <p className="catalog-card-desc">{course.descricaoCurta}</p>
                  
                  <div className="catalog-card-footer">
                    <span>⏱ {course.cargaHoraria}h totais</span>
                    <span className="catalog-card-more">Saber Mais →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Course Detail Modal */}
      {showModal && selectedCourse && (
        <div 
          className="catalog-modal-overlay" 
          onClick={() => setShowModal(false)}
          id="course-detail-modal-overlay"
        >
          <div 
            className="catalog-modal" 
            onClick={(e) => e.stopPropagation()}
            id={`course-detail-modal-${selectedCourse.id}`}
          >
            <div className="catalog-modal-header">
              <div>
                <span className="catalog-card-badge" style={{ position: 'static', background: 'rgba(42, 125, 110, 0.1)', color: 'var(--teal)', border: '1px solid rgba(42, 125, 110, 0.2)', padding: '0.3rem 0.8rem', fontWeight: 600 }}>
                  {selectedCourse.categoria}
                </span>
              </div>
              <button 
                className="catalog-modal-close" 
                onClick={() => setShowModal(false)}
                aria-label="Fechar modal"
                id="close-modal-btn"
              >
                ×
              </button>
            </div>

            <h2 className="catalog-modal-title">{selectedCourse.titulo}</h2>
            <div className="catalog-modal-meta">
              Instrutor: <strong>{selectedCourse.instrutor}</strong> &middot; Carga Horária: <strong>{selectedCourse.cargaHoraria} horas</strong>
            </div>

            {/* Description Card */}
            <div className="catalog-modal-desc-box">
              <span>Sobre o curso</span>
              <p>{selectedCourse.descricaoCurta}</p>
            </div>

            {/* Syllabus Curriculum */}
            <div className="catalog-modal-syllabus" id="course-modal-syllabus">
              <h4>Conteúdo Programático</h4>
              {selectedCourse.modulos && selectedCourse.modulos.length > 0 ? (
                <ul className="catalog-syllabus-list">
                  {selectedCourse.modulos.map((modulo, idx) => (
                    <li key={modulo.id || idx} className="catalog-syllabus-item">
                      <span>Módulo {idx + 1}: {modulo.titulo}</span>
                      <span className="catalog-syllabus-lessons-count">
                        {modulo.aulas ? modulo.aulas.length : 0} aulas
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontStyle: 'italic' }}>
                  Matricule-se para acessar a grade curricular detalhada deste curso.
                </p>
              )}
            </div>

            {/* Footer Buttons with CTA to Login */}
            <div className="catalog-modal-footer">
              <button 
                id="modal-cancel-btn"
                className="btn-outline" 
                style={{ padding: '0.6rem 1.4rem', fontSize: '0.88rem' }}
                onClick={() => setShowModal(false)}
              >
                Voltar
              </button>
              <button 
                id="modal-enroll-btn"
                className="btn-primary" 
                style={{ padding: '0.6rem 1.6rem', fontSize: '0.88rem' }}
                onClick={() => {
                  setShowModal(false)
                  navigate('/login')
                }}
              >
                🚀 Começar a Estudar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer id="catalog-footer">
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

export default PublicCoursesPage
