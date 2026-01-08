import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import App from './App.jsx'

const rawGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
const googleClientId = typeof rawGoogleClientId === 'string' ? rawGoogleClientId.trim() : ''
const isGoogleConfigured =
  Boolean(googleClientId) &&
  !['GOOGLE_CLIENT_ID', 'YOUR_GOOGLE_CLIENT_ID_HERE'].includes(googleClientId)

if (!isGoogleConfigured && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    '[EMS] Google Sign-In disabled: set VITE_GOOGLE_CLIENT_ID to a real OAuth Client ID (Google Cloud Console).',
  )
}

const AppTree = (
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isGoogleConfigured ? (
      <GoogleOAuthProvider clientId={googleClientId}>{AppTree}</GoogleOAuthProvider>
    ) : (
      AppTree
    )}
  </StrictMode>,
)
