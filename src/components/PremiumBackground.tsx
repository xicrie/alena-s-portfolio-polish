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

    // ЧИСТАЯ ПАЛИТРА ДЛЯ СВЕТЛОГО САЙТА (Без темных/серых точек)
    const colorNear = ["251, 191, 36", "253, 224, 71"];     // Крупные ближние: Янтарь и Золото
    const colorMid = ["245, 158, 11", "234, 88, 12"];       // Средние: Глубокий Оранж
    const colorFar = ["216, 180, 254", "192, 132, 252"];    // Дальние: Мягкий, яркий сиреневый (космос)

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
      
      const nodeCount = Math.min(Math.max(Math.floor(area / 4000), 160), 300);
      const shapeNodeCount = Math.floor(nodeCount * 0.75);

      shapeClouds = generateShapeClouds(shapeNodeCount);
      activeShapeIndex = Math.floor(Math.random() * shapeClouds.length);
      const cloud = shapeClouds[activeShapeIndex] || [];

      for (let i = 0; i < nodeCount; i++) {
        // Увеличил разброс глубины (Z) от 0.3 до 1.7 для мощного 3D-эффекта
        const z = Math.random() * 1.4 + 0.3; 
        const isShapeNode = i < shapeNodeCount;
        const pt = isShapeNode && cloud.length ? cloud[i % cloud.length] : { x: 0, y: 0 };

        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          vx: (Math.random() - 0.5) * 0.3, 
          vy: (Math.random() - 0.5) * 0.3,
          isShapeNode,
          shapeX: pt.x,
          shapeY: pt.y,
          // Увеличил базовый размер: теперь они крупнее и заметнее
          baseSize: Math.random() * 2.0 + 1.5,
          color: pickColor(z),
          pulseOffset: Math.random() * Math.PI * 10,
          pulseSpeed: Math.random() * 2.0 + 1.0, 
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
      // Плавная линия связи
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, `rgba(245, 158, 11, ${opacity * 0.3})`);
      grad.addColorStop(0.5, `rgba(251, 191, 36, ${opacity * 0.8})`);
      grad.addColorStop(1, `rgba(245, 158, 11, ${opacity * 0.3})`);

      ctx.beginPath();
      ctx.strokeStyle = grad;
      // Линии стали чуть толще и заметнее
      ctx.lineWidth = Math.max(0.6, depth * (0.8 + assembly * 0.5));
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // НЕЙРОННЫЕ СИГНАЛЫ (Вспышки, которые бегают по связям)
      if (opacity > 0.15) {
        const progress = (time * pulseSpeed + pulseOffset) % 1.5; 
        
        if (progress <= 1) {
          const flashIntensity = Math.sin(progress * Math.PI);
          const signalOpacity = flashIntensity * opacity * 2.0;

          if (signalOpacity > 0.05) {
            const signalX = x1 + (x2 - x1) * progress;
            const signalY = y1 + (y2 - y1) * progress;
            const signalSize = Math.max(2.0, depth * 2.5); // Крупные вспышки

            // Оранжевое/Золотое свечение вокруг вспышки (чтобы было видно на белом)
            ctx.beginPath();
            ctx.arc(signalX, signalY, signalSize * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245, 158, 11, ${signalOpacity * 0.5})`;
            ctx.fill();

            // Яркое белое ядро вспышки
            ctx.beginPath();
            ctx.arc(signalX, signalY, signalSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, signalOpacity * 1.5)})`;
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
            
            // Плавно меняем форму при новой остановке
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
        }, 250); 
      }

      // Базовый параллакс (камера слегка следует за курсором)
      const parallaxBaseX = hasMouse ? currentMouse.x : w / 2;
      const parallaxBaseY = hasMouse ? currentMouse.y : h / 2;
      
      const shapeScale = Math.min(w, h) * 0.38;
      const gravityRadius = Math.min(w, h) * 0.5;

      // 1. ФИЗИКА (Гравитация и Инерция)
      particles.forEach((p) => {
        const dxAnchor = assemblyAnchor.x - p.x;
        const dyAnchor = assemblyAnchor.y - p.y;
        const distToAnchor = Math.sqrt(dxAnchor * dxAnchor + dyAnchor * dyAnchor) || 1;

        // Если мышь движется - фигура плавно РАССЫПАЕТСЯ
        if (isMouseMoving || !hasMouse) {
          p.assemblyLevel = Math.max(0, p.assemblyLevel - 0.03);
        } else if (distToAnchor < gravityRadius) {
          // Если мышь стоит и точка рядом - ПЛАВНО СТЯГИВАЕМ
          const pullStrength = 1 - (distToAnchor / gravityRadius);
          p.assemblyLevel = Math.min(1, p.assemblyLevel + 0.015 * pullStrength);
        } else {
          p.assemblyLevel = Math.max(0, p.assemblyLevel - 0.02);
        }

        if (p.isShapeNode && p.assemblyLevel > 0.01) {
          // Мягкое притяжение к точке в фигуре
          const targetX = assemblyAnchor.x + p.shapeX * shapeScale * p.z;
          const targetY = assemblyAnchor.y + p.shapeY * shapeScale * p.z;

          const pullForce = 0.015 * p.assemblyLevel;
          p.vx += (targetX - p.x) * pullForce;
          p.vy += (targetY - p.y) * pullForce;
        } else {
          // КОСМИЧЕСКИЙ ДРЕЙФ: плавно, без резких рывков
          p.vx += (Math.random() - 0.5) * 0.03;
          p.vy += (Math.random() - 0.5) * 0.03;
          
          // Отталкивание от самого курсора, чтобы точки обтекали его
          if (hasMouse) {
            const dxCursor = p.x - currentMouse.x;
            const dyCursor = p.y - currentMouse.y;
            const distCursor = Math.sqrt(dxCursor * dxCursor + dyCursor * dyCursor);
            if (distCursor < 180) {
                const repelForce = (180 - distCursor) * 0.00015;
                p.vx += (dxCursor / distCursor) * repelForce;
                p.vy += (dyCursor / distCursor) * repelForce;
            }
          }
        }

        // Ограничение скорости (чтобы не было хаоса)
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = p.assemblyLevel > 0 ? 3.5 : 1.5; 
        if (speed > maxSpeed) {
            p.vx = (p.vx / speed) * maxSpeed;
            p.vy = (p.vy / speed) * maxSpeed;
        }

        // Мягкое трение
        const friction = 0.95 - (0.04 * p.assemblyLevel);
        p.vx *= friction;
        p.vy *= friction;

        p.x += p.vx;
        p.y += p.vy;

        // Бесшовный экран
        const margin = 100;
        if (p.x < -margin) p.x = w + margin;
        if (p.x > w + margin) p.x = -margin;
        if (p.y < -margin) p.y = h + margin;
        if (p.y > h + margin) p.y = -margin;
      });

      // 2. ОТРИСОВКА СВЯЗЕЙ (Они теперь АКТИВНЫ в фоне)
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        let connections = 0;

        const drawX1 = p1.x + (parallaxBaseX - w / 2) * p1.z * 0.03;
        const drawY1 = p1.y + (parallaxBaseY - h / 2) * p1.z * 0.03;

        for (let j = i + 1; j < particles.length; j++) {
          if (connections > 4) break; 

          const p2 = particles[j];
          if (Math.abs(p1.z - p2.z) > 0.6) continue; // Связываем только близкие по Z слои

          const drawX2 = p2.x + (parallaxBaseX - w / 2) * p2.z * 0.03;
          const drawY2 = p2.y + (parallaxBaseY - h / 2) * p2.z * 0.03;

          const dx = drawX1 - drawX2;
          const dy = drawY1 - drawY2;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const depth = (p1.z + p2.z) / 2;
          const assembly = (p1.assemblyLevel + p2.assemblyLevel) / 2;
          
          // В фоне (assembly = 0) дистанция связи всё равно большая, они связываются
          const maxDist = 120 + (80 * assembly) + (depth * 30);

          if (dist < maxDist) {
            connections++;

            const distanceAlpha = Math.pow((maxDist - dist) / maxDist, 1.2);
            // Повысил базовое значение opacity до 0.35, чтобы в фоне связи были отлично видны
            const opacity = Math.min(0.9, distanceAlpha * (0.35 + assembly * 0.65) * depth);

            drawSynapse(
              drawX1, drawY1, drawX2, drawY2,
              opacity, depth, assembly,
              p1.pulseOffset + p2.pulseOffset,
              (p1.pulseSpeed + p2.pulseSpeed) / 2
            );
          }
        }
      }

      // 3. ОТРИСОВКА УЗЛОВ (Звезды / 3D-сферы)
      particles.forEach((p) => {
        const drawX = p.x + (parallaxBaseX - w / 2) * p.z * 0.03;
        const drawY = p.y + (parallaxBaseY - h / 2) * p.z * 0.03;

        const pulse = Math.sin(time * 3 + p.pulseOffset) * 0.15 + 0.85;
        
        // Мощный 3D размер: ближние (z > 1.5) будут ОГРОМНЫМИ, дальние (z < 0.5) мелкими
        const size = p.baseSize * Math.pow(p.z, 1.6) * pulse * (1 + p.assemblyLevel * 0.2);
        
        // Ближние точки яркие, дальние слегка прозрачные
        const alpha = Math.min(0.4 + p.z * 0.5 + p.assemblyLevel * 0.1, 1);

        // Оптическое свечение (Glow) вокруг шарика
        const glowSize = size * 3.5;
        const glowGrad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, glowSize);
        glowGrad.addColorStop(0, `rgba(${p.color}, ${alpha * 0.4})`);
        glowGrad.addColorStop(0.4, `rgba(${p.color}, ${alpha * 0.1})`);
        glowGrad.addColorStop(1, `rgba(${p.color}, 0)`);
        
        ctx.beginPath();
        ctx.fillStyle = glowGrad;
        ctx.arc(drawX, drawY, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Основное плотное ядро
        ctx.beginPath();
        ctx.arc(drawX, drawY, Math.max(size, 0.8), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
        ctx.fill();
        
        // Блик для самых крупных 3D-шариков (стеклянный эффект)
        if (p.z > 1.2) {
          ctx.beginPath();
          ctx.arc(drawX - size * 0.25, drawY - size * 0.25, size * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
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