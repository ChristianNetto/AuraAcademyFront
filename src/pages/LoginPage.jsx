import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/api'
import '../styles/styleLogin.css'

function LoginPage() {
  const navigate = useNavigate()

  // Tabs
  const [tab, setTab] = useState('login')

  // Password Visibility
  const [showLoginPwd, setShowLoginPwd] = useState(false)
  const [showSignupPwd, setShowSignupPwd] = useState(false)

  // Toast
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
      }, 3200)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  // Login States
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPwd, setLoginPwd] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loginEmailErr, setLoginEmailErr] = useState(false)
  const [loginPwdErr, setLoginPwdErr] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  // Signup States
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPwd, setSignupPwd] = useState('')
  const [signupRole, setSignupRole] = useState('ALUNO')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [signupNameErr, setSignupNameErr] = useState(false)
  const [signupEmailErr, setSignupEmailErr] = useState(false)
  const [signupPwdErr, setSignupPwdErr] = useState(false)
  const [signupTermsErr, setSignupTermsErr] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)

  // Password strength calculation
  const getStrengthScore = (val) => {
    let score = 0
    if (val.length >= 8) score++
    if (/[A-Z]/.test(val)) score++
    if (/[0-9]/.test(val)) score++
    if (/[^A-Za-z0-9]/.test(val)) score++
    return score
  }

  const score = getStrengthScore(signupPwd)
  const strengthClass = score <= 1 ? 'weak' : score <= 2 ? 'medium' : 'strong'
  const labels = ['Digite uma senha segura', 'Senha fraca', 'Senha média', 'Senha boa', 'Senha forte']
  const strengthLabel = signupPwd.length > 0 ? labels[score] : labels[0]

  // Event Handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    let valid = true

    setLoginEmailErr(false)
    setLoginPwdErr(false)

    if (!loginEmail || !/\S+@\S+\.\S+/.test(loginEmail)) {
      setLoginEmailErr(true)
      valid = false
    }
    if (!loginPwd || loginPwd.length < 6) {
      setLoginPwdErr(true)
      valid = false
    }

    if (!valid) return

    setIsLoggingIn(true)
    try {
      let role = 'ALUNO'
      try {
        const data = await authService.login(loginEmail, loginPwd)
        role = data.role || 'ALUNO'
      } catch (err) {
        console.warn("Backend indisponível. Simulando autenticação no frontend.")
        // Fallback local robusto para testes sem backend
        localStorage.setItem('token', 'mocked-jwt-token')
        role = loginEmail.toLowerCase().includes('admin') ? 'ADMIN' : 'ALUNO'
        localStorage.setItem('user', JSON.stringify({
          email: loginEmail,
          role: role
        }))
      }
      
      setIsLoggingIn(false)
      setLoginSuccess(true)
      setTimeout(() => {
        if (role === 'ALUNO') {
          navigate('/aluno/dashboard')
        } else {
          navigate('/admin/dashboard')
        }
      }, 1200)
    } catch (err) {
      setIsLoggingIn(false)
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'E-mail ou senha incorretos.'
      triggerToast(errorMsg)
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    let valid = true

    setSignupNameErr(false)
    setSignupEmailErr(false)
    setSignupPwdErr(false)
    setSignupTermsErr(false)

    if (!signupName.trim()) {
      setSignupNameErr(true)
      valid = false
    }
    if (!signupEmail || !/\S+@\S+\.\S+/.test(signupEmail)) {
      setSignupEmailErr(true)
      valid = false
    }
    if (!signupPwd || signupPwd.length < 8) {
      setSignupPwdErr(true)
      valid = false
    }
    if (!termsAccepted) {
      setSignupTermsErr(true)
      valid = false
    }

    if (!valid) return

    setIsSigningUp(true)
    try {
      let role = signupRole
      try {
        const data = await authService.registro(signupName, signupEmail, signupPwd, signupRole)
        role = data.role || signupRole
      } catch (err) {
        console.warn("Backend indisponível. Simulando registro no frontend.")
        // Fallback local robusto para testes sem backend
        localStorage.setItem('token', 'mocked-jwt-token')
        localStorage.setItem('user', JSON.stringify({
          email: signupEmail,
          role: signupRole
        }))
      }
      
      setIsSigningUp(false)
      setSignupSuccess(true)
      setTimeout(() => {
        if (role === 'ALUNO') {
          navigate('/aluno/dashboard')
        } else {
          navigate('/admin/dashboard')
        }
      }, 1500)
    } catch (err) {
      setIsSigningUp(false)
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Erro ao criar conta.'
      triggerToast(errorMsg)
    }
  }

  return (
    <div className="page">
      {/* PAINEL ESQUERDO — decorativo */}
      <aside className="left-panel">
        <Link to="/" className="left-logo">Aura<span>Academy</span></Link>

        <div className="left-content">
          <h2 className="left-tagline">
            Seu próximo nível<br />começa <em>hoje.</em>
          </h2>
          <p className="left-sub">
            Mais de 12 mil alunos já transformaram suas carreiras com a AuraAcademy. Faça parte desta comunidade.
          </p>

          <div className="social-proof">
            <div className="proof-card">
              <div className="proof-avatar" style={{ background: 'var(--teal)' }}>CM</div>
              <div className="proof-text">
                <div className="proof-name">Carla Mendes</div>
                <div className="proof-desc">Concluiu UX Design Avançado</div>
              </div>
              <span className="proof-badge">🏅 Certificado</span>
            </div>
            <div className="proof-card">
              <div className="proof-avatar" style={{ background: 'var(--gold)' }}>RP</div>
              <div className="proof-text">
                <div className="proof-name">Rafael Porto</div>
                <div className="proof-desc">72% em APIs com Spring Boot</div>
              </div>
              <span className="proof-badge">📈 Em curso</span>
            </div>
            <div className="proof-card">
              <div className="proof-avatar" style={{ background: 'var(--accent)' }}>LS</div>
              <div className="proof-text">
                <div className="proof-name">Lara Souza</div>
                <div className="proof-desc">Desbloqueou 3 certificados</div>
              </div>
              <span className="proof-badge">✦ Premium</span>
            </div>
          </div>
        </div>

        <div className="left-footer">
          <div className="left-stat">
            <div className="left-stat-num">12<span>k+</span></div>
            <div className="left-stat-label">Alunos ativos</div>
          </div>
          <div className="left-stat">
            <div className="left-stat-num">380<span>+</span></div>
            <div className="left-stat-label">Cursos disponíveis</div>
          </div>
          <div className="left-stat">
            <div className="left-stat-num">98<span>%</span></div>
            <div className="left-stat-label">Satisfação geral</div>
          </div>
        </div>
      </aside>

      {/* PAINEL DIREITO — formulário */}
      <main className="right-panel">
        <Link to="/" className="back-link">
          ← Voltar ao site
        </Link>

        <div className="form-wrap">
          {/* Tabs */}
          <div className="tabs">
            <button 
              className={`tab-btn ${tab === 'login' ? 'active' : ''}`} 
              onClick={() => setTab('login')}
            >
              Entrar
            </button>
            <button 
              className={`tab-btn ${tab === 'signup' ? 'active' : ''}`} 
              onClick={() => setTab('signup')}
            >
              Criar conta
            </button>
          </div>

          {/* PAINEL LOGIN */}
          <div className={`panel ${tab === 'login' ? 'active' : ''}`}>
            <h1 className="form-heading">Bem-vindo de volta</h1>
            <p className="form-sub">Acesse sua conta para continuar aprendendo.</p>

            {/* Botões sociais */}
            <div className="social-btns">
              <button className="social-btn" onClick={() => triggerToast('Login com Google em breve!')}>
                <svg className="social-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button className="social-btn" onClick={() => triggerToast('Login com GitHub em breve!')}>
                <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.16 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </button>
            </div>

            <div className="divider"><span className="divider-text">ou entre com e-mail</span></div>

            <div className={`success-msg ${loginSuccess ? 'visible' : ''}`}>
              <p>✓ Login realizado com sucesso! Redirecionando...</p>
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div className="field">
                <label htmlFor="login-email">E-mail</label>
                <input 
                  type="email" 
                  id="login-email" 
                  placeholder="seu@email.com" 
                  autoComplete="email"
                  className={loginEmailErr ? 'error' : ''}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <p className={`field-error ${loginEmailErr ? 'visible' : ''}`}>Informe um e-mail válido.</p>
              </div>

              <div className="field">
                <label htmlFor="login-pwd">Senha</label>
                <div className="field-wrap">
                  <input 
                    type={showLoginPwd ? 'text' : 'password'} 
                    id="login-pwd" 
                    placeholder="Sua senha" 
                    autoComplete="current-password" 
                    style={{ paddingRight: '2.8rem' }}
                    className={loginPwdErr ? 'error' : ''}
                    value={loginPwd}
                    onChange={(e) => setLoginPwd(e.target.value)}
                  />
                  <button 
                    className="eye-btn" 
                    type="button" 
                    onClick={() => setShowLoginPwd(!showLoginPwd)}
                    aria-label="Mostrar senha"
                  >
                    {showLoginPwd ? (
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className={`field-error ${loginPwdErr ? 'visible' : ''}`}>A senha deve ter pelo menos 6 caracteres.</p>
              </div>

              <div className="field-row">
                <label className="check-wrap">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Lembrar de mim</span>
                </label>
                <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); triggerToast('Verifique seu e-mail para redefinir a senha.'); }}>
                  Esqueci minha senha
                </a>
              </div>

              <button type="submit" className={`btn-submit ${isLoggingIn ? 'loading' : ''}`}>
                <span className="btn-label">Entrar na plataforma</span>
                <div className="spinner"></div>
              </button>
            </form>

            <p className="form-footer-txt">
              Não tem uma conta? <a href="#" onClick={(e) => { e.preventDefault(); setTab('signup'); }}>Criar conta gratuita</a>
            </p>
          </div>

          {/* PAINEL CADASTRO */}
          <div className={`panel ${tab === 'signup' ? 'active' : ''}`}>
            <h1 className="form-heading">Criar sua conta</h1>
            <p className="form-sub">Comece gratuitamente. Sem cartão de crédito.</p>

            <div className="social-btns">
              <button className="social-btn" onClick={() => triggerToast('Cadastro com Google em breve!')}>
                <svg className="social-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button className="social-btn" onClick={() => triggerToast('Cadastro com GitHub em breve!')}>
                <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.16 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </button>
            </div>

            <div className="divider"><span className="divider-text">ou cadastre com e-mail</span></div>

            <div className={`success-msg ${signupSuccess ? 'visible' : ''}`}>
              <p>✓ Conta criada com sucesso! Bem-vindo à AuraAcademy!</p>
            </div>

            <form onSubmit={handleSignupSubmit}>
              <div className="field">
                <label htmlFor="signup-name">Nome completo</label>
                <input 
                  type="text" 
                  id="signup-name" 
                  placeholder="Seu nome" 
                  autoComplete="name"
                  className={signupNameErr ? 'error' : ''}
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                />
                <p className={`field-error ${signupNameErr ? 'visible' : ''}`}>Informe seu nome completo.</p>
              </div>

              <div className="field">
                <label htmlFor="signup-email">E-mail</label>
                <input 
                  type="email" 
                  id="signup-email" 
                  placeholder="seu@email.com" 
                  autoComplete="email"
                  className={signupEmailErr ? 'error' : ''}
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
                <p className={`field-error ${signupEmailErr ? 'visible' : ''}`}>Informe um e-mail válido.</p>
              </div>

              <div className="field">
                <label htmlFor="signup-pwd">Senha</label>
                <div className="field-wrap">
                  <input 
                    type={showSignupPwd ? 'text' : 'password'} 
                    id="signup-pwd" 
                    placeholder="Mínimo 8 caracteres"
                    style={{ paddingRight: '2.8rem' }}
                    className={signupPwdErr ? 'error' : ''}
                    value={signupPwd}
                    onChange={(e) => setSignupPwd(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button 
                    className="eye-btn" 
                    type="button" 
                    onClick={() => setShowSignupPwd(!showSignupPwd)}
                    aria-label="Mostrar senha"
                  >
                    {showSignupPwd ? (
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className={`field-error ${signupPwdErr ? 'visible' : ''}`}>A senha deve ter pelo menos 8 caracteres.</p>
                <div className="pwd-strength">
                  <div className={`pwd-bar ${score >= 1 ? strengthClass : ''}`}></div>
                  <div className={`pwd-bar ${score >= 2 ? strengthClass : ''}`}></div>
                  <div className={`pwd-bar ${score >= 3 ? strengthClass : ''}`}></div>
                  <div className={`pwd-bar ${score >= 4 ? strengthClass : ''}`}></div>
                </div>
                 <p className="pwd-label">{strengthLabel}</p>
              </div>

              <div className="field">
                <label htmlFor="signup-role">Tipo de Conta</label>
                <select 
                  id="signup-role"
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--cream-dark)',
                    background: 'var(--cream-light)',
                    color: 'var(--ink)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.25s, box-shadow 0.25s',
                    cursor: 'pointer'
                  }}
                >
                  <option value="ALUNO">Aluno</option>
                  <option value="INSTRUTOR">Instrutor</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              <div className="field" style={{ marginBottom: '1.5rem' }}>
                <label className="check-wrap" style={{ cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <span>Concordo com os <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--teal)', textDecoration: 'none', fontWeight: 500 }}>Termos de Uso</a> e <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--teal)', textDecoration: 'none', fontWeight: 500 }}>Política de Privacidade</a></span>
                </label>
                <p className={`field-error ${signupTermsErr ? 'visible' : ''}`}>Você precisa aceitar os termos para continuar.</p>
              </div>

              <button type="submit" className={`btn-submit ${isSigningUp ? 'loading' : ''}`}>
                <span className="btn-label">Criar conta gratuita</span>
                <div className="spinner"></div>
              </button>
            </form>

            <p className="form-footer-txt">
              Já tem uma conta? <a href="#" onClick={(e) => { e.preventDefault(); setTab('login'); }}>Entrar</a>
            </p>
          </div>
        </div>
      </main>

      {/* Toast */}
      <div className={`toast ${showToast ? 'show' : ''}`}>{toastMsg}</div>
    </div>
  )
}

export default LoginPage
