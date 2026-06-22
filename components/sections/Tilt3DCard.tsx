'use client';

import React, { useRef, useState } from 'react';

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'teal' | 'emerald' | 'purple' | 'pink' | 'indigo' | 'zinc' | 'white';
}

export default function Tilt3DCard({
  children,
  className = '',
  glowColor = 'teal',
}: Tilt3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // cursor x position relative to card
    const y = e.clientY - rect.top;  // cursor y position relative to card

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-6 to 6 degrees for subtle professional effect)
    const rX = ((centerY - y) / centerY) * 6;
    const rY = ((x - centerX) / centerX) * 6;

    setRotateX(rX);
    setRotateY(rY);

    // Calculate relative percentage for glow effect
    setGlowX((x / rect.width) * 100);
    setGlowY((y / rect.height) * 100);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  // Determine glow color hex/rgba based on theme prop
  const getGlowStyle = () => {
    if (!isHovered) return {};
    
    let color = 'rgba(20, 184, 166, 0.15)'; // default teal
    switch (glowColor) {
      case 'emerald':
        color = 'rgba(16, 185, 129, 0.15)';
        break;
      case 'purple':
        color = 'rgba(139, 92, 246, 0.15)';
        break;
      case 'pink':
        color = 'rgba(236, 72, 153, 0.15)';
        break;
      case 'indigo':
        color = 'rgba(99, 102, 241, 0.15)';
        break;
      case 'zinc':
        color = 'rgba(113, 113, 122, 0.1)';
        break;
      case 'white':
        color = 'rgba(255, 255, 255, 0.08)';
        break;
    }

    return {
      background: `radial-gradient(circle 250px at ${glowX}% ${glowY}%, ${color}, transparent 80%)`,
    };
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden transition-all duration-300 ease-out ${className}`}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          ...getGlowStyle(),
        }}
      />
      {/* Content wrapper with perspective */}
      <div style={{ transform: 'translateZ(10px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </div>
  );
}
