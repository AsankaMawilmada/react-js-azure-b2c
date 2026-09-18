import { useEffect, useState } from 'react'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { InteractionRequiredAuthError } from '@azure/msal-browser'
import './App.css'
import { authConfig, loginRequest } from './authConfig'
import { callApi } from './api'

function App() {
  const { instance, accounts } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const [publicResult, setPublicResult] = useState(null)
  const [profileResult, setProfileResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    callApi('/api/public').then(setPublicResult).catch((requestError) => setError(requestError.message))
  }, [])

  async function signIn() {
    setError('')
    await instance.loginRedirect(loginRequest)
  }

  async function signOut() {
    await instance.logoutRedirect()
  }

  async function loadProtectedProfile() {
    setError('')
    try {
      const result = await callApi('/api/profile', accounts[0], instance)
      setProfileResult(result)
    } catch (requestError) {
      if (requestError instanceof InteractionRequiredAuthError) {
        await instance.acquireTokenRedirect(loginRequest)
        return
      }
      setError(requestError.message)
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">B2C</span><span>Access layer</span></div>
        {isAuthenticated ? <button className="button secondary" onClick={signOut}>Sign out</button> : <button className="button" onClick={signIn} disabled={!authConfig.isConfigured}>Sign in</button>}
      </header>

      <section className="intro">
        <p className="eyebrow">React + ASP.NET Core</p>
        <h1>Two doors. One trusted identity.</h1>
        <p className="lede">A working reference for splitting public and protected experiences while Azure B2C handles the identity boundary.</p>
        {!authConfig.isConfigured && <div className="notice">Add values from <code>.env.example</code> to enable Azure B2C sign-in.</div>}
      </section>

      <section className="grid">
        <article className="panel public-panel">
          <div className="panel-heading"><span className="status-dot open" /><span>Public endpoint</span><span className="tag">anonymous</span></div>
          <h2>Open by default</h2>
          <p>Available to every visitor. The API marks this controller with <code>[AllowAnonymous]</code>.</p>
          <pre>{publicResult ? JSON.stringify(publicResult, null, 2) : 'Loading response...'}</pre>
        </article>

        <article className="panel protected-panel">
          <div className="panel-heading"><span className="status-dot locked" /><span>Protected endpoint</span><span className="tag">access_as_user</span></div>
          <h2>Identity required</h2>
          <p>Requires a B2C access token with the API scope <code>access_as_user</code>.</p>
          {!isAuthenticated ? <button className="button" onClick={signIn} disabled={!authConfig.isConfigured}>Sign in to continue</button> : <button className="button" onClick={loadProtectedProfile}>Call protected API</button>}
          {profileResult && <pre>{JSON.stringify(profileResult, null, 2)}</pre>}
        </article>
      </section>

      {error && <div className="error">{error}</div>}
      <footer><span>Configuration lives in environment variables.</span><span>{isAuthenticated ? `Signed in as ${accounts[0]?.username}` : 'Session not authenticated'}</span></footer>
    </main>
  )
}

export default App
