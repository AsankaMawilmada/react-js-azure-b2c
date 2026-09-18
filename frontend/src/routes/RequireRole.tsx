import { Outlet, Navigate } from 'react-router-dom'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { AccessDenied } from './RequireAuth'

interface RequireRoleProps {
  role: string
}

interface RoleClaims {
  roles?: string[]
}

export const RequireRole = ({ role }: RequireRoleProps) => {
  const isAuthenticated = useIsAuthenticated()
  const { accounts } = useMsal()

  if (!isAuthenticated) return <Navigate to="/login-required" replace />

  const claims = accounts[0]?.idTokenClaims as RoleClaims | undefined
  if (!claims?.roles?.includes(role)) return <AccessDenied />

  return <Outlet />
}
