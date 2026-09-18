import type { AccountInfo, IPublicClientApplication } from '@azure/msal-browser'
import { apiScope } from './authConfig'

export interface PublicResponse {
  message: string
  serverTime: string
}

export interface ProfileResponse {
  message: string
  name?: string
  subject?: string
  scopes: string[]
}

export const callApi = async <T>(
  path: string,
  account?: AccountInfo,
  instance?: IPublicClientApplication,
): Promise<T> => {
  const result =
    apiScope && account && instance
      ? await instance.acquireTokenSilent({ account, scopes: [apiScope] })
      : null
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL || 'https://localhost:7001'}${path}`,
    {
      headers: result ? { Authorization: `Bearer ${result.accessToken}` } : {},
    },
  )

  if (!response.ok) throw new Error(`API request failed with status ${response.status}`)
  return response.json() as Promise<T>
}
