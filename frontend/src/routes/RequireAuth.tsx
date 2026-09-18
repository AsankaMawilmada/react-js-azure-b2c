import { Link, Outlet, useLocation } from 'react-router-dom'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { authConfig, loginRequest } from '../authConfig'

export const RequireAuth = () => {
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()
  const { instance } = useMsal()

  if (isAuthenticated) return <Outlet />

  return (
    <section className="route-message">
      <p className="eyebrow">Authentication required</p>
      <h1>Sign in to open this page.</h1>
      <p>This route is private. Azure B2C handles sign-in and sign-up before access is granted.</p>
      <button
        className="button"
        disabled={!authConfig.isConfigured}
        onClick={() =>
          void instance.loginRedirect({
            ...loginRequest,
            redirectStartPage: `${window.location.origin}${location.pathname}`,
          })
        }
      >
        Login / Sign up
      </button>
      {!authConfig.isConfigured && (
        <div className="notice">
          Configure the values in <code>.env.local</code> first.
        </div>
      )}
    </section>
  )
}

export const AccessDenied = () => {
  return (
    <section className="route-message">
      <p className="eyebrow">403 · Access denied</p>
      <h1>Your account is authenticated, but not authorized.</h1>
      <p>Ask an administrator to assign the required application role, then sign in again.</p>
      <Link className="button link-button" to="/dashboard">
        Back to dashboard
      </Link>
    </section>
  )
}
