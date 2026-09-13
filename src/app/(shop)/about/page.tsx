// src/app/(shop)/about/page.tsx
import Link from 'next/link';
import { Users, Target, Shield } from 'lucide-react';
import './about.css';

export default function AboutPage() {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1 className="about-hero-title">Sobre Nosotros</h1>
        <p className="about-hero-subtitle">Conoce la historia detrás de TCG Store</p>
      </div>

      <div className="about-content">
        <div className="about-section">
          <h2 className="about-section-title">Nuestra Historia</h2>
          <p className="about-section-text">
            TCG Store nació en 2024 con una misión clara: conectar a coleccionistas de cartas
            Pokémon con los productos más auténticos y exclusivos del mercado. Lo que empezó como un
            pequeño proyecto entre amigos se ha convertido en una tienda de referencia para la
            comunidad TCG.
          </p>
          <p className="about-section-text">
            Creemos que cada carta cuenta una historia, y queremos ser parte de la tuya. Ya seas un
            coleccionista experimentado o estés empezando tu viaje, en TCG Store encontrarás un
            espacio donde tu pasión es la protagonista.
          </p>
        </div>

        <div className="about-values">
          <h2 className="about-section-title">Nuestros Valores</h2>
          <div className="about-values-grid">
            <div className="about-value-card">
              <div className="about-value-icon">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="about-value-title">Autenticidad</h3>
              <p className="about-value-description">
                Garantizamos que cada producto es 100% original y certificado.
              </p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="about-value-title">Calidad</h3>
              <p className="about-value-description">
                Seleccionamos cuidadosamente cada producto para asegurar la mejor experiencia.
              </p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="about-value-title">Comunidad</h3>
              <p className="about-value-description">
                Fomentamos una comunidad de coleccionistas apasionados y respetuosos.
              </p>
            </div>
          </div>
        </div>

        <div className="about-cta">
          <h2 className="about-cta-title">¿Listo para empezar tu colección?</h2>
          <Link href="/products" className="about-cta-button">
            Explorar Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
