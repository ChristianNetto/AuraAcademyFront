import { Navigate } from 'react-router-dom'
import { authService } from '../services/api'

const roleHome = {
  ADMIN: '/admin/dashboard',
  INSTRUTOR: '/instrutor/dashboard',
  ALUNO: '/aluno/dashboard',
}

export default function PrivateRoute({ children, requiredRole }) {
  const user = authService.getCurrentUser()

  if (!authService.isAuthenticated() || !user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={roleHome[user.role] || '/login'} replace />
  }

  return children
}