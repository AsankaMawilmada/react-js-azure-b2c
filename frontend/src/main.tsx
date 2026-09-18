import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { msalConfig } from './authConfig'

const msalInstance = new PublicClientApplication(msalConfig)

const bootstrap = async (): Promise<void> => {
  await msalInstance.initialize()
  await msalInstance.handleRedirectPromise()
  const root = document.getElementById('root')

  if (!root) throw new Error('The application root element was not found.')

  createRoot(root).render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MsalProvider>
    </StrictMode>,
  )
}

void bootstrap()
