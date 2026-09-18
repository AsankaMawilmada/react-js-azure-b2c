import { apiScope } from './authConfig'

export async function callApi(path, account, instance) {
  const request = apiScope ? { account, scopes: [apiScope] } : null
  const result = request ? await instance.acquireTokenSilent(request) : null
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://localhost:7001'}${path}`, {
    headers: result ? { Authorization: `Bearer ${result.accessToken}` } : {},
  })

  if (!response.ok) throw new Error(`API request failed with status ${response.status}`)
  return response.json()
}
