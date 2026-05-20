import React from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader'
import StatCard from '../../components/StatCard'

function DashboardPage() {
  const triggerToast = useOutletContext()

  const headerActions = (
    <>
      <Link to="/admin/courses" className="btn-action secondary">+ Novo Curso</Link>
      <Link to="/admin/users" className="btn-action primary">+ Novo Usuário</Link>
    </>
  )

  return (
    <>
      <AdminHeader 
        title="Dashboard" 
        subtitle="Bem-vindo de volta. Aqui está o resumo de hoje — 30 de abril de 2026." 
        actions={headerActions}
        onShowToast={triggerToast}
      />

      <div className="page-content">
        {/* STATS */}
        <div className="stats-grid">
          <StatCard 
            change="↑ 8,2%" 
            icon="👥" 
            iconColor="teal" 
            value="12.483" 
            label="Total de Alunos" 
            delay="0.05s"
          />
          <StatCard 
            change="↑ 3" 
            icon="🎓" 
            iconColor="gold" 
            value="384" 
            label="Cursos Ativos" 
            delay="0.1s"
          />
          <StatCard 
            change="↑ 12,5%" 
            icon="💰" 
            iconColor="accent" 
            value="R$ 94,2k" 
            label="Receita Mensal" 
            delay="0.15s"
          />
          <StatCard 
            change="↑ 210" 
            icon="🏅" 
            iconColor="red" 
            value="38.710" 
            label="Certificados Emitidos" 
            delay="0.2s"
          />
        </div>

        {/* TWO COLUMNS: TABLE + TOP COURSES */}
        <div className="grid-2">
          {/* Recent Registrations */}
          <div className="card" style={{ animationDelay: '0.25s' }}>
            <div className="card-header">
              <span className="card-title">Cadastros Recentes</span>
              <Link to="/admin/users" className="card-link">Ver todos →</Link>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Usuário</th>
                    <th>Plano</th>
                    <th>Status</th>
                    <th>Cadastro</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar" style={{ background: 'var(--teal)' }}>CM</div>
                        <div>
                          <div className="user-name">Carla Mendes</div>
                          <div className="user-email">carla@email.com</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge premium">Premium</span></td>
                    <td><span className="badge ativo">Ativo</span></td>
                    <td>30 abr 2026</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar" style={{ background: 'var(--gold)' }}>RP</div>
                        <div>
                          <div className="user-name">Rafael Porto</div>
                          <div className="user-email">rafael@email.com</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge gratuito">Gratuito</span></td>
                    <td><span className="badge ativo">Ativo</span></td>
                    <td>29 abr 2026</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar" style={{ background: 'var(--accent)' }}>LS</div>
                        <div>
                          <div className="user-name">Lara Souza</div>
                          <div className="user-email">lara@email.com</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge premium">Premium</span></td>
                    <td><span className="badge ativo">Ativo</span></td>
                    <td>28 abr 2026</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar" style={{ background: '#e67e22' }}>JM</div>
                        <div>
                          <div className="user-name">João Mota</div>
                          <div className="user-email">joao@email.com</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge gratuito">Gratuito</span></td>
                    <td><span className="badge inativo">Inativo</span></td>
                    <td>27 abr 2026</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar" style={{ background: '#2980b9' }}>AS</div>
                        <div>
                          <div className="user-name">Ana Silva</div>
                          <div className="user-email">ana@email.com</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge premium">Premium</span></td>
                    <td><span className="badge ativo">Ativo</span></td>
                    <td>26 abr 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Courses */}
          <div className="card" style={{ animationDelay: '0.25s' }}>
            <div className="card-header">
              <span className="card-title">Top Cursos</span>
              <Link to="/admin/courses" className="card-link">Ver todos →</Link>
            </div>
            
            <div className="course-item">
              <div className="course-rank">1</div>
              <div className="course-thumb-sm" style={{ background: '#e8f5f0' }}>📐</div>
              <div className="course-info-sm">
                <div className="course-name-sm">UX Design Avançado</div>
                <div className="course-meta-sm">4,9 ★ · 14 módulos</div>
              </div>
              <div className="course-students">3.240</div>
            </div>

            <div className="course-item">
              <div className="course-rank">2</div>
              <div className="course-thumb-sm" style={{ background: '#fef3e2' }}>⚙️</div>
              <div className="course-info-sm">
                <div className="course-name-sm">APIs com Spring Boot</div>
                <div className="course-meta-sm">4,8 ★ · 22 módulos</div>
              </div>
              <div className="course-students">2.980</div>
            </div>

            <div className="course-item">
              <div className="course-rank">3</div>
              <div className="course-thumb-sm" style={{ background: '#f0eeff' }}>🎯</div>
              <div className="course-info-sm">
                <div className="course-name-sm">Gestão Ágil de Projetos</div>
                <div className="course-meta-sm">4,7 ★ · 8 módulos</div>
              </div>
              <div className="course-students">2.541</div>
            </div>

            <div className="course-item">
              <div className="course-rank">4</div>
              <div className="course-thumb-sm" style={{ background: '#fde8e8' }}>🐍</div>
              <div className="course-info-sm">
                <div className="course-name-sm">Python para Dados</div>
                <div className="course-meta-sm">4,9 ★ · 18 módulos</div>
              </div>
              <div className="course-students">2.310</div>
            </div>

            <div className="course-item">
              <div className="course-rank">5</div>
              <div className="course-thumb-sm" style={{ background: '#e8f0fe' }}>📱</div>
              <div className="course-info-sm">
                <div className="course-name-sm">React Native Completo</div>
                <div className="course-meta-sm">4,6 ★ · 20 módulos</div>
              </div>
              <div className="course-students">1.875</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardPage
