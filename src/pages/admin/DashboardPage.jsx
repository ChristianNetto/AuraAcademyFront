import React from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import StatCard from '../../components/StatCard'

function DashboardPage() {
  const { users, courses } = useOutletContext()

  // Calculate dynamic stats
  const totalStudents = users.filter(u => u.role === 'Aluno').length
  const activeStudents = users.filter(u => u.rawStatus === 'ativo').length
  const premiumStudents = users.filter(u => u.rawPlan === 'premium').length
  const activeCourses = courses.filter(c => c.rawStatus === 'publicado').length

  // Take the 5 most recent registrations
  const recentUsers = users.slice(0, 5)

  // Take first 5 courses for display
  const topCoursesList = courses.slice(0, 5)

  return (
    <div className="page-content">
      {/* STATS */}
      <div className="stats-grid">
        <StatCard 
          change="↑ 8,2%" 
          icon="👥" 
          iconColor="teal" 
          value={totalStudents.toString()} 
          label="Total de Alunos" 
          delay="0.05s"
        />
        <StatCard 
          change="↑ 3" 
          icon="🎓" 
          iconColor="gold" 
          value={activeCourses.toString()} 
          label="Cursos Ativos" 
          delay="0.1s"
        />
        <StatCard 
          change="↑ 12,5%" 
          icon="💰" 
          iconColor="accent" 
          value={`R$ ${(premiumStudents * 99.9).toFixed(1)}k`} 
          label="Receita Est. (Mensal)" 
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
                {recentUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar" style={{ background: user.bg }}>{user.initials}</div>
                        <div>
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge ${user.rawPlan}`}>{user.plan}</span></td>
                    <td><span className={`badge ${user.rawStatus}`}>{user.status}</span></td>
                    <td>{user.date}</td>
                  </tr>
                ))}
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
          
          {topCoursesList.map((course, index) => (
            <div className="course-item" key={course.id}>
              <div className="course-rank">{index + 1}</div>
              <div className="course-thumb-sm" style={{ background: course.bg || '#f5f5f5' }}>{course.thumb || '🎓'}</div>
              <div className="course-info-sm">
                <div className="course-name-sm">{course.name}</div>
                <div className="course-meta-sm">{course.rating !== '—' ? `${course.rating} ★` : '— ★'} · {course.category}</div>
              </div>
              <div className="course-students">{course.students === '—' ? '0' : course.students}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
