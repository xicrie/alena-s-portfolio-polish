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
  assemblyLevel: number; // От 0 (космос) до 1 (в фигуре)
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

    // --- МАТЕМАТИЧЕСКИЕ КОНТУРЫ ---
    const SVGS = [
      "M25 1 C36 7 45 16 49 25 C45 34 36 43 25 49 C14 43 5 34 1 25 C5 16 14 7 25 1 Z", // Мозг/Идея
      "M25 0 L47 13 L47 37 L25 50 L3 37 L3 13 Z", // Гексагон/Структура
      "M25 2 C13 2 5 10 5 22 C5 31 13 38 20 41 L20 48 L30 48 L30 41 C37 38 45 31 45 22 C45 10 37 2 25 2 Z", // Лампа/Инсайт
    ];

    let animationId = 0;
    let particles: Particle[] = [];
    let shapeClouds: { x: number; y: number }[][] = [];
    let time = 0;

    const currentMouse = { x: -9999, y: -9999 };
    const lastMouse = { x: -9999, y: -9999 };
    // Центр, где фигура зафиксировалась для сборки
    const assemblyAnchor = { x: -9999, y: -9999 }; 
    
    let isMouseMoving = false;
    let moveTimeout: NodeJS.Timeout;
    let activeShapeIndex = 0;

    // Палитра 3D
    const amberNear = ["251, 191, 36", "253, 224, 71"];     
    const amberMid = ["245, 158, 11", "217, 119, 6"];       
    const lilacFar = ["167, 139, 250", "148, 163, 184"];    

    const pickColor = (z: number) => {
      if (z > 1.1) return amberNear[Math.floor(Math.random() * amberNear.length)];
      if (z > 0.6) return amberMid[Math.floor(Math.random() * amberMid.length)];
      return lilacFar[Math.floor(Math.random() * lilacFar.length)];
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
            const nx = (x - 25) / 25;
            const ny = (y - 25) / 25;
            pts.push({ x: nx, y: ny });
          }
          attempts++;
        }
        return pts;
      });
    };

    const init = (w: number, h: number) => {
      particles = [];
      const area = w * h;
      
      const nodeCount = Math.min(Math.max(Math.floor(area / 4500), 160), 320);
      const shapeNodeCount = Math.floor(nodeCount * 0.7);

      shapeClouds = generateShapeClouds(shapeNodeCount);
      activeShapeIndex = Math.floor(Math.random() * shapeClouds.length);
      const cloud = shapeClouds[activeShapeIndex] || [];

      for (let i = 0; i < nodeCount; i++) {
        const z = Math.random() * 1.4 + 0.2; 
        const isShapeNode = i < shapeNodeCount;
        const pt = isShapeNode && cloud.length ? cloud[i % cloud.length] : { x: 0, y: 0 };

        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          vx: (Math.random() - 0.5) * 0.5, 
          vy: (Math.random() - 0.5) * 0.5,
          isShapeNode,
          shapeX: pt.x,
          shapeY: pt.y,
          baseSize: Math.random() * 1.5 + 1.0,
          color: pickColor(z),
          pulseOffset: Math.random() * Math.PI * 10,
          pulseSpeed: Math.random() * 2.5 + 1.5, // Увеличил скорость пульсации нейронов
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

    // Отрисовка синапсов и ВСПЫШЕК нейронов
    const drawSynapse = (
      x1: number, y1: number, x2: number, y2: number,
      opacity: number, depth: number, assembly: number, pulseOffset: number, pulseSpeed: number
    ) => {
      // 1. Паутина (очень мягкая)
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, `rgba(245, 158, 11, ${opacity * 0.2})`);
      grad.addColorStop(0.5, `rgba(251, 191, 36, ${opacity * 0.5})`);
      grad.addColorStop(1, `rgba(245, 158, 11, ${opacity * 0.2})`);

      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(0.4, depth * (0.5 + assembly * 0.5));
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // 2. НЕЙРОННЫЕ ВСПЫШКИ (Быстрые, с затуханием)
      if (opacity > 0.1) {
        // Делаем импульс очень быстрым
        const progress = (time * pulseSpeed * 1.5 + pulseOffset) % 1.5; 
        
        // Вспышка происходит только в начале цикла (от 0 до 1), потом пауза (от 1 до 1.5)
        if (progress <= 1) {
          // Математика вспышки (резко загорается, плавно гаснет)
          const flashIntensity = Math.sin(progress * Math.PI);
          const signalOpacity = flashIntensity * opacity * 2.5;

          if (signalOpacity > 0.05) {
            const signalX = x1 + (x2 - x1) * progress;
            const signalY = y1 + (y2 - y1) * progress;
            const signalSize = Math.max(1.5, depth * 2.2);

            // Мягкое свечение вспышки
            ctx.beginPath();
            ctx.arc(signalX, signalY, signalSize * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${signalOpacity * 0.3})`;
            ctx.fill();

            // Яркое ядро
            ctx.beginPath();
            ctx.arc(signalX, signalY, signalSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, signalOpacity)})`;
            ctx.fill();
          }
        }
      }
    };

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      time += 0.005;

      ctx.clearRect(0, 0, w, h);

      const hasMouse = currentMouse.x > -1000;

      // Логика "Рассыпания" при движении
      const dx = currentMouse.x - lastMouse.x;
      const dy = currentMouse.y - lastMouse.y;
      const mouseSpeed = Math.sqrt(dx * dx + dy * dy);
      
      lastMouse.x = currentMouse.x;
      lastMouse.y = currentMouse.y;

      if (mouseSpeed > 2) {
        isMouseMoving = true;
        clearTimeout(moveTimeout);
        // Фиксируем якорь для сборки, только когда мышь остановится
        moveTimeout = setTimeout(() => {
          isMouseMoving = false;
          if (currentMouse.x > -1000) {
            assemblyAnchor.x = currentMouse.x;
            assemblyAnchor.y = currentMouse.y;
            // При новой остановке меняем форму
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
        }, 300); // Мышь должна постоять 0.3 сек
      }

      // Базовый параллакс камеры
      const parallaxBaseX = hasMouse ? currentMouse.x : w / 2;
      const parallaxBaseY = hasMouse ? currentMouse.y : h / 2;
      
      const shapeScale = Math.min(w, h) * 0.38;
      const gravityRadius = Math.min(w, h) * 0.5;

      // 1. ФИЗИКА
      particles.forEach((p) => {
        // Расстояние до ЯКОРЯ сборки (а не до бегающего курсора)
        const dxAnchor = assemblyAnchor.x - p.x;
        const dyAnchor = assemblyAnchor.y - p.y;
        const distToAnchor = Math.sqrt(dxAnchor * dxAnchor + dyAnchor * dyAnchor) || 1;

        // Если мышь движется - фигура РАССЫПАЕТСЯ (уровень сборки падает)
        if (isMouseMoving || !hasMouse) {
          p.assemblyLevel = Math.max(0, p.assemblyLevel - 0.04);
        } else if (distToAnchor < gravityRadius) {
          // Если мышь стоит и точка в радиусе якоря - СБИРАЕМ
          const pullStrength = 1 - (distToAnchor / gravityRadius);
          p.assemblyLevel = Math.min(1, p.assemblyLevel + 0.015 * pullStrength);
        } else {
          // Точка далеко от якоря - забывает про фигуру
          p.assemblyLevel = Math.max(0, p.assemblyLevel - 0.02);
        }

        if (p.isShapeNode && p.assemblyLevel > 0.01) {
          // Притяжение к позиции в фигуре (относительно якоря)
          const targetX = assemblyAnchor.x + p.shapeX * shapeScale * p.z;
          const targetY = assemblyAnchor.y + p.shapeY * shapeScale * p.z;

          const pullForce = 0.02 * p.assemblyLevel;
          p.vx += (targetX - p.x) * pullForce;
          p.vy += (targetY - p.y) * pullForce;
        } else {
          // КОСМИЧЕСКИЙ ДРЕЙФ (Более активный, чтобы фон жил)
          p.vx += (Math.random() - 0.5) * 0.06;
          p.vy += (Math.random() - 0.5) * 0.06;
          
          // Легкое отталкивание от самого курсора (создает интерактив)
          if (hasMouse) {
            const dxCursor = p.x - currentMouse.x;
            const dyCursor = p.y - currentMouse.y;
            const distCursor = Math.sqrt(dxCursor * dxCursor + dyCursor * dyCursor);
            if (distCursor < 150) {
                const repelForce = (150 - distCursor) * 0.0002;
                p.vx += (dxCursor / distCursor) * repelForce;
                p.vy += (dyCursor / distCursor) * repelForce;
            }
          }
        }

        // Ограничитель скорости (убираем безумие по углам)
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = p.assemblyLevel > 0 ? 3 : 1.5; // В фигуре могут двигаться быстрее, в космосе медленно
        if (speed > maxSpeed) {
            p.vx = (p.vx / speed) * maxSpeed;
            p.vy = (p.vy / speed) * maxSpeed;
        }

        // Трение (очень мягкое)
        const friction = 0.96 - (0.04 * p.assemblyLevel);
        p.vx *= friction;
        p.vy *= friction;

        p.x += p.vx;
        p.y += p.vy;

        // Бесшовный космос
        const margin = 100;
        if (p.x < -margin) p.x = w + margin;
        if (p.x > w + margin) p.x = -margin;
        if (p.y < -margin) p.y = h + margin;
        if (p.y > h + margin) p.y = -margin;
      });

      // 2. ОТРИСОВКА СВЯЗЕЙ (Активнее в фоне)
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        let connections = 0;

        const drawX1 = p1.x + (parallaxBaseX - w / 2) * p1.z * 0.04;
        const drawY1 = p1.y + (parallaxBaseY - h / 2) * p1.z * 0.04;

        for (let j = i + 1; j < particles.length; j++) {
          if (connections > 4) break; 

          const p2 = particles[j];
          if (Math.abs(p1.z - p2.z) > 0.5) continue;

          const drawX2 = p2.x + (parallaxBaseX - w / 2) * p2.z * 0.04;
          const drawY2 = p2.y + (parallaxBaseY - h / 2) * p2.z * 0.04;

          const dx = drawX1 - drawX2;
          const dy = drawY1 - drawY2;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const depth = (p1.z + p2.z) / 2;
          const assembly = (p1.assemblyLevel + p2.assemblyLevel) / 2;
          
          // В фоне связи тоже есть, просто короче
          const maxDist = 70 + (70 * assembly) + (depth * 30);

          if (dist < maxDist) {
            connections++;

            const distanceAlpha = Math.pow((maxDist - dist) / maxDist, 1.2);
            // Фон тоже связывается (базовый opacity 0.15), в фигуре ярче
            const opacity = Math.min(0.85, distanceAlpha * (0.15 + assembly * 0.7) * depth);

            drawSynapse(
              drawX1, drawY1, drawX2, drawY2,
              opacity, depth, assembly,
              p1.pulseOffset + p2.pulseOffset,
              (p1.pulseSpeed + p2.pulseSpeed) / 2
            );
          }
        }
      }

      // 3. ОТРИСОВКА УЗЛОВ (Настоящее мягкое свечение)
      particles.forEach((p) => {
        const drawX = p.x + (parallaxBaseX - w / 2) * p.z * 0.04;
        const drawY = p.y + (parallaxBaseY - h / 2) * p.z * 0.04;

        const pulse = Math.sin(time * 3 + p.pulseOffset) * 0.2 + 0.8;
        const size = p.baseSize * Math.pow(p.z, 1.2) * pulse * (1 + p.assemblyLevel * 0.2);
        const alpha = Math.min(0.25 + p.z * 0.6 + p.assemblyLevel * 0.15, 1);

        // МЯГКОЕ СВЕЧЕНИЕ (Градиент вместо жесткого круга)
        // Рисуем свечение только для ближних или собранных точек
        if (p.z > 0.8 || p.assemblyLevel > 0.3) {
            const glowSize = size * 4;
            const glowGrad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, glowSize);
            glowGrad.addColorStop(0, `rgba(${p.color}, ${alpha * 0.4})`);
            glowGrad.addColorStop(0.3, `rgba(${p.color}, ${alpha * 0.15})`);
            glowGrad.addColorStop(1, `rgba(${p.color}, 0)`);
            
            ctx.beginPath();
            ctx.fillStyle = glowGrad;
            ctx.arc(drawX, drawY, glowSize, 0, Math.PI * 2);
            ctx.fill();
        }

        // Ядро
        ctx.beginPath();
        ctx.arc(drawX, drawY, Math.max(size, 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
        ctx.fill();
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