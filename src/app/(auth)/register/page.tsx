// src/app/(auth)/register/page.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { registerUser } from '@/lib/actions/auth.actions'
import '../auth.css'
import './register.css'

export default function RegisterPage() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-card-header">
          <h1 className="auth-card-title">Crear Cuenta</h1>
          <p className="auth-card-description">Regístrate para comenzar a comprar</p>
        </div>

        <form action={registerUser} className="auth-form">
          <div className="auth-form-group">
            <Label htmlFor="name" className="auth-form-label">Nombre</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Tu nombre"
              required
              className="auth-form-input"
            />
          </div>
          <div className="auth-form-group">
            <Label htmlFor="email" className="auth-form-label">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
              className="auth-form-input"
            />
          </div>
          <div className="auth-form-group">
            <Label htmlFor="password" className="auth-form-label">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="auth-form-input"
            />
            <p className="register-password-hint">Mínimo 6 caracteres</p>
          </div>
          <button type="submit" className="auth-form-submit">
            Registrarse
          </button>
        </form>

        <div className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="auth-footer-link">
            Inicia Sesión
          </Link>
        </div>
      </div>
    </div>
  )
}