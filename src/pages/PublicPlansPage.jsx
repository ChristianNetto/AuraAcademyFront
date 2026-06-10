import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/stylelanding_page.css'

function PublicPlansPage() {
  // Set page headers for SEO
  useEffect(() => {
    document.title = "Nossos Planos | AuraAcademy"
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Escolha o plano ideal na AuraAcademy: Gratuito, Premium ou Corporativo. Conquiste novos patamares na sua carreira tech com certificados oficiais.')
    }
  }, [])

  return (
    <div className="catalog-page-container">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Banner */}
      <section className="plans-hero" id="plans-hero-section">
        <div className="catalog-hero-content">
          <span className="hero-tag" style={{ marginBottom: '1rem' }}>Investimento</span>
          <h1 id="main-plans-title"> <em>Planos feitos para seu crescimento</em></h1>
          <p>
            Escolha o caminho ideal para sua jornada de aprendizado.
            Comece grátis ou assine o Premium para acelerar sua evolução profissional.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="catalog-main" id="plans-main-content">

        {/* Pricing Cards Grid */}
        <div className="plans-grid" id="pricing-cards-grid">

          {/* Free Plan Card */}
          <div className="plan-card" id="pricing-card-free">
            <div className="plan-header">
              <h3 className="plan-name">Gratuito</h3>
              <div className="plan-price-box">
                <span className="plan-currency">R$</span>
                <span className="plan-price">0</span>
              </div>
              <span className="plan-period">para sempre</span>
            </div>
            <p className="plan-desc">
              Ideal para quem quer conhecer a plataforma e iniciar os primeiros passos em programação e design.
            </p>

            <ul className="plan-features-list">
              <li className="plan-feature-item">
                <span className="compare-icon-check">✓</span> Acesso a cursos básicos selecionados
              </li>
              <li className="plan-feature-item">
                <span className="compare-icon-check">✓</span> Certificado de conclusão padrão
              </li>
              <li className="plan-feature-item">
                <span className="compare-icon-check">✓</span> Acesso ao fórum de alunos comum
              </li>
              <li className="plan-feature-item" style={{ color: 'var(--ink-muted)' }}>
                <span className="compare-icon-dash">✕</span> Sem suporte de instrutores
              </li>
              <li className="plan-feature-item" style={{ color: 'var(--ink-muted)' }}>
                <span className="compare-icon-dash">✕</span> Sem arquivos de projetos práticos
              </li>
            </ul>

            <Link to="/login" className="plan-btn outline" id="btn-choose-free">
              Começar Grátis
            </Link>
          </div>

          {/* Premium Plan Card */}
          <div className="plan-card popular" id="pricing-card-premium">
            <span className="plan-popular-badge">Mais Escolhido</span>
            <div className="plan-header">
              <h3 className="plan-name">Premium</h3>
              <div className="plan-price-box">
                <span className="plan-currency">R$</span>
                <span className="plan-price">99,90</span>
              </div>
              <span className="plan-period">por mês</span>
            </div>
            <p className="plan-desc">
              Para quem deseja se especializar, obter portfólio prático de projetos e suporte rápido de especialistas.
            </p>

            <ul className="plan-features-list">
              <li className="plan-feature-item">
                <span className="compare-icon-check">✓</span> Acesso ilimitado a todos os cursos
              </li>
              <li className="plan-feature-item">
                <span className="compare-icon-check">✓</span> Certificado premium com hash e blockchain
              </li>
              <li className="plan-feature-item">
                <span className="compare-icon-check">✓</span> Suporte prioritário dos instrutores
              </li>
              <li className="plan-feature-item">
                <span className="compare-icon-check">✓</span> Downloads de arquivos e códigos-fonte
              </li>
              <li className="plan-feature-item">
                <span className="compare-icon-check">✓</span> Webinars e mentorias coletivas ao vivo
              </li>
            </ul>

            <Link to="/login" className="plan-btn gold" id="btn-choose-premium">
              Assinar Premium
            </Link>
          </div>

          {/* Enterprise Plan Card */}
          <div className="plan-card" id="pricing-card-enterprise">
            <div className="plan-header">
              <h3 className="plan-name">Corporativo</h3>
              <div className="plan-price-box">
                <span className="plan-price" style={{ fontSize: '2.2rem' }}>Sob Consulta</span>
              </div>
              <span className="plan-period">soluções sob medida</span>
            </div>
            <p className="plan-desc">
              Para empresas que buscam treinar equipes de tecnologia com trilhas personalizadas e acompanhamento analítico.
            </p>

            <ul className="plan-features-list">
              <li className="plan-feature-item">
                <span className="compare-icon-check">✓</span> Licenças corporativas em lote flexíveis
              </li>
              <li className="plan-feature-item">
                <span className="compare-icon-check">✓</span> Painel de KPI administrativo para gestores
              </li>
              <li className="plan-feature-item">
                <span className="compare-icon-check">✓</span> Trilhas de aprendizagem customizadas
              </li>
              <li className="plan-feature-item">
                <span className="compare-icon-check">✓</span> Gerente de conta dedicado (Customer Success)
              </li>
              <li className="plan-feature-item">
                <span className="compare-icon-check">✓</span> Integração via API / LMS
              </li>
            </ul>

            <Link to="/login" className="plan-btn primary" id="btn-choose-enterprise">
              Falar com Consultor
            </Link>
          </div>

        </div>

        {/* Feature Comparison Table */}
        <section className="plans-compare-section" id="compare-table-section">
          <h2 className="compare-title">Compare os Recursos</h2>

          <table className="compare-table" id="compare-plans-table">
            <thead>
              <tr>
                <th>Recursos / Benefícios</th>
                <th style={{ width: '20%' }}>Gratuito</th>
                <th style={{ width: '20%', color: 'var(--gold)' }}>Premium</th>
                <th style={{ width: '20%' }}>Corporativo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cursos inclusos</td>
                <td>Apenas básicos</td>
                <td>Catálogo completo</td>
                <td>Catálogo completo</td>
              </tr>
              <tr>
                <td>Certificado autenticado</td>
                <td className="compare-icon-check">✓</td>
                <td className="compare-icon-check">✓ (Blockchain)</td>
                <td className="compare-icon-check">✓ (Customizado)</td>
              </tr>
              <tr>
                <td>Suporte e fóruns</td>
                <td>Comunidade geral</td>
                <td>Chat direto com instrutor</td>
                <td>SLA dedicado de suporte</td>
              </tr>
              <tr>
                <td>Downloads de códigos e materiais</td>
                <td className="compare-icon-dash">—</td>
                <td className="compare-icon-check">✓</td>
                <td className="compare-icon-check">✓</td>
              </tr>
              <tr>
                <td>Painel de progresso da equipe</td>
                <td className="compare-icon-dash">—</td>
                <td className="compare-icon-dash">—</td>
                <td className="compare-icon-check">✓</td>
              </tr>
              <tr>
                <td>Webinars e encontros ao vivo</td>
                <td className="compare-icon-dash">—</td>
                <td className="compare-icon-check">✓</td>
                <td className="compare-icon-check">✓</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* FAQ Section */}
        <section className="faq-section" id="faq-accordions-section">
          <h2 className="faq-title">Perguntas Frequentes</h2>

          <div className="faq-grid" id="faq-grid-container">
            <div className="faq-item" id="faq-item-1">
              <h4 className="faq-question">Como funciona a renovação e cancelamento?</h4>
              <p className="faq-answer">
                A renovação da assinatura Premium é automática mensalmente. Você pode cancelar sua assinatura a qualquer momento pela página de configurações do aluno, sem qualquer tipo de multa ou burocracia.
              </p>
            </div>

            <div className="faq-item" id="faq-item-2">
              <h4 className="faq-question">Quais as formas de pagamento aceitas?</h4>
              <p className="faq-answer">
                Aceitamos pagamentos via Cartão de Crédito (com aprovação instantânea), Pix e Boleto Bancário. No boleto bancário, a liberação de acesso ocorre em até 2 dias úteis após a compensação.
              </p>
            </div>

            <div className="faq-item" id="faq-item-3">
              <h4 className="faq-question">Os certificados são aceitos no mercado?</h4>
              <p className="faq-answer">
                Sim! Todos os nossos certificados possuem código hash único que pode ser validado publicamente. O plano Premium oferece ainda um selo emitido na blockchain para maior segurança e portabilidade no seu LinkedIn.
              </p>
            </div>

            <div className="faq-item" id="faq-item-4">
              <h4 className="faq-question">Posso migrar do plano Grátis para o Premium a qualquer momento?</h4>
              <p className="faq-answer">
                Com certeza! A qualquer instante você pode realizar o upgrade da sua conta para o plano Premium diretamente no seu painel de aluno para desbloquear todas as trilhas e materiais.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer id="plans-footer">
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

export default PublicPlansPage
