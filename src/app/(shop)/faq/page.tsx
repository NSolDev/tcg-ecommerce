// src/app/(shop)/faq/page.tsx
'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import './faq.css'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: '¿Cómo sé que las cartas son auténticas?',
    answer: 'Todas nuestras cartas son 100% originales y certificadas. Trabajamos directamente con distribuidores oficiales y cada producto pasa por un riguroso control de calidad antes de ser puesto a la venta.'
  },
  {
    question: '¿Cuánto tiempo tarda el envío?',
    answer: 'Realizamos envíos en 24-48 horas laborables para toda España. Para pedidos internacionales, el plazo puede variar entre 3-7 días hábiles según el destino.'
  },
  {
    question: '¿Puedo devolver un producto?',
    answer: 'Sí, aceptamos devoluciones dentro de los 30 días posteriores a la compra. El producto debe estar en su estado original y sin usar. Los gastos de envío de la devolución corren a cargo del cliente.'
  },
  {
    question: '¿Cómo puedo rastrear mi pedido?',
    answer: 'Una vez realizado el envío, recibirás un email con el número de seguimiento. Podrás rastrear tu pedido directamente en la web de la empresa de mensajería.'
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos tarjetas de crédito/débito, PayPal, Google Pay, Apple Pay y transferencia bancaria. Todos los pagos se procesan de forma segura a través de Stripe.'
  },
  {
    question: '¿Tienen tienda física?',
    answer: 'Actualmente operamos exclusivamente online. Esto nos permite ofrecer los mejores precios y una selección más amplia de productos.'
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="faq-container">
      <div className="faq-hero">
        <h1 className="faq-hero-title">Preguntas Frecuentes</h1>
        <p className="faq-hero-subtitle">Encuentra respuestas a las preguntas más comunes</p>
      </div>

      <div className="faq-list">
        {faqData.map((item, index) => (
          <div key={index} className="faq-item">
            <button
              className="faq-question"
              onClick={() => toggleFAQ(index)}
            >
              <span>{item.question}</span>
              {openIndex === index ? (
                <ChevronUp className="faq-icon" />
              ) : (
                <ChevronDown className="faq-icon" />
              )}
            </button>
            {openIndex === index && (
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="faq-contact">
        <h3 className="faq-contact-title">¿No encuentras lo que buscas?</h3>
        <p className="faq-contact-text">
          Si tu pregunta no está en la lista, no dudes en contactarnos.
        </p>
        <a href="/contact" className="faq-contact-button">
          Contactar
        </a>
      </div>
    </div>
  )
}