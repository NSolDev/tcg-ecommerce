// src/app/admin/sets/new/page.tsx
import { prisma } from '@/lib/db/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import './new-set.css'

export default async function NewSetPage() {
  // Aquí iría la lógica para crear una nueva colección
  // Por ahora solo mostramos el formulario

  return (
    <div className="new-set-page">
      <div className="new-set-header">
        <Link href="/admin/sets" className="new-set-back">
          <ArrowLeft className="h-4 w-4" />
          Volver a colecciones
        </Link>
        <h1 className="new-set-title">Nueva Colección</h1>
        <p className="new-set-subtitle">Crea una nueva colección de cartas</p>
      </div>

      <Card className="new-set-card">
        <CardHeader className="new-set-card-header">
          <CardTitle className="new-set-card-title">Información de la Colección</CardTitle>
        </CardHeader>
        <CardContent className="new-set-card-content">
          <form className="new-set-form">
            <div className="new-set-field">
              <Label htmlFor="name" className="new-set-label">Nombre</Label>
              <Input
                id="name"
                placeholder="Ej: Evoluciones Prismáticas"
                className="new-set-input"
              />
            </div>
            <div className="new-set-field">
              <Label htmlFor="releaseDate" className="new-set-label">Fecha de Lanzamiento</Label>
              <Input
                id="releaseDate"
                type="date"
                className="new-set-input"
              />
            </div>
            <div className="new-set-field">
              <Label htmlFor="logoUrl" className="new-set-label">URL del Logo</Label>
              <Input
                id="logoUrl"
                placeholder="https://ejemplo.com/logo.png"
                className="new-set-input"
              />
            </div>
            <div className="new-set-actions">
              <Button asChild variant="outline" className="new-set-btn-cancel">
                <Link href="/admin/sets">Cancelar</Link>
              </Button>
              <Button type="submit" className="new-set-btn-submit">
                Crear Colección
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}