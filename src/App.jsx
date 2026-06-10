import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import PublicCoursesPage from './pages/PublicCoursesPage'
import PublicInstructorsPage from './pages/PublicInstructorsPage'
import PublicPlansPage from './pages/PublicPlansPage'
import PrivateRoute from './components/PrivateRoute'
import AdminLayout from './components/AdminLayout'
import DashboardPage from './pages/admin/DashboardPage'
import UsersPage from './pages/admin/UsersPage'
import CoursesPage from './pages/admin/CoursesPage'
import AdminPlaceholderScreen from './pages/admin/AdminPlaceholderScreen'
import StudentDashboard from './pages/student/DashboardPage'
import CoursePlayer from './pages/student/CoursePlayerPage'
import CertificateValidatePage from './pages/student/CertificateValidatePage'
import InstructorLayout from './components/InstructorLayout'
import InstructorDashboard from './pages/instructor/DashboardPage'
import CursoEditorPage from './pages/instructor/CursoEditorPage'

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cursos" element={<PublicCoursesPage />} />
        <Route path="/instrutores" element={<PublicInstructorsPage />} />
        <Route path="/planos" element={<PublicPlansPage />} />
        <Route path="/validar-certificado/:hash" element={<CertificateValidatePage />} />

        {/* Painel do Aluno */}
        <Route path="/aluno/dashboard" element={<PrivateRoute requiredRole="ALUNO"><StudentDashboard /></PrivateRoute>} />
        <Route path="/aluno/curso/:courseId" element={<PrivateRoute requiredRole="ALUNO"><CoursePlayer /></PrivateRoute>} />

        {/* Painel Administrativo */}
        <Route path="/admin" element={<PrivateRoute requiredRole="ADMIN"><AdminLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="reports" element={<AdminPlaceholderScreen title="Relatórios" subtitle="Relatórios de desempenho e métricas." />} />
          <Route path="financial" element={<AdminPlaceholderScreen title="Financeiro" subtitle="Controle financeiro, faturamento e planos." />} />
          <Route path="notifications" element={<AdminPlaceholderScreen title="Notificações" subtitle="Envio e configuração de avisos." />} />
          <Route path="settings" element={<AdminPlaceholderScreen title="Configurações" subtitle="Configurações gerais do sistema." />} />
        </Route>

        {/* Painel do Instrutor */}
        <Route path="/instrutor" element={<PrivateRoute requiredRole="INSTRUTOR"><InstructorLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="/instrutor/dashboard" replace />} />
          <Route path="dashboard" element={<InstructorDashboard />} />
          <Route path="cursos/novo" element={<CursoEditorPage />} />
          <Route path="cursos/:id" element={<CursoEditorPage />} />
        </Route>

        {/* Rota de Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
