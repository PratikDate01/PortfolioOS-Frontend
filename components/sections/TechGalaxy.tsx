'use client';

import React, { useEffect, useRef } from 'react';

interface TechItem {
  name: string;
  color: string;
  x: number;
  y: number;
  z: number;
  xProjected: number;
  yProjected: number;
  sizeProjected: number;
  alpha: number;
}

const TECH_LIST = [
  { name: 'React.js', color: '#2dd4bf' }, // teal
  { name: 'Node.js', color: '#a78bfa' }, // purple
  { name: 'Python', color: '#fb7185' }, // rose
  { name: 'Next.js', color: '#f8fafc' }, // slate
  { name: 'Express', color: '#38bdf8' }, // sky
  { name: 'MongoDB', color: '#34d399' }, // emerald
  { name: 'MySQL', color: '#f59e0b' }, // amber
  { name: 'Docker', color: '#0ea5e9' }, // sky
  { name: 'AWS', color: '#ff9900' }, // orange
  { name: 'TypeScript', color: '#60a5fa' }, // blue
  { name: 'Java', color: '#f87171' }, // red
  { name: 'Git', color: '#f43f5e' }, // rose
];

export default function TechGalaxy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovering: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const radius = Math.min(width, height) * 0.35;
    const perspective = width * 0.8;
    const center = { x: width / 2, y: height / 2 };

    // Initialize 3D positions distributed on a sphere
    const items: TechItem[] = TECH_LIST.map((tech, idx) => {
      // Fibonacci sphere distribution
      const phi = Math.acos(-1 + (2 * idx) / TECH_LIST.length);
      const theta = Math.sqrt(TECH_LIST.length * Math.PI) * phi;

      return {
        name: tech.name,
        color: tech.color,
        x: radius * Math.sin(phi) * Math.sin(theta),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.cos(theta),
        xProjected: 0,
        yProjected: 0,
        sizeProjected: 0,
        alpha: 0,
      };
    });

    // Rotation angles
    const angleX = 0.003;
    const angleY = 0.003;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - center.x;
      const y = e.clientY - rect.top - center.y;
      
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
      mouseRef.current.isHovering = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false;
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      center.x = width / 2;
      center.y = height / 2;
    };
    window.addEventListener('resize', handleResize);

    // Main render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse coordinates interpolation
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Adjust rotation speed based on mouse movement/hover
      const currentAngleX = mouse.isHovering ? mouse.y * 0.00003 : angleX;
      const currentAngleY = mouse.isHovering ? -mouse.x * 0.00003 : angleY;

      // Trigo precomputations for rotations
      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);
      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);

      // 1. Rotate & Project all items
      items.forEach((item) => {
        // Rotate Y axis
        const x1 = item.x * cosY - item.z * sinY;
        const z1 = item.z * cosY + item.x * sinY;

        // Rotate X axis
        const y2 = item.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + item.y * sinX;

        item.x = x1;
        item.y = y2;
        item.z = z2;

        // Project onto 2D screen with perspective depth
        const scale = perspective / (perspective + z2);
        item.xProjected = center.x + x1 * scale;
        item.yProjected = center.y + y2 * scale;
        
        // Size & opacity based on z-depth
        item.sizeProjected = Math.max(scale * 12, 4);
        item.alpha = Math.max((scale - 0.5) * 1.5, 0.15);
      });

      // Sort items by z-index so backend items are drawn first (depth buffer)
      const sortedItems = [...items].sort((a, b) => b.z - a.z);

      // 2. Draw connecting orbits/grids
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius * 0.8, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.03)';
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius * 1.2, 0, 2 * Math.PI);
      ctx.stroke();

      // 3. Draw particles & text
      sortedItems.forEach((item) => {
        // Draw connection lines from center
        ctx.strokeStyle = `rgba(20, 184, 166, ${item.alpha * 0.08})`;
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(item.xProjected, item.yProjected);
        ctx.stroke();

        // Draw glowing particle
        const grad = ctx.createRadialGradient(
          item.xProjected,
          item.yProjected,
          0,
          item.xProjected,
          item.yProjected,
          item.sizeProjected * 1.5
        );
        grad.addColorStop(0, item.color);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(item.xProjected, item.yProjected, item.sizeProjected * 1.5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(item.xProjected, item.yProjected, item.sizeProjected * 0.4, 0, 2 * Math.PI);
        ctx.fill();

        // Draw text tag
        ctx.font = `bold ${Math.max(Math.floor(item.sizeProjected * 1.1), 10)}px var(--font-geist-mono), monospace`;
        ctx.fillStyle = `rgba(255, 255, 255, ${item.alpha})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add subtle shadow offset for readability
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;
        ctx.fillText(item.name, item.xProjected, item.yProjected - item.sizeProjected - 8);
        ctx.shadowBlur = 0; // reset
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-sm overflow-hidden flex items-center justify-center group">
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 font-mono text-[10px] text-zinc-500">
        <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
        <span>3D Technical Galaxy (Interactive Canvas)</span>
      </div>
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
