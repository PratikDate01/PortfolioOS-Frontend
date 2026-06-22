'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  px: number; // projected x
  py: number; // projected y
  scale: number;
  alpha: number;
}

interface Globe3DCanvasProps {
  className?: string;
  color?: string; // hex color or rgb
  glowColor?: string;
}

export default function Globe3DCanvas({
  className = '',
  color = '#14b8a6', // Teal default
  glowColor = 'rgba(20, 184, 166, 0.1)',
}: Globe3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, rotX: 0, rotY: 0 });
  const rotRef = useRef({ x: 0.002, y: 0.003 }); // automatic rotation speeds
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovering: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const center = { x: width / 2, y: height / 2 };
    const radius = Math.min(width, height) * 0.38;
    const perspective = width * 0.8;

    // Generate 100 points on a sphere using Fibonacci distribution
    const numPoints = 100;
    const points: Point3D[] = [];

    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(-1 + (2 * i) / numPoints);
      const theta = Math.sqrt(numPoints * Math.PI) * phi;

      points.push({
        x: radius * Math.sin(phi) * Math.sin(theta),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.cos(theta),
        px: 0,
        py: 0,
        scale: 0,
        alpha: 0,
      });
    }

    // Event Listeners for Interaction
    const handleMouseDown = (e: MouseEvent) => {
      dragRef.current.isDragging = true;
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - center.x;
      const y = e.clientY - rect.top - center.y;

      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
      mouseRef.current.isHovering = true;

      if (dragRef.current.isDragging) {
        const deltaX = e.clientX - dragRef.current.startX;
        const deltaY = e.clientY - dragRef.current.startY;
        
        dragRef.current.rotY = deltaX * 0.005;
        dragRef.current.rotX = deltaY * 0.005;

        dragRef.current.startX = e.clientX;
        dragRef.current.startY = e.clientY;
      }
    };

    const handleMouseUp = () => {
      dragRef.current.isDragging = false;
    };

    const handleMouseLeave = () => {
      dragRef.current.isDragging = false;
      mouseRef.current.isHovering = false;
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      center.x = width / 2;
      center.y = height / 2;
    };
    window.addEventListener('resize', handleResize);

    // Main animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Interpolate mouse coordinates smoothly
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      let currentAngleX = rotRef.current.x;
      let currentAngleY = rotRef.current.y;

      if (dragRef.current.isDragging) {
        // Drag rotation
        currentAngleX = dragRef.current.rotX;
        currentAngleY = dragRef.current.rotY;
        // Damp values back to zero slowly
        dragRef.current.rotX *= 0.95;
        dragRef.current.rotY *= 0.95;
      } else if (mouse.isHovering) {
        // Subtle tilt velocity from mouse coordinates
        currentAngleX = mouse.y * 0.00003;
        currentAngleY = -mouse.x * 0.00003;
      }

      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);
      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);

      // 1. Rotate and project all points
      points.forEach((point) => {
        // Rotate Y axis
        const x1 = point.x * cosY - point.z * sinY;
        const z1 = point.z * cosY + point.x * sinY;

        // Rotate X axis
        const y2 = point.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + point.y * sinX;

        point.x = x1;
        point.y = y2;
        point.z = z2;

        // Perspective scaling
        const scale = perspective / (perspective + z2);
        point.px = center.x + x1 * scale;
        point.py = center.y + y2 * scale;
        point.scale = scale;
        
        // Depth-based opacity
        point.alpha = Math.max((scale - 0.5) * 1.4, 0.15);
      });

      // 2. Draw connections (Network / Globe grid mesh)
      // Only draw links between nodes that are relatively close to each other
      const maxDistance = radius * 0.55;
      ctx.lineWidth = 0.5;

      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        for (let j = i + 1; j < points.length; j++) {
          const p2 = points[j];
          
          // Calculate 3D Euclidean distance
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            const alphaMultiplier = (1 - dist / maxDistance);
            const lineAlpha = p1.alpha * p2.alpha * alphaMultiplier * 0.15;
            
            ctx.strokeStyle = color;
            ctx.globalAlpha = lineAlpha;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1.0; // reset

      // Sort points by depth (z-buffer) to draw back particles first
      const sortedPoints = [...points].sort((a, b) => b.z - a.z);

      // 3. Draw particles
      sortedPoints.forEach((point) => {
        const ptSize = Math.max(point.scale * 3.5, 1.2);
        
        // Glow effect for closer particles
        if (point.z < 0) {
          const grad = ctx.createRadialGradient(
            point.px,
            point.py,
            0,
            point.px,
            point.py,
            ptSize * 2.5
          );
          grad.addColorStop(0, color);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(point.px, point.py, ptSize * 2.5, 0, 2 * Math.PI);
          ctx.fill();
        }

        // Core particle point
        ctx.fillStyle = color;
        ctx.globalAlpha = point.alpha;
        ctx.beginPath();
        ctx.arc(point.px, point.py, ptSize * 0.7, 0, 2 * Math.PI);
        ctx.fill();
      });
      
      ctx.globalAlpha = 1.0; // reset

      // Draw subtle orbital rings
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.5;
      
      // Horizontal ring (latitudinal equator)
      ctx.globalAlpha = 0.05;
      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.scale(1, 0.25);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.restore();

      // Vertical ring (meridian)
      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.scale(0.25, 1);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.restore();
      
      ctx.globalAlpha = 1.0; // reset

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handleMouseUp);
      if (canvas) {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [color]);

  return (
    <div className={`relative w-full aspect-square md:w-full md:h-full flex items-center justify-center overflow-hidden rounded-2xl ${className}`}>
      {/* Background ambient radial glow */}
      <div 
        className="absolute w-2/3 h-2/3 rounded-full blur-[100px] pointer-events-none"
        style={{ backgroundColor: glowColor }}
      />
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10" 
      />
    </div>
  );
}
