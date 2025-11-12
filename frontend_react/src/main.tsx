import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { NguoiDungProvider } from './context/nguoidungProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NguoiDungProvider noiDungCon={
      <Router>
        <App />
      </Router>
    }/>
  </StrictMode>,
)
