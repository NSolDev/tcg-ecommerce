// src/app/(shop)/returns/page.tsx
import { RefreshCw, Clock, Shield, Package } from 'lucide-react';
import './returns.css';

export default function ReturnsPage() {
  return (
    <div className="returns-container">
      <div className="returns-hero">
        <h1 className="returns-hero-title">Devoluciones</h1>
        <p className="returns-hero-subtitle">Política de devoluciones y garantía</p>
      </div>

      <div className="returns-content">
        <div className="returns-section">
          <h2 className="returns-section-title">Política de Devoluciones</h2>
          <div className="returns-info-grid">
            <div className="returns-info-card">
              <div className="returns-info-icon">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="returns-info-title">30 Días</h3>
              <p className="returns-info-description">
                Tienes 30 días desde la recepción del pedido para solicitar una devolución.
              </p>
            </div>
            <div className="returns-info-card">
              <div className="returns-info-icon">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="returns-info-title">Producto Original</h3>
              <p className="returns-info-description">
                El producto debe estar en su estado original, sin usar y en su embalaje original.
              </p>
            </div>
            <div className="returns-info-card">
              <div className="returns-info-icon">
                <RefreshCw className="h-6 w-6" />
              </div>
              <h3 className="returns-info-title">Reembolso</h3>
              <p className="returns-info-description">
                El reembolso se realizará a través del mismo método de pago utilizado en la compra.
              </p>
            </div>
          </div>
        </div>

        <div className="returns-section">
          <h2 className="returns-section-title">Proceso de Devolución</h2>
          <div className="returns-steps">
            <div className="returns-step">
              <span className="returns-step-number">1</span>
              <div>
                <h4 className="returns-step-title">Solicita la devolución</h4>
                <p className="returns-step-description">
                  Contáctanos a través de info@tcgstore.com con tu número de pedido
                </p>
              </div>
            </div>
            <div className="returns-step">
              <span className="returns-step-number">2</span>
              <div>
                <h4 className="returns-step-title">Prepara el paquete</h4>
                <p className="returns-step-description">
                  Empaca el producto en su estado original con todo el embalaje
                </p>
              </div>
            </div>
            <div className="returns-step">
              <span className="returns-step-number">3</span>
              <div>
                <h4 className="returns-step-title">Envía el paquete</h4>
                <p className="returns-step-description">
                  Los gastos de envío de la devolución corren a cargo del cliente
                </p>
              </div>
            </div>
            <div className="returns-step">
              <span className="returns-step-number">4</span>
              <div>
                <h4 className="returns-step-title">Recepción y reembolso</h4>
                <p className="returns-step-description">
                  Una vez recibido y verificado, procesaremos el reembolso
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="returns-section">
          <h2 className="returns-section-title">Excepciones</h2>
          <div className="returns-exceptions">
            <div className="returns-exception">
              <Package className="returns-exception-icon" />
              <div>
                <h4 className="returns-exception-title">Productos Personalizados</h4>
                <p className="returns-exception-description">
                  Los productos personalizados no pueden ser devueltos a menos que presenten un
                  defecto de fabricación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
