// src/app/(shop)/account/settings/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { User, Bell, Shield, Globe, Save, Trash2, AlertTriangle, Image } from 'lucide-react'
import Link from 'next/link'
import './settings.css'

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    redirect('/')
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Configuración</h1>
        <p className="settings-subtitle">Gestiona tu cuenta y preferencias</p>
      </div>

      <div className="settings-grid">
        {/* Perfil */}
        <Card className="settings-card">
          <CardHeader className="settings-card-header">
            <div className="settings-card-icon">
              <User className="icon" />
            </div>
            <div>
              <CardTitle className="settings-card-title">Perfil</CardTitle>
              <CardDescription className="settings-card-description">
                Actualiza tu información personal
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="settings-card-content">
            <div className="settings-field">
              <Label htmlFor="name" className="settings-field-label">Nombre</Label>
              <Input
                id="name"
                defaultValue={user.name || ''}
                placeholder="Tu nombre"
                className="settings-field-input"
              />
            </div>
            <div className="settings-field">
              <Label htmlFor="email" className="settings-field-label">Email</Label>
              <Input
                id="email"
                defaultValue={user.email || ''}
                disabled
                className="settings-field-input settings-field-input-disabled"
              />
              <p className="settings-field-hint">El email no se puede cambiar</p>
            </div>
            <div className="settings-field">
              <Label htmlFor="avatar" className="settings-field-label">
                <div className="settings-field-label-with-icon">
                  <Image className="w-4 h-4" />
                  Avatar (URL)
                </div>
              </Label>
              <Input
                id="avatar"
                defaultValue={user.image || ''}
                placeholder="https://ejemplo.com/avatar.jpg"
                className="settings-field-input"
              />
              <p className="settings-field-hint">Introduce la URL de tu imagen de perfil</p>
            </div>
            <Button className="settings-btn-primary">
              <Save className="btn-icon" />
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card className="settings-card">
          <CardHeader className="settings-card-header">
            <div className="settings-card-icon">
              <Bell className="icon" />
            </div>
            <div>
              <CardTitle className="settings-card-title">Notificaciones</CardTitle>
              <CardDescription className="settings-card-description">
                Configura tus preferencias de notificación
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="settings-card-content">
            <div className="settings-toggle">
              <div className="settings-toggle-info">
                <span className="settings-toggle-label">Email de pedidos</span>
                <span className="settings-toggle-description">Recibe confirmaciones de tus pedidos</span>
              </div>
              <Switch defaultChecked className="settings-toggle-switch" />
            </div>
            <Separator className="settings-separator" />
            <div className="settings-toggle">
              <div className="settings-toggle-info">
                <span className="settings-toggle-label">Ofertas y promociones</span>
                <span className="settings-toggle-description">Recibe ofertas exclusivas</span>
              </div>
              <Switch className="settings-toggle-switch" />
            </div>
            <Separator className="settings-separator" />
            <div className="settings-toggle">
              <div className="settings-toggle-info">
                <span className="settings-toggle-label">Novedades de colecciones</span>
                <span className="settings-toggle-description">Recibe información de nuevas colecciones</span>
              </div>
              <Switch defaultChecked className="settings-toggle-switch" />
            </div>
            <Button variant="outline" className="settings-btn-outline">
              <Save className="btn-icon" />
              Guardar Preferencias
            </Button>
          </CardContent>
        </Card>

        {/* Preferencias de Idioma */}
        <Card className="settings-card">
          <CardHeader className="settings-card-header">
            <div className="settings-card-icon">
              <Globe className="icon" />
            </div>
            <div>
              <CardTitle className="settings-card-title">Idioma y Región</CardTitle>
              <CardDescription className="settings-card-description">
                Configura tu idioma y región
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="settings-card-content">
            <div className="settings-field">
              <Label htmlFor="language" className="settings-field-label">Idioma</Label>
              <select id="language" className="settings-field-select">
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
            <div className="settings-field">
              <Label htmlFor="currency" className="settings-field-label">Moneda</Label>
              <select id="currency" className="settings-field-select">
                <option value="EUR">EUR - €</option>
                <option value="USD">USD - $</option>
                <option value="GBP">GBP - £</option>
              </select>
            </div>
            <Button variant="outline" className="settings-btn-outline">
              <Save className="btn-icon" />
              Guardar Preferencias
            </Button>
          </CardContent>
        </Card>

        {/* Seguridad */}
        <Card className="settings-card settings-card-full">
          <CardHeader className="settings-card-header">
            <div className="settings-card-icon">
              <Shield className="icon" />
            </div>
            <div>
              <CardTitle className="settings-card-title">Seguridad</CardTitle>
              <CardDescription className="settings-card-description">
                Gestiona la seguridad de tu cuenta
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="settings-card-content">
            <div className="settings-security-grid">
              <div className="settings-security-item">
                <div>
                  <p className="settings-security-title">Cambiar Contraseña</p>
                  <p className="settings-security-description">Actualiza tu contraseña regularmente</p>
                </div>
                <Button variant="outline" className="settings-btn-outline-sm">Cambiar</Button>
              </div>
              <Separator className="settings-separator" />
              <div className="settings-security-item">
                <div>
                  <p className="settings-security-title">Autenticación de Dos Factores</p>
                  <p className="settings-security-description">Añade una capa extra de seguridad</p>
                </div>
                <Button variant="outline" className="settings-btn-outline-sm">Configurar</Button>
              </div>
              <Separator className="settings-separator" />
              <div className="settings-security-item">
                <div>
                  <p className="settings-security-title">Sesiones Activas</p>
                  <p className="settings-security-description">Gestiona tus sesiones activas</p>
                </div>
                <Button variant="outline" className="settings-btn-outline-sm">Ver</Button>
              </div>
            </div>
            <div className="settings-danger-zone">
              <div className="settings-danger-zone-header">
                <AlertTriangle className="settings-danger-zone-icon" />
                <div>
                  <h4 className="settings-danger-zone-title">Zona de Peligro</h4>
                  <p className="settings-danger-zone-description">
                    Acciones irreversibles. Ten cuidado con estas operaciones.
                  </p>
                </div>
              </div>
              <div className="settings-danger-zone-item">
                <div>
                  <p className="settings-danger-zone-item-title">Eliminar Cuenta</p>
                  <p className="settings-danger-zone-item-description">
                    Esta acción eliminará permanentemente tu cuenta y todos tus datos.
                  </p>
                </div>
                <Button variant="destructive" className="settings-btn-danger">
                  <Trash2 className="btn-icon" />
                  Eliminar Cuenta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}