// src/app/not-found.tsx
import Link from 'next/link'
import { Home, ArrowLeft, Sparkles } from 'lucide-react'
import './not-found.css'

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">
          <Sparkles className="w-16 h-16" />
        </div>
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Página no encontrada</h2>
        <p className="not-found-description">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div className="not-found-actions">
          <Link href="/" className="not-found-button-primary">
            <Home className="w-4 h-4" />
            Volver al inicio
          </Link>
          <button
            onClick={() => window.history.back()}
            className="not-found-button-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  )
}