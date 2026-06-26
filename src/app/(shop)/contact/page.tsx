// src/app/(shop)/contact/page.tsx
'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import './contact.css'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica de envío del formulario
    alert('Mensaje enviado correctamente. Te responderemos pronto.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="contact-container">
      <div className="contact-hero">
        <h1 className="contact-hero-title">Contacto</h1>
        <p className="contact-hero-subtitle">¿Tienes alguna pregunta? Estamos aquí para ayudarte</p>
      </div>

      <div className="contact-grid">
        {/* Información de contacto */}
        <div className="contact-info">
          <h2 className="contact-info-title">Información de Contacto</h2>
          <div className="contact-info-list">
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="contact-info-label">Email</h4>
                <p className="contact-info-value">info@tcgstore.com</p>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="contact-info-label">Teléfono</h4>
                <p className="contact-info-value">+34 900 123 456</p>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="contact-info-label">Dirección</h4>
                <p className="contact-info-value">Calle Mayor 1, 28001 Madrid</p>
              </div>
            </div>
          </div>
          <div className="contact-hours">
            <h4 className="contact-hours-title">Horario de Atención</h4>
            <p className="contact-hours-text">Lunes a Viernes: 9:00 - 20:00</p>
            <p className="contact-hours-text">Sábados: 10:00 - 18:00</p>
            <p className="contact-hours-text">Domingos: Cerrado</p>
          </div>
        </div>

        {/* Formulario de contacto */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2 className="contact-form-title">Envíanos un Mensaje</h2>
          <div className="contact-form-group">
            <label htmlFor="name" className="contact-form-label">Nombre</label>
            <input
              id="name"
              type="text"
              className="contact-form-input"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="contact-form-group">
            <label htmlFor="email" className="contact-form-label">Email</label>
            <input
              id="email"
              type="email"
              className="contact-form-input"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="contact-form-group">
            <label htmlFor="subject" className="contact-form-label">Asunto</label>
            <input
              id="subject"
              type="text"
              className="contact-form-input"
              placeholder="Asunto del mensaje"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>
          <div className="contact-form-group">
            <label htmlFor="message" className="contact-form-label">Mensaje</label>
            <textarea
              id="message"
              className="contact-form-textarea"
              placeholder="Escribe tu mensaje aquí..."
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="contact-form-button">
            <Send className="w-4 h-4" />
            Enviar Mensaje
          </button>
        </form>
      </div>
    </div>
  )
}