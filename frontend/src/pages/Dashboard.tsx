import { useEffect, useState } from 'react'
import { InteractionRequiredAuthError } from '@azure/msal-browser'
import { useMsal } from '@azure/msal-react'
import { apiScope, loginRequest } from '../authConfig'
import { callApi, type ProfileResponse } from '../api'

export const Dashboard = () => {
  const { instance, accounts } = useMsal()
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    void callApi<ProfileResponse>('/api/profile', accounts[0], instance)
      .then(setProfile)
      .catch(async (requestError: unknown) => {
        if (requestError instanceof InteractionRequiredAuthError && apiScope) {
          await instance.acquireTokenRedirect(loginRequest)
          return
        }
        setError(requestError instanceof Error ? requestError.message : 'Unable to load profile.')
      })
  }, [accounts, instance])

  return (
    <section className="route-message">
      <p className="eyebrow">Private page</p>
      <h1>Your dashboard.</h1>
      <p>
        This route is protected by the React route guard and the API requires a bearer token plus
        scope.
      </p>
      {error && <div className="error">{error}</div>}
      <pre>{profile ? JSON.stringify(profile, null, 2) : 'Loading protected profile...'}</pre>
    </section>
  )
}

export const Admin = () => {
  return (
    <section className="route-message">
      <p className="eyebrow">Admin role</p>
      <h1>Role-protected page.</h1>
      <p>
        You have the <code>Admin</code> application role required for this route.
      </p>
    </section>
  )
}
