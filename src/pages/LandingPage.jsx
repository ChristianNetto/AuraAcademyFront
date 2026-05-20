import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/stylelanding_page.css'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing-page-root">
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-tag">Plataforma de aprendizado online</div>
          <h1>Aprenda com <em>propósito</em>,<br />cresça com clareza.</h1>
          <p className="hero-sub">A AuraAcademy reúne cursos premium, instrutores especializados e uma experiência de aprendizado que transforma conhecimento em resultado real.</p>
          <div className="hero-ctas">
            <Link to="/login" className="btn-primary">Começar agora</Link>
            <Link to="/login" className="btn-outline">Fazer login</Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-num">12<span>k+</span></div>
              <div className="stat-label">Alunos ativos</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">380<span>+</span></div>
              <div className="stat-label">Cursos disponíveis</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">98<span>%</span></div>
              <div className="stat-label">Satisfação geral</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="float-badge top-right">
            ✦ Novo curso disponível
          </div>
          <div className="dashboard-mock">
            <div className="mock-header">
              <span className="mock-title">Meu painel de cursos</span>
              <span className="mock-badge">Em andamento</span>
            </div>

            <div className="course-card">
              <div className="course-thumb" style={{ background: '#e8f5f0' }}>📐</div>
              <div className="course-info">
                <div className="course-name">UX Design Avançado</div>
                <div className="course-meta">14 módulos · 6h restantes</div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: '72%' }}></div></div>
              </div>
            </div>

            <div className="course-card">
              <div className="course-thumb" style={{ background: '#fef3e2' }}>⚙️</div>
              <div className="course-info">
                <div className="course-name">APIs com Spring Boot</div>
                <div className="course-meta">22 módulos · 12h restantes</div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: '45%', background: 'var(--gold)' }}></div></div>
              </div>
            </div>

            <div className="course-card">
              <div className="course-thumb" style={{ background: '#f0eeff' }}>🎯</div>
              <div className="course-info">
                <div className="course-name">Gestão de Projetos Ágeis</div>
                <div className="course-meta">8 módulos · 2h restantes</div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: '88%' }}></div></div>
              </div>
            </div>

            <div className="mock-footer">
              <div className="mini-stat">
                <div className="mini-stat-num">24</div>
                <div className="mini-stat-label">Horas estudadas</div>
              </div>
              <div className="mini-stat">
                <div className="mini-stat-num">3</div>
                <div className="mini-stat-label">Certificados</div>
              </div>
            </div>
          </div>
          <div className="float-badge bottom-left">
            🏆 Certificado emitido!
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <div className="section-tag">Por que a AuraAcademy</div>
        <h2>Tudo que você precisa<br />para <em>evoluir de verdade</em></h2>
        <p className="section-intro">Uma plataforma pensada para quem leva aprendizado a sério — com ferramentas que ampliam o foco e aceleram o progresso.</p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <div className="feature-title">Cursos estruturados</div>
            <p className="feature-desc">Conteúdos organizados por trilhas de aprendizado com módulos progressivos e avaliações práticas ao longo da jornada.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <div className="feature-title">Painel de progresso</div>
            <p className="feature-desc">Acompanhe seu desempenho em tempo real com métricas claras de evolução, horas estudadas e conquistas desbloqueadas.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏅</div>
            <div className="feature-title">Certificados validados</div>
            <p className="feature-desc">Emita certificados de conclusão reconhecidos no mercado, compartilháveis diretamente no LinkedIn e portfólio.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <div className="feature-title">Comunidade activa</div>
            <p className="feature-desc">Conecte-se com outros alunos, participe de fóruns temáticos e tire dúvidas diretamente com os instrutores.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <div className="feature-title">Acesso em qualquer lugar</div>
            <p className="feature-desc">Estude do celular, tablet ou computador. A plataforma se adapta ao seu dispositivo e ao seu ritmo de vida.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <div className="feature-title">Acesso vitalício</div>
            <p className="feature-desc">Após a compra, o conteúdo fica disponível para sempre. Revise quando quiser, sem prazo de expiração.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="testimonials">
        <div className="section-tag">Depoimentos</div>
        <h2>O que dizem<br />nossos <em>alunos</em></h2>

        <div className="testi-grid">
          <div className="testi-card">
            <div className="stars">★★★★★</div>
            <p className="testi-text">"A AuraAcademy mudou completamente minha perspectiva sobre aprendizado online. Os cursos são densos e práticos."</p>
            <div className="testi-author">
              <div className="testi-avatar" style={{ background: 'var(--teal)' }}>CM</div>
              <div>
                <div className="testi-name">Carla Mendes</div>
                <div className="testi-role">Desenvolvedora Front-end</div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <div className="stars">★★★★★</div>
            <p className="testi-text">"Finalmente uma plataforma que respeita meu tempo. O painel de progresso me manteve motivado até o final."</p>
            <div className="testi-author">
              <div className="testi-avatar" style={{ background: 'var(--gold)' }}>RP</div>
              <div>
                <div className="testi-name">Rafael Porto</div>
                <div className="testi-role">Gestor de Projetos</div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <div className="stars">★★★★★</div>
            <p className="testi-text">"Já experimentei várias plataformas de ensino e a AuraAcademy se destaca pela qualidade do conteúdo e suporte."</p>
            <div className="testi-author">
              <div className="testi-avatar" style={{ background: 'var(--accent)' }}>LS</div>
              <div>
                <div className="testi-name">Lara Souza</div>
                <div className="testi-role">Designer de Produto</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: '0 0 5rem' }}>
        <div className="cta-section">
          <div>
            <div className="section-tag" style={{ color: 'var(--gold-light)' }}>Comece hoje</div>
            <h2>Sua jornada de<br /><em>aprendizado começa</em><br />aqui.</h2>
            <p style={{ marginTop: '1rem' }}>Junte-se a milhares de profissionais que usam a AuraAcademy para crescer na carreira e dominar novas habilidades.</p>
          </div>
          <div className="cta-form">
            <input type="text" className="cta-input" placeholder="Seu nome completo" />
            <input type="email" className="cta-input" placeholder="Seu melhor e-mail" />
            <button className="btn-gold" onClick={() => navigate('/login')}>Criar conta gratuita →</button>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>Sem cartão de crédito. Cancele quando quiser.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
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

export default LandingPage
