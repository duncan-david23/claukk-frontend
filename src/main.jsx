import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { InvoiceProvider } from './contexts/InvoiceContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'


createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <InvoiceProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </InvoiceProvider>
  </AuthProvider>
)
