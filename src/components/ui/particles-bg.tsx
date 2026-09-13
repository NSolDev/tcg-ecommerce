// src/components/ui/particles-bg.tsx
'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export function ParticlesBg() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = ['rgba(238,21,21,0.3)', 'rgba(255,203,5,0.2)', 'rgba(46,105,164,0.3)'];
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            backgroundColor: particle.color,
            animation: 'particle-float 8s infinite',
          }}
        />
      ))}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx>{`
        @keyframes particle-float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
          }
          50% {
            transform: translate(20px, -30px) scale(1.2);
            opacity: 1;
          }
          75% {
            transform: translate(-10px, -60px) scale(0.8);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
