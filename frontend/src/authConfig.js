import { LogLevel } from '@azure/msal-browser'

const tenantName = import.meta.env.VITE_B2C_TENANT_NAME
const tenantDomain = import.meta.env.VITE_B2C_TENANT_DOMAIN
const policy = import.meta.env.VITE_B2C_SIGNUP_SIGNIN_POLICY
const authority = tenantName && policy
  ? `https://${tenantName}.b2clogin.com/${tenantDomain}/${policy}`
  : 'https://login.microsoftonline.com/common'

export const apiScope = import.meta.env.VITE_API_SCOPE || ''

export const authConfig = {
  clientId: import.meta.env.VITE_B2C_CLIENT_ID || '00000000-0000-0000-0000-000000000000',
  authority,
  knownAuthorities: tenantName ? [`${tenantName}.b2clogin.com`] : [],
  redirectUri: window.location.origin,
  postLogoutRedirectUri: window.location.origin,
  isConfigured: Boolean(
    tenantName && tenantDomain && policy && import.meta.env.VITE_B2C_CLIENT_ID,
  ),
}

export const msalConfig = {
  auth: authConfig,
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (!containsPii && level === LogLevel.Error) console.error(message)
      },
    },
  },
}

export const loginRequest = apiScope ? { scopes: [apiScope] } : { scopes: [] }
