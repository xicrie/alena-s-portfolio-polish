"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  isShapeNode: boolean;
  shapeX: number;
  shapeY: number;
  baseSize: number;
  color: string;
  pulseOffset: number;
  pulseSpeed: number;
  assemblyLevel: number;
};

const PremiumBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // --- МАТЕМАТИЧЕСКИЕ КОНТУРЫ (Идеи, Технологии) ---
    const SVGS = [
      "M25 1 C36 7 45 16 49 25 C45 34 36 43 25 49 C14 43 5 34 1 25 C5 16 14 7 25 1 Z", // Нейросеть / Мозг
      "M25 0 L47 13 L47 37 L25 50 L3 37 L3 13 Z", // Структура / Гексагон
      "M25 2 C13 2 5 10 5 22 C5 31 13 38 20 41 L20 48 L30 48 L30 41 C37 38 45 31 45 22 C45 10 37 2 25 2 Z", // Инсайт / Лампа
    ];

    let animationId = 0;
    let particles: Particle[] = [];
    let shapeClouds: { x: number; y: number }[][] = [];
    let time = 0;

    const currentMouse = { x: -9999, y: -9999 };
    const lastMouse = { x: -9999, y: -9999 };
    const assemblyAnchor = { x: -9999, y: -9999 }; 
    
    let isMouseMoving = false;
    let moveTimeout: NodeJS.Timeout;
    let activeShapeIndex = 0;

    // ЧИСТАЯ, ДОРОГАЯ ПАЛИТРА (Без лишнего шума, только теплый спектр)
    const colorNear = ["255, 255, 255", "251, 191, 36"];    // Ближние: Чистый белый и яркий янтарь
    const colorMid = ["245, 158, 11", "253, 224, 71"];      // Средние: Оранжевый и мягкое золото
    const colorFar = ["254, 215, 170", "255, 237, 213"];    // Дальние: Очень мягкий теплый фон (без фиолетового)

    const pickColor = (z: number) => {
      if (z > 1.2) return colorNear[Math.floor(Math.random() * colorNear.length)];
      if (z > 0.7) return colorMid[Math.floor(Math.random() * colorMid.length)];
      return colorFar[Math.floor(Math.random() * colorFar.length)];
    };

    const generateShapeClouds = (count: number) => {
      const offCtx = document.createElement("canvas").getContext("2d");
      if (!offCtx) return [];

      return SVGS.map((pathStr) => {
        const path = new Path2D(pathStr);
        const pts: { x: number; y: number }[] = [];
        let attempts = 0;

        while (pts.length < count && attempts < count * 350) {
          const x = Math.random() * 50;
          const y = Math.random() * 50;

          if (offCtx.isPointInPath(path, x, y)) {
            pts.push({ x: (x - 25) / 25, y: (y - 25) / 25 });
          }
          attempts++;
        }
        return pts;
      });
    };

    const init = (w: number, h: number) => {
      particles = [];
      const area = w * h;
      
      // БОЛЬШЕ ВОЗДУХА: Уменьшили количество точек
      const nodeCount = Math.min(Math.max(Math.floor(area / 7000), 80), 180);
      const shapeNodeCount = Math.floor(nodeCount * 0.75);

      shapeClouds = generateShapeClouds(shapeNodeCount);
      activeShapeIndex = Math.floor(Math.random() * shapeClouds.length);
      const cloud = shapeClouds[activeShapeIndex] || [];

      for (let i = 0; i < nodeCount; i++) {
        const z = Math.random() * 1.4 + 0.3; 
        const isShapeNode = i < shapeNodeCount;
        const pt = isShapeNode && cloud.length ? cloud[i % cloud.length] : { x: 0, y: 0 };

        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          vx: (Math.random() - 0.5) * 0.2, // Снизили начальную скорость
          vy: (Math.random() - 0.5) * 0.2,
          isShapeNode,
          shapeX: pt.x,
          shapeY: pt.y,
          baseSize: Math.random() * 1.5 + 1.0, // Слегка убавили размер базовых точек
          color: pickColor(z),
          pulseOffset: Math.random() * Math.PI * 10,
          pulseSpeed: Math.random() * 1.5 + 0.8, // Чуть замедлили пульсацию
          assemblyLevel: 0, 
        });
      }
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init(rect.width, rect.height);
    };

    const drawSynapse = (
      x1: number, y1: number, x2: number, y2: number,
      opacity: number, depth: number, assembly: number, pulseOffset: number, pulseSpeed: number
    ) => {
      // Аккуратная, полупрозрачная оранжевая базовая линия
      ctx.beginPath();
      ctx.strokeStyle = `rgba(245, 158, 11, ${opacity * 0.25})`;
      ctx.lineWidth = Math.max(0.4, depth * 0.6);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // НЕЙРОННЫЙ СИГНАЛ: Естественный, не "выжигающий" глаза
      if (opacity > 0.1) {
        const progress = (time * pulseSpeed + pulseOffset) % 1.5; 
        
        if (progress <= 1) {
          // Плавное появление и затухание сигнала (синусоида)
          const flashIntensity = Math.sin(progress * Math.PI);
          const signalOpacity = flashIntensity * opacity;

          if (signalOpacity > 0.02) {
            const signalX = x1 + (x2 - x1) * progress;
            const signalY = y1 + (y2 - y1) * progress;
            const signalSize = Math.max(1.0, depth * 1.2); // Сигнал теперь соразмерен линиям

            // Мягкий оранжевый шлейф
            ctx.beginPath();
            ctx.arc(signalX, signalY, signalSize * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245, 158, 11, ${signalOpacity * 0.6})`;
            ctx.fill();

            // Четкое белое ядро импульса
            ctx.beginPath();
            ctx.arc(signalX, signalY, signalSize * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, signalOpacity * 2)})`;
            ctx.fill();
          }
        }
      }
    };

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      time += 0.003; // Чуть замедлили глобальное время для большей "премиальности"

      ctx.clearRect(0, 0, w, h);

      const hasMouse = currentMouse.x > -1000;

      const dx = currentMouse.x - lastMouse.x;
      const dy = currentMouse.y - lastMouse.y;
      const mouseSpeed = Math.sqrt(dx * dx + dy * dy);
      
      lastMouse.x = currentMouse.x;
      lastMouse.y = currentMouse.y;

      if (mouseSpeed > 2) {
        isMouseMoving = true;
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
          isMouseMoving = false;
          if (currentMouse.x > -1000) {
            assemblyAnchor.x = currentMouse.x;
            assemblyAnchor.y = currentMouse.y;
            
            activeShapeIndex = (activeShapeIndex + 1) % shapeClouds.length;
            const cloud = shapeClouds[activeShapeIndex];
            let pIndex = 0;
            particles.forEach((p) => {
              if (p.isShapeNode) {
                const pt = cloud[pIndex % cloud.length];
                p.shapeX = pt.x;
                p.shapeY = pt.y;
                pIndex++;
              }
            });
          }
        }, 350); // Увеличили задержку перед сборкой — не суетимся
      }

      const parallaxBaseX = hasMouse ? currentMouse.x : w / 2;
      const parallaxBaseY = hasMouse ? currentMouse.y : h / 2;
      
      const shapeScale = Math.min(w, h) * 0.38;
      const gravityRadius = Math.min(w, h) * 0.6; // Немного увеличили радиус влияния

      // 1. ФИЗИКА
      particles.forEach((p) => {
        const dxAnchor = assemblyAnchor.x - p.x;
        const dyAnchor = assemblyAnchor.y - p.y;
        const distToAnchor = Math.sqrt(dxAnchor * dxAnchor + dyAnchor * dyAnchor) || 1;

        if (isMouseMoving || !hasMouse) {
          p.assemblyLevel = Math.max(0, p.assemblyLevel - 0.02); // Распадаются медленнее
        } else if (distToAnchor < gravityRadius) {
          // ПЛАВНОЕ стягивание (значительно уменьшен шаг)
          const pullStrength = 1 - (distToAnchor / gravityRadius);
          p.assemblyLevel = Math.min(1, p.assemblyLevel + 0.006 * pullStrength); 
        } else {
          p.assemblyLevel = Math.max(0, p.assemblyLevel - 0.01);
        }

        if (p.isShapeNode && p.assemblyLevel > 0.01) {
          const targetX = assemblyAnchor.x + p.shapeX * shapeScale * p.z;
          const targetY = assemblyAnchor.y + p.shapeY * shapeScale * p.z;

          // Магнитная сила сильно ослаблена для элегантности
          const pullForce = 0.005 * p.assemblyLevel; 
          p.vx += (targetX - p.x) * pullForce;
          p.vy += (targetY - p.y) * pullForce;
        } else {
          p.vx += (Math.random() - 0.5) * 0.02;
          p.vy += (Math.random() - 0.5) * 0.02;
          
          if (hasMouse) {
            const dxCursor = p.x - currentMouse.x;
            const dyCursor = p.y - currentMouse.y;
            const distCursor = Math.sqrt(dxCursor * dxCursor + dyCursor * dyCursor);
            if (distCursor < 150) {
                // Мягкое отталкивание от курсора
                const repelForce = (150 - distCursor) * 0.00008; 
                p.vx += (dxCursor / distCursor) * repelForce;
                p.vy += (dyCursor / distCursor) * repelForce;
            }
          }
        }

        // Ограничение скорости, чтобы точки "плавали", а не носились
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = p.assemblyLevel > 0 ? 1.8 : 0.8; 
        if (speed > maxSpeed) {
            p.vx = (p.vx / speed) * maxSpeed;
            p.vy = (p.vy / speed) * maxSpeed;
        }

        // Трение стало сильнее, чтобы гасить инерцию мягче
        const friction = 0.92 - (0.02 * p.assemblyLevel);
        p.vx *= friction;
        p.vy *= friction;

        p.x += p.vx;
        p.y += p.vy;

        const margin = 100;
        if (p.x < -margin) p.x = w + margin;
        if (p.x > w + margin) p.x = -margin;
        if (p.y < -margin) p.y = h + margin;
        if (p.y > h + margin) p.y = -margin;
      });

      // 2. ОТРИСОВКА СВЯЗЕЙ
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        let connections = 0;

        const drawX1 = p1.x + (parallaxBaseX - w / 2) * p1.z * 0.03;
        const drawY1 = p1.y + (parallaxBaseY - h / 2) * p1.z * 0.03;

        for (let j = i + 1; j < particles.length; j++) {
          if (connections > 3) break; // Снизили макс. количество связей для чистоты

          const p2 = particles[j];
          if (Math.abs(p1.z - p2.z) > 0.5) continue; 

          const drawX2 = p2.x + (parallaxBaseX - w / 2) * p2.z * 0.03;
          const drawY2 = p2.y + (parallaxBaseY - h / 2) * p2.z * 0.03;

          const dx = drawX1 - drawX2;
          const dy = drawY1 - drawY2;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const depth = (p1.z + p2.z) / 2;
          const assembly = (p1.assemblyLevel + p2.assemblyLevel) / 2;
          
          const maxDist = 90 + (60 * assembly) + (depth * 25);

          if (dist < maxDist) {
            connections++;

            const distanceAlpha = Math.pow((maxDist - dist) / maxDist, 1.2);
            const opacity = Math.min(0.8, distanceAlpha * (0.2 + assembly * 0.5) * depth);

            drawSynapse(
              drawX1, drawY1, drawX2, drawY2,
              opacity, depth, assembly,
              p1.pulseOffset + p2.pulseOffset,
              (p1.pulseSpeed + p2.pulseSpeed) / 2
            );
          }
        }
      }

      // 3. ОТРИСОВКА УЗЛОВ
      particles.forEach((p) => {
        const drawX = p.x + (parallaxBaseX - w / 2) * p.z * 0.03;
        const drawY = p.y + (parallaxBaseY - h / 2) * p.z * 0.03;

        const pulse = Math.sin(time * 2 + p.pulseOffset) * 0.1 + 0.9;
        const size = p.baseSize * Math.pow(p.z, 1.5) * pulse * (1 + p.assemblyLevel * 0.15);
        
        const alpha = Math.min(0.3 + p.z * 0.6 + p.assemblyLevel * 0.1, 1);

        // Аккуратное свечение (меньше радиус, мягче переход)
        const glowSize = size * 2.5;
        const glowGrad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, glowSize);
        glowGrad.addColorStop(0, `rgba(${p.color}, ${alpha * 0.5})`);
        glowGrad.addColorStop(1, `rgba(${p.color}, 0)`);
        
        ctx.beginPath();
        ctx.fillStyle = glowGrad;
        ctx.arc(drawX, drawY, glowSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(drawX, drawY, Math.max(size, 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
        ctx.fill();
        
        if (p.z > 1.2) {
          ctx.beginPath();
          ctx.arc(drawX - size * 0.2, drawY - size * 0.2, size * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      currentMouse.x = e.clientX - rect.left;
      currentMouse.y = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      currentMouse.x = -9999;
      currentMouse.y = -9999;
      assemblyAnchor.x = -9999;
      assemblyAnchor.y = -9999;
    };

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    resize();
    animate();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(moveTimeout);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-transparent"
    >
      <canvas ref={canvasRef} className="block h-full w-full opacity-100" />
    </div>
  );
};

export default PremiumBackground;