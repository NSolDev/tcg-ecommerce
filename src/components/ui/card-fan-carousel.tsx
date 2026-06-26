// src/components/ui/card-fan-carousel.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import gsap from 'gsap'
import { PLACEHOLDER_IMAGE } from '@/lib/constants'
import { getLocalImage } from '@/lib/imageMap'
import './card-fan-carousel.css'

interface CardData {
  imgUrl: string
  alt: string
  title?: string
  description?: string
  link?: string
  slug?: string
}

interface SocialCardsProps {
  cards: CardData[]
  autoplay?: boolean
  interval?: number
}

export default function SocialCards({ 
  cards, 
  autoplay = true, 
  interval = 5000 
}: SocialCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  const totalCards = cards.length

  const updateCardPositions = (index: number, animate: boolean = true) => {
    const cards = cardRefs.current
    const total = cards.length

    cards.forEach((card, i) => {
      if (!card) return

      let distance = i - index
      if (distance > total / 2) distance -= total
      if (distance < -total / 2) distance += total

      const normalizedDist = Math.max(-5, Math.min(5, distance))
      const rotation = normalizedDist * 10
      const translateX = normalizedDist * 70
      const translateY = -Math.abs(normalizedDist) * 10
      const scale = 1 - Math.abs(normalizedDist) * 0.08
      const opacity = 1 - Math.abs(normalizedDist) * 0.15
      const zIndex = 100 - Math.abs(normalizedDist)
      const rotateY = normalizedDist * 12

      const duration = animate ? 0.6 : 0

      gsap.to(card, {
        x: translateX,
        y: translateY,
        rotation: rotation,
        rotationY: rotateY,
        scale: scale,
        opacity: Math.max(0.3, opacity),
        zIndex: zIndex,
        duration: duration,
        ease: "power3.out",
        overwrite: true,
      })
    })
  }

  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % totalCards
    setCurrentIndex(nextIndex)
    updateCardPositions(nextIndex)
  }

  const prevSlide = () => {
    const prevIndex = (currentIndex - 1 + totalCards) % totalCards
    setCurrentIndex(prevIndex)
    updateCardPositions(prevIndex)
  }

  useEffect(() => {
    if (!autoplay || isHovering || totalCards <= 1) return
    const timer = setInterval(nextSlide, interval)
    return () => clearInterval(timer)
  }, [autoplay, interval, isHovering, currentIndex, totalCards])

  useEffect(() => {
    if (cardRefs.current.length === 0) return
    
    setTimeout(() => {
      updateCardPositions(currentIndex, true)
    }, 100)

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [cards.length])

  useEffect(() => {
    if (cardRefs.current.length > 0) {
      updateCardPositions(currentIndex, true)
    }
  }, [currentIndex])

  const handleCardClick = (link?: string) => {
    if (link) {
      window.location.href = link
    }
  }

  // Función para obtener la URL de la imagen correcta
  const getImageUrl = (card: CardData, index: number) => {
    // Si ya hubo error con esta imagen, usar placeholder
    if (imageErrors[index]) {
      return PLACEHOLDER_IMAGE
    }

    // 1. Intentar usar imagen local primero
    if (card.slug) {
      const localImage = getLocalImage(card.slug)
      if (localImage) {
        return localImage
      }
    }

    // 2. Si no hay local, usar la URL proporcionada
    if (card.imgUrl && card.imgUrl !== PLACEHOLDER_IMAGE) {
      return card.imgUrl
    }

    // 3. Fallback a placeholder
    return PLACEHOLDER_IMAGE
  }

  // Manejar error de imagen
  const handleImageError = (index: number) => {
    setImageErrors(prev => ({
      ...prev,
      [index]: true
    }))
  }

  if (totalCards === 0) {
    return (
      <div className="fan-carousel-empty">
        <p className="fan-carousel-empty-text">No hay imágenes disponibles</p>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="fan-carousel"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {autoplay && totalCards > 1 && (
        <div className="fan-carousel-autoplay">
          <Sparkles className="fan-carousel-autoplay-icon" />
          <span className="fan-carousel-autoplay-text">Autoplay</span>
        </div>
      )}

      <div className="fan-carousel-container">
        {cards.map((card, index) => {
          const isActive = index === currentIndex
          const imageUrl = getImageUrl(card, index)
          
          return (
            <div
              key={card.imgUrl + index}
              ref={(el) => { cardRefs.current[index] = el }}
              className={`fan-carousel-card ${isActive ? 'active' : ''}`}
              onClick={() => handleCardClick(card.link)}
            >
              <div className="fan-carousel-card-image">
                <img
                  src={imageUrl}
                  alt={card.alt || 'Card image'}
                  className="fan-carousel-card-img"
                  onError={() => handleImageError(index)}
                />
                
                <div className="fan-carousel-card-overlay" />
                
                {(card.title || card.description) && (
                  <div className={`fan-carousel-card-content ${isActive ? 'visible' : ''}`}>
                    {card.title && (
                      <h3 className="fan-carousel-card-title">
                        {card.title}
                      </h3>
                    )}
                    {card.description && (
                      <p className="fan-carousel-card-description">
                        {card.description}
                      </p>
                    )}
                  </div>
                )}

                {isActive && (
                  <div className="fan-carousel-card-badge">
                    <span className="fan-carousel-card-badge-text">✦ Destacado</span>
                  </div>
                )}

                <div className="fan-carousel-card-number">
                  {index + 1} / {totalCards}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {totalCards > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="fan-carousel-control fan-carousel-control-left"
          >
            <ChevronLeft className="fan-carousel-control-icon" />
          </button>
          <button
            onClick={nextSlide}
            className="fan-carousel-control fan-carousel-control-right"
          >
            <ChevronRight className="fan-carousel-control-icon" />
          </button>
        </>
      )}

      {totalCards > 1 && (
        <div className="fan-carousel-indicators">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index)
                updateCardPositions(index, true)
              }}
              className={`fan-carousel-indicator ${
                index === currentIndex ? 'active' : 'inactive'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}