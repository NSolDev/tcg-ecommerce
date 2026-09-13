// src/app/(shop)/layout.tsx
import { Header } from '@/components/shared/Header';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ParticlesBg } from '@/components/ui/particles-bg';
import './shop-layout.css';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="shop-layout">
      <div className="shop-particles">
        <ParticlesBg />
      </div>
      <div className="shop-layout-content">
        <Header />
        <main className="shop-main">{children}</main>
        <footer className="shop-footer">
          <div className="shop-footer-container">
            <div className="shop-footer-grid">
              <div>
                <h3 className="shop-footer-brand">TCG Store</h3>
                <p className="shop-footer-description">
                  Tu tienda de confianza para cartas coleccionables
                </p>
              </div>
              <div>
                <h4 className="shop-footer-title">Enlaces</h4>
                <ul className="shop-footer-list">
                  <li>
                    <a href="/products" className="shop-footer-link">
                      Catálogo
                    </a>
                  </li>
                  <li>
                    <a href="/about" className="shop-footer-link">
                      Sobre Nosotros
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="shop-footer-link">
                      Contacto
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="shop-footer-title">Ayuda</h4>
                <ul className="shop-footer-list">
                  <li>
                    <a href="/faq" className="shop-footer-link">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="/shipping" className="shop-footer-link">
                      Envíos
                    </a>
                  </li>
                  <li>
                    <a href="/returns" className="shop-footer-link">
                      Devoluciones
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="shop-footer-title">Síguenos</h4>
                <div className="shop-footer-social">
                  <a href="#">Twitter</a>
                  <a href="#">Instagram</a>
                </div>
              </div>
            </div>
            <div className="shop-footer-bottom">
              © 2026 TCG Store. Todos los derechos reservados.
            </div>
          </div>
        </footer>
        <CartDrawer />
      </div>
    </div>
  );
}
