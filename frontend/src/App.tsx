import { Link, NavLink, Route, Routes } from 'react-router-dom'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import './App.css'
import { authConfig, loginRequest } from './authConfig'
import { About, PublicHome } from './pages/PublicHome'
import { Admin, Dashboard } from './pages/Dashboard'
import { AccessDenied, RequireAuth } from './routes/RequireAuth'
import { RequireRole } from './routes/RequireRole'

const App = () => {
  const isAuthenticated = useIsAuthenticated()
  const { instance } = useMsal()

  return (
    <main className="shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark">B2C</span>
          <span>Access layer</span>
        </Link>
        <nav className="navigation" aria-label="Main navigation">
          <NavLink to="/about">About</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/admin">Admin</NavLink>
          {isAuthenticated ? (
            <button className="button secondary" onClick={() => void instance.logoutRedirect()}>
              Sign out
            </button>
          ) : (
            <button
              className="button"
              disabled={!authConfig.isConfigured}
              onClick={() => void instance.loginRedirect(loginRequest)}
            >
              Login / Sign up
            </button>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<PublicHome />} />
        <Route path="/about" element={<About />} />
        <Route path="/login-required" element={<RequireAuth />} />
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route element={<RequireRole role="Admin" />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<PublicHome />} />
      </Routes>

      <footer>
        <span>Configuration lives in environment variables.</span>
        <span>{isAuthenticated ? 'Authenticated session' : 'Public session'}</span>
      </footer>
    </main>
  )
}

export default App
