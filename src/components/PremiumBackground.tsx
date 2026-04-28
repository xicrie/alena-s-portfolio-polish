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

    // --- МАТЕМАТИЧЕСКИЕ КОНТУРЫ (Идеи, Технологии, Нейросети) ---
    const SVGS = [
      "M25 1 C36 7 45 16 49 25 C45 34 36 43 25 49 C14 43 5 34 1 25 C5 16 14 7 25 1 Z",
      "M25 0 L47 13 L47 37 L25 50 L3 37 L3 13 Z",
      "M25 2 C13 2 5 10 5 22 C5 31 13 38 20 41 L20 48 L30 48 L30 41 C37 38 45 31 45 22 C45 10 37 2 25 2 Z",
    ];

    let animationId = 0;
    let particles: Particle[] = [];
    let shapeClouds: { x: number; y: number }[][] = [];
    let time = 0;

    const currentMouse = { x: -9999, y: -9999 };
    const gravityCenter = { x: -9999, y: -9999 };
    let activeShapeIndex = 0;

    // Палитра 3D: Ближние (Янтарь), Средние (Оранж), Дальние (Сиреневый космос)
    const amberNear = ["251, 191, 36", "253, 224, 71"];     // Яркий янтарь
    const amberMid = ["245, 158, 11", "217, 119, 6"];       // Глубокий оранжевый
    const lilacFar = ["167, 139, 250", "148, 163, 184"];    // Сиреневый и графитовый (космос)

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
      
      // Оптимальное количество частиц для технологичной плотности
      const nodeCount = Math.min(Math.max(Math.floor(area / 4500), 150), 300);
      const shapeNodeCount = Math.floor(nodeCount * 0.8);

      shapeClouds = generateShapeClouds(shapeNodeCount);
      activeShapeIndex = Math.floor(Math.random() * shapeClouds.length);
      const cloud = shapeClouds[activeShapeIndex] || [];

      for (let i = 0; i < nodeCount; i++) {
        const z = Math.random() * 1.4 + 0.2; // Глубина 3D (от 0.2 до 1.6)
        const isShapeNode = i < shapeNodeCount;
        const pt = isShapeNode && cloud.length ? cloud[i % cloud.length] : { x: 0, y: 0 };

        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          vx: (Math.random() - 0.5) * 0.2, // Очень медленный начальный дрейф
          vy: (Math.random() - 0.5) * 0.2,
          isShapeNode,
          shapeX: pt.x,
          shapeY: pt.y,
          baseSize: Math.random() * 1.5 + 1.0,
          color: pickColor(z),
          pulseOffset: Math.random() * Math.PI * 10,
          pulseSpeed: Math.random() * 1.5 + 0.5,
          assemblyLevel: 0, // 0 = космос, 1 = в фигуре
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

    // Отрисовка связей и белых импульсов
    const drawSynapse = (
      x1: number, y1: number, x2: number, y2: number,
      opacity: number, depth: number, assembly: number, pulseOffset: number, pulseSpeed: number
    ) => {
      // 1. Рисуем саму линию (паутину)
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, `rgba(245, 158, 11, ${opacity * 0.3})`);
      grad.addColorStop(0.5, `rgba(251, 191, 36, ${opacity * 0.8})`);
      grad.addColorStop(1, `rgba(245, 158, 11, ${opacity * 0.3})`);

      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(0.5, depth * (0.5 + assembly * 0.8));
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // 2. Рисуем технологичные БЕЛЫЕ НЕЙРОНЫ (только если связь достаточно прочная)
      if (opacity > 0.15) {
        const progress = (time * pulseSpeed + pulseOffset) % 1;
        
        // Импульс появляется и исчезает плавно
        const signalOpacity = Math.sin(progress * Math.PI) * opacity * 1.5;
        
        if (signalOpacity > 0.05) {
          const signalX = x1 + (x2 - x1) * progress;
          const signalY = y1 + (y2 - y1) * progress;
          const signalSize = Math.max(1.2, depth * 1.8);

          // Свечение (Glow)
          ctx.beginPath();
          ctx.arc(signalX, signalY, signalSize * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${signalOpacity * 0.4})`;
          ctx.fill();

          // Яркое ядро
          ctx.beginPath();
          ctx.arc(signalX, signalY, signalSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, signalOpacity * 2)})`;
          ctx.fill();
        }
      }
    };

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      time += 0.004; // Замедлил общее время для плавности

      ctx.clearRect(0, 0, w, h);

      const hasMouse = currentMouse.x > -1000;

      // Плавное следование центра гравитации за курсором
      if (hasMouse) {
        if (gravityCenter.x < -1000) {
          gravityCenter.x = currentMouse.x;
          gravityCenter.y = currentMouse.y;
        }
        gravityCenter.x += (currentMouse.x - gravityCenter.x) * 0.05;
        gravityCenter.y += (currentMouse.y - gravityCenter.y) * 0.05;
      }

      // Настройки 3D и радиуса притяжения
      const parallaxBaseX = hasMouse ? gravityCenter.x : w / 2;
      const parallaxBaseY = hasMouse ? gravityCenter.y : h / 2;
      const shapeScale = Math.min(w, h) * 0.35;
      
      // Радиус, в котором курсор захватывает частицы
      const gravityRadius = Math.min(w, h) * 0.45;

      // 1. ФИЗИКА (Плавный космос + Локальная гравитация)
      particles.forEach((p) => {
        const dxCenter = gravityCenter.x - p.x;
        const dyCenter = gravityCenter.y - p.y;
        const distToCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter) || 1;

        if (hasMouse && distToCenter < gravityRadius) {
          // Если мышь рядом — точка плавно "захватывается" системой
          const pullStrength = 1 - (distToCenter / gravityRadius);
          p.assemblyLevel = Math.min(1, p.assemblyLevel + 0.02 * pullStrength);
        } else {
          // Если мышь далеко или её нет — точка плавно отпускается в космос
          p.assemblyLevel = Math.max(0, p.assemblyLevel - 0.015);
        }

        // Применяем силы в зависимости от того, в космосе точка или в фигуре
        if (p.isShapeNode && p.assemblyLevel > 0.01) {
          // Мягкое стягивание в фигуру (только захваченных точек)
          const targetX = gravityCenter.x + p.shapeX * shapeScale * p.z;
          const targetY = gravityCenter.y + p.shapeY * shapeScale * p.z;

          const pullForce = 0.015 * p.assemblyLevel;
          p.vx += (targetX - p.x) * pullForce;
          p.vy += (targetY - p.y) * pullForce;
        } else {
          // Броуновское орбитальное движение в свободном космосе (как звезды)
          p.vx += (Math.random() - 0.5) * 0.03;
          p.vy += (Math.random() - 0.5) * 0.03;
        }

        // Инерция (трение). В фигуре тормозит сильнее, чтобы держать форму.
        const friction = 0.95 - (0.05 * p.assemblyLevel);
        p.vx *= friction;
        p.vy *= friction;

        // Дыхание
        p.x += p.vx + Math.sin(time + p.pulseOffset) * 0.1;
        p.y += p.vy + Math.cos(time + p.pulseOffset) * 0.1;

        // Бесшовный космос (вылетает за край - появляется с другой стороны)
        const margin = 150;
        if (p.x < -margin) p.x = w + margin;
        if (p.x > w + margin) p.x = -margin;
        if (p.y < -margin) p.y = h + margin;
        if (p.y > h + margin) p.y = -margin;
      });

      // 2. ОТРИСОВКА СВЯЗЕЙ
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        let connections = 0;

        // 3D параллакс для начальной точки
        const drawX1 = p1.x + (parallaxBaseX - w / 2) * p1.z * 0.05;
        const drawY1 = p1.y + (parallaxBaseY - h / 2) * p1.z * 0.05;

        for (let j = i + 1; j < particles.length; j++) {
          if (connections > 4) break; // Ограничение связей, чтобы не было "каши"

          const p2 = particles[j];
          
          // Соединяем только точки примерно на одной глубине (эффект 3D слоев)
          if (Math.abs(p1.z - p2.z) > 0.4) continue;

          const drawX2 = p2.x + (parallaxBaseX - w / 2) * p2.z * 0.05;
          const drawY2 = p2.y + (parallaxBaseY - h / 2) * p2.z * 0.05;

          const dx = drawX1 - drawX2;
          const dy = drawY1 - drawY2;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const depth = (p1.z + p2.z) / 2;
          const assembly = (p1.assemblyLevel + p2.assemblyLevel) / 2;
          
          // В системе связи тянутся дальше, в космосе — короче
          const maxDist = 90 + (60 * assembly) + (depth * 30);

          if (dist < maxDist) {
            connections++;

            // Плавное затухание связи в зависимости от расстояния
            const distanceAlpha = Math.pow((maxDist - dist) / maxDist, 1.5);
            const opacity = Math.min(0.8, distanceAlpha * (0.2 + assembly * 0.6) * depth);

            drawSynapse(
              drawX1, drawY1, drawX2, drawY2,
              opacity, depth, assembly,
              p1.pulseOffset + p2.pulseOffset,
              (p1.pulseSpeed + p2.pulseSpeed) / 2
            );
          }
        }
      }

      // 3. ОТРИСОВКА УЗЛОВ (Звезды/Нейроны)
      particles.forEach((p) => {
        const drawX = p.x + (parallaxBaseX - w / 2) * p.z * 0.05;
        const drawY = p.y + (parallaxBaseY - h / 2) * p.z * 0.05;

        // Пульсация размера
        const pulse = Math.sin(time * 3 + p.pulseOffset) * 0.15 + 0.85;
        // 3D размер: чем ближе (z больше), тем крупнее
        const size = p.baseSize * Math.pow(p.z, 1.2) * pulse * (1 + p.assemblyLevel * 0.3);

        const alpha = Math.min(0.3 + p.z * 0.5 + p.assemblyLevel * 0.2, 1);

        // Гало (свечение)
        if (p.z > 0.6 || p.assemblyLevel > 0.5) {
          const glowAlpha = alpha * (0.15 + p.assemblyLevel * 0.15);
          ctx.beginPath();
          ctx.fillStyle = `rgba(${p.color}, ${glowAlpha})`;
          ctx.arc(drawX, drawY, size * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Ядро точки
        ctx.beginPath();
        ctx.arc(drawX, drawY, Math.max(size, 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
        ctx.fill();

        // 3D Блик для самых крупных и близких точек
        if (p.z > 1.1) {
          ctx.beginPath();
          ctx.arc(drawX - size * 0.2, drawY - size * 0.2, size * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    const changeShape = () => {
      if (!shapeClouds.length) return;
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
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      currentMouse.x = e.clientX - rect.left;
      currentMouse.y = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      currentMouse.x = -9999;
      currentMouse.y = -9999;
    };

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("click", changeShape); // Смена фигуры по клику

    resize();
    animate();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("click", changeShape);
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