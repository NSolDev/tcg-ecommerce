// src/app/admin/settings/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { prisma } from '@/lib/db/prisma';
import './admin-settings.css';

export default async function AdminSettingsPage() {
  const [productCount, orderCount, userCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
  ]);

  return (
    <div className="admin-settings-page">
      <div className="admin-settings-header">
        <h1 className="admin-settings-title">Configuración</h1>
        <p className="admin-settings-subtitle">Gestiona la configuración de la tienda</p>
      </div>

      <div className="admin-settings-grid">
        {/* Información General */}
        <Card className="admin-settings-card">
          <CardHeader className="admin-settings-card-header">
            <CardTitle className="admin-settings-card-title">Información General</CardTitle>
            <CardDescription className="admin-settings-card-description">
              Estadísticas y datos de la tienda
            </CardDescription>
          </CardHeader>
          <CardContent className="admin-settings-card-content">
            <div className="admin-settings-stats">
              <div className="admin-settings-stat">
                <span className="admin-settings-stat-label">Productos</span>
                <span className="admin-settings-stat-value">{productCount}</span>
              </div>
              <div className="admin-settings-stat">
                <span className="admin-settings-stat-label">Pedidos</span>
                <span className="admin-settings-stat-value">{orderCount}</span>
              </div>
              <div className="admin-settings-stat">
                <span className="admin-settings-stat-label">Usuarios</span>
                <span className="admin-settings-stat-value">{userCount}</span>
              </div>
            </div>
            <Separator className="admin-settings-separator" />
            <div className="admin-settings-version">
              <span className="admin-settings-version-label">Versión</span>
              <span className="admin-settings-version-value">v1.0.0</span>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de la Tienda */}
        <Card className="admin-settings-card">
          <CardHeader className="admin-settings-card-header">
            <CardTitle className="admin-settings-card-title">Configuración de la Tienda</CardTitle>
            <CardDescription className="admin-settings-card-description">
              Ajusta la configuración básica de la tienda
            </CardDescription>
          </CardHeader>
          <CardContent className="admin-settings-card-content">
            <div className="admin-settings-field">
              <Label htmlFor="storeName" className="admin-settings-label">
                Nombre de la Tienda
              </Label>
              <Input
                id="storeName"
                placeholder="TCG Store"
                defaultValue="TCG Store"
                className="admin-settings-input"
              />
            </div>
            <div className="admin-settings-field">
              <Label htmlFor="storeEmail" className="admin-settings-label">
                Email de Contacto
              </Label>
              <Input
                id="storeEmail"
                placeholder="contacto@tcgstore.com"
                defaultValue="contacto@tcgstore.com"
                className="admin-settings-input"
              />
            </div>
            <div className="admin-settings-field">
              <Label htmlFor="currency" className="admin-settings-label">
                Moneda
              </Label>
              <Input
                id="currency"
                placeholder="EUR"
                defaultValue="EUR"
                disabled
                className="admin-settings-input"
              />
            </div>
            <button className="admin-settings-btn-primary">Guardar Cambios</button>
          </CardContent>
        </Card>

        {/* Configuración de Envío */}
        <Card className="admin-settings-card">
          <CardHeader className="admin-settings-card-header">
            <CardTitle className="admin-settings-card-title">Configuración de Envío</CardTitle>
            <CardDescription className="admin-settings-card-description">
              Gestiona las opciones de envío
            </CardDescription>
          </CardHeader>
          <CardContent className="admin-settings-card-content">
            <div className="admin-settings-toggle">
              <div className="admin-settings-toggle-info">
                <span className="admin-settings-toggle-label">Envío Gratuito</span>
                <span className="admin-settings-toggle-description">
                  Habilitar envío gratuito para pedidos
                </span>
              </div>
              <Switch defaultChecked className="admin-settings-switch" />
            </div>
            <div className="admin-settings-field">
              <Label htmlFor="freeShippingThreshold" className="admin-settings-label">
                Mínimo para Envío Gratuito
              </Label>
              <Input
                id="freeShippingThreshold"
                type="number"
                placeholder="50"
                defaultValue="50"
                className="admin-settings-input"
              />
            </div>
            <div className="admin-settings-field">
              <Label htmlFor="shippingCost" className="admin-settings-label">
                Costo de Envío Estándar
              </Label>
              <Input
                id="shippingCost"
                type="number"
                placeholder="5.99"
                defaultValue="5.99"
                className="admin-settings-input"
              />
            </div>
            <button className="admin-settings-btn-outline">Guardar Cambios</button>
          </CardContent>
        </Card>

        {/* Configuración de Pago */}
        <Card className="admin-settings-card">
          <CardHeader className="admin-settings-card-header">
            <CardTitle className="admin-settings-card-title">Configuración de Pago</CardTitle>
            <CardDescription className="admin-settings-card-description">
              Gestiona las opciones de pago
            </CardDescription>
          </CardHeader>
          <CardContent className="admin-settings-card-content">
            <div className="admin-settings-toggle">
              <div className="admin-settings-toggle-info">
                <span className="admin-settings-toggle-label">Stripe Activo</span>
                <span className="admin-settings-toggle-description">
                  Habilitar pagos con Stripe
                </span>
              </div>
              <Switch defaultChecked className="admin-settings-switch" />
            </div>
            <div className="admin-settings-field">
              <Label htmlFor="stripeMode" className="admin-settings-label">
                Modo Stripe
              </Label>
              <Input
                id="stripeMode"
                placeholder="test"
                defaultValue="test"
                disabled
                className="admin-settings-input"
              />
            </div>
            <div className="admin-settings-field">
              <Label htmlFor="stripePublishableKey" className="admin-settings-label">
                Clave Publicable de Stripe
              </Label>
              <Input
                id="stripePublishableKey"
                type="password"
                placeholder="pk_test_..."
                className="admin-settings-input"
              />
            </div>
            <button className="admin-settings-btn-outline">Guardar Cambios</button>
          </CardContent>
        </Card>

        {/* Configuración de SEO */}
        <Card className="admin-settings-card">
          <CardHeader className="admin-settings-card-header">
            <CardTitle className="admin-settings-card-title">SEO y Metadatos</CardTitle>
            <CardDescription className="admin-settings-card-description">
              Configuración para motores de búsqueda
            </CardDescription>
          </CardHeader>
          <CardContent className="admin-settings-card-content">
            <div className="admin-settings-field">
              <Label htmlFor="metaTitle" className="admin-settings-label">
                Título por Defecto
              </Label>
              <Input
                id="metaTitle"
                placeholder="TCG Store - Cartas Coleccionables"
                defaultValue="TCG Store - Cartas Coleccionables"
                className="admin-settings-input"
              />
            </div>
            <div className="admin-settings-field">
              <Label htmlFor="metaDescription" className="admin-settings-label">
                Descripción por Defecto
              </Label>
              <Input
                id="metaDescription"
                placeholder="Compra y vende cartas coleccionables"
                defaultValue="Compra y vende cartas coleccionables de Pokémon y más"
                className="admin-settings-input"
              />
            </div>
            <div className="admin-settings-field">
              <Label htmlFor="metaKeywords" className="admin-settings-label">
                Palabras Clave
              </Label>
              <Input
                id="metaKeywords"
                placeholder="cartas, coleccionables, pokémon"
                defaultValue="cartas, coleccionables, pokémon, tcg"
                className="admin-settings-input"
              />
            </div>
            <button className="admin-settings-btn-primary">Guardar Cambios</button>
          </CardContent>
        </Card>

        {/* Configuración de Sistema */}
        <Card className="admin-settings-card">
          <CardHeader className="admin-settings-card-header">
            <CardTitle className="admin-settings-card-title">Configuración de Sistema</CardTitle>
            <CardDescription className="admin-settings-card-description">
              Opciones avanzadas del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="admin-settings-card-content">
            <div className="admin-settings-toggle">
              <div className="admin-settings-toggle-info">
                <span className="admin-settings-toggle-label">Modo Mantenimiento</span>
                <span className="admin-settings-toggle-description">
                  Poner la tienda en modo mantenimiento
                </span>
              </div>
              <Switch className="admin-settings-switch" />
            </div>
            <div className="admin-settings-toggle">
              <div className="admin-settings-toggle-info">
                <span className="admin-settings-toggle-label">Debug Mode</span>
                <span className="admin-settings-toggle-description">
                  Mostrar información de depuración
                </span>
              </div>
              <Switch className="admin-settings-switch" />
            </div>
            <Separator className="admin-settings-separator" />
            <button className="admin-settings-btn-danger">Limpiar Caché</button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
