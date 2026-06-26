// src/app/(shop)/shipping/page.tsx
import { Truck, Clock, Package, Globe } from 'lucide-react'
import './shipping.css'

export default function ShippingPage() {
  return (
    <div className="shipping-container">
      <div className="shipping-hero">
        <h1 className="shipping-hero-title">Envíos</h1>
        <p className="shipping-hero-subtitle">Todo lo que necesitas saber sobre nuestros envíos</p>
      </div>

      <div className="shipping-content">
        <div className="shipping-section">
          <h2 className="shipping-section-title">Métodos de Envío</h2>
          <div className="shipping-methods">
            <div className="shipping-method">
              <div className="shipping-method-icon">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="shipping-method-title">Envío Estándar</h3>
                <p className="shipping-method-description">Entrega en 2-4 días hábiles</p>
                <p className="shipping-method-price">Gratis en pedidos superiores a 50€</p>
              </div>
            </div>
            <div className="shipping-method">
              <div className="shipping-method-icon">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="shipping-method-title">Envío Express</h3>
                <p className="shipping-method-description">Entrega en 24 horas</p>
                <p className="shipping-method-price">+5.99€</p>
              </div>
            </div>
          </div>
        </div>

        <div className="shipping-section">
          <h2 className="shipping-section-title">Tiempos de Entrega</h2>
          <ul className="shipping-list">
            <li className="shipping-list-item">
              <span className="shipping-list-icon">📍</span>
              <span>España Peninsular: 24-48 horas</span>
            </li>
            <li className="shipping-list-item">
              <span className="shipping-list-icon">📍</span>
              <span>Islas Baleares y Canarias: 2-4 días</span>
            </li>
            <li className="shipping-list-item">
              <span className="shipping-list-icon">📍</span>
              <span>Europa: 3-7 días</span>
            </li>
            <li className="shipping-list-item">
              <span className="shipping-list-icon">📍</span>
              <span>Internacional: 5-10 días</span>
            </li>
          </ul>
        </div>

        <div className="shipping-section">
          <h2 className="shipping-section-title">Información Adicional</h2>
          <ul className="shipping-list">
            <li className="shipping-list-item">
              <span className="shipping-list-icon">📦</span>
              <span>Todos los pedidos incluyen número de seguimiento</span>
            </li>
            <li className="shipping-list-item">
              <span className="shipping-list-icon">📦</span>
              <span>Embalaje seguro y resistente para proteger tus cartas</span>
            </li>
            <li className="shipping-list-item">
              <span className="shipping-list-icon">📦</span>
              <span>Envíos asegurados contra pérdidas y daños</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}