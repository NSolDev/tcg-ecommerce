// src/app/admin/settings/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { prisma } from '@/lib/db/prisma'

export default async function AdminSettingsPage() {
  // Obtener estadísticas para mostrar en configuración
  const [productCount, orderCount, userCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Configuración</h1>
        <p className="text-muted-foreground">Gestiona la configuración de la tienda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información General */}
        <Card className="bg-[#1a1a2e]/50 border-white/10 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
          <CardHeader className="px-6 pt-6 pb-3">
            <CardTitle className="text-lg text-white">Información General</CardTitle>
            <CardDescription className="text-muted-foreground">
              Estadísticas y datos de la tienda
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0 space-y-3">
            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-muted-foreground">Productos</span>
              <span className="font-medium text-white">{productCount}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-muted-foreground">Pedidos</span>
              <span className="font-medium text-white">{orderCount}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-muted-foreground">Usuarios</span>
              <span className="font-medium text-white">{userCount}</span>
            </div>
            <Separator className="bg-white/10" />
            <div className="flex justify-between items-center py-1.5">
              <span className="text-muted-foreground">Versión</span>
              <span className="font-medium text-white">v1.0.0</span>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de la Tienda */}
        <Card className="bg-[#1a1a2e]/50 border-white/10 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
          <CardHeader className="px-6 pt-6 pb-3">
            <CardTitle className="text-lg text-white">Configuración de la Tienda</CardTitle>
            <CardDescription className="text-muted-foreground">
              Ajusta la configuración básica de la tienda
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName" className="text-white/80">Nombre de la Tienda</Label>
              <Input 
                id="storeName" 
                placeholder="TCG Store" 
                defaultValue="TCG Store" 
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeEmail" className="text-white/80">Email de Contacto</Label>
              <Input 
                id="storeEmail" 
                placeholder="contacto@tcgstore.com" 
                defaultValue="contacto@tcgstore.com" 
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-white/80">Moneda</Label>
              <Input 
                id="currency" 
                placeholder="EUR" 
                defaultValue="EUR" 
                disabled 
                className="bg-white/5 border-white/10 text-white/50 cursor-not-allowed"
              />
            </div>
            <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white">
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        {/* Configuración de Envío */}
        <Card className="bg-[#1a1a2e]/50 border-white/10 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
          <CardHeader className="px-6 pt-6 pb-3">
            <CardTitle className="text-lg text-white">Configuración de Envío</CardTitle>
            <CardDescription className="text-muted-foreground">
              Gestiona las opciones de envío
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-white/80">Envío Gratuito</Label>
                <p className="text-sm text-muted-foreground">Habilitar envío gratuito para pedidos</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="freeShippingThreshold" className="text-white/80">Mínimo para Envío Gratuito</Label>
              <Input 
                id="freeShippingThreshold" 
                type="number" 
                placeholder="50" 
                defaultValue="50" 
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingCost" className="text-white/80">Costo de Envío Estándar</Label>
              <Input 
                id="shippingCost" 
                type="number" 
                placeholder="5.99" 
                defaultValue="5.99" 
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50"
              />
            </div>
            <Button variant="outline" className="w-full border-white/10 hover:border-primary/50 bg-white/5 text-white hover:text-white">
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        {/* Configuración de Pago */}
        <Card className="bg-[#1a1a2e]/50 border-white/10 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
          <CardHeader className="px-6 pt-6 pb-3">
            <CardTitle className="text-lg text-white">Configuración de Pago</CardTitle>
            <CardDescription className="text-muted-foreground">
              Gestiona las opciones de pago
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-white/80">Stripe Activo</Label>
                <p className="text-sm text-muted-foreground">Habilitar pagos con Stripe</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripeMode" className="text-white/80">Modo Stripe</Label>
              <Input 
                id="stripeMode" 
                placeholder="test" 
                defaultValue="test" 
                disabled 
                className="bg-white/5 border-white/10 text-white/50 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripePublishableKey" className="text-white/80">Clave Publicable de Stripe</Label>
              <Input 
                id="stripePublishableKey" 
                type="password" 
                placeholder="pk_test_..." 
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50"
              />
            </div>
            <Button variant="outline" className="w-full border-white/10 hover:border-primary/50 bg-white/5 text-white hover:text-white">
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        {/* Configuración de SEO */}
        <Card className="bg-[#1a1a2e]/50 border-white/10 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
          <CardHeader className="px-6 pt-6 pb-3">
            <CardTitle className="text-lg text-white">SEO y Metadatos</CardTitle>
            <CardDescription className="text-muted-foreground">
              Configuración para motores de búsqueda
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitle" className="text-white/80">Título por Defecto</Label>
              <Input 
                id="metaTitle" 
                placeholder="TCG Store - Cartas Coleccionables" 
                defaultValue="TCG Store - Cartas Coleccionables" 
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription" className="text-white/80">Descripción por Defecto</Label>
              <Input 
                id="metaDescription" 
                placeholder="Compra y vende cartas coleccionables" 
                defaultValue="Compra y vende cartas coleccionables de Pokémon y más" 
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaKeywords" className="text-white/80">Palabras Clave</Label>
              <Input 
                id="metaKeywords" 
                placeholder="cartas, coleccionables, pokémon" 
                defaultValue="cartas, coleccionables, pokémon, tcg" 
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50"
              />
            </div>
            <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white">
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        {/* Configuración de Sistema */}
        <Card className="bg-[#1a1a2e]/50 border-white/10 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
          <CardHeader className="px-6 pt-6 pb-3">
            <CardTitle className="text-lg text-white">Configuración de Sistema</CardTitle>
            <CardDescription className="text-muted-foreground">
              Opciones avanzadas del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-white/80">Modo Mantenimiento</Label>
                <p className="text-sm text-muted-foreground">Poner la tienda en modo mantenimiento</p>
              </div>
              <Switch className="data-[state=checked]:bg-primary" />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-white/80">Debug Mode</Label>
                <p className="text-sm text-muted-foreground">Mostrar información de depuración</p>
              </div>
              <Switch className="data-[state=checked]:bg-primary" />
            </div>
            <Separator className="bg-white/10" />
            <Button variant="destructive" className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20 hover:text-red-300">
              Limpiar Caché
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}