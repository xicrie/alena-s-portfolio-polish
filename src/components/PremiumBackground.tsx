"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  z: number;
  vx: number;
  vy: number;
  isShapeNode: boolean;
  shapeX: number;
  shapeY: number;
  baseSize: number;
  color: string;
  isDust: boolean;
  pulseOffset: number;
  pulseSpeed: number;
  assemblyLevel: number;
  scatterSeed: number;
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
    const lastMouse = { x: -9999, y: -9999 };
    const gravityCenter = { x: -9999, y: -9999 };
    let smoothMouseSpeed = 0;
    let activeShapeIndex = 0;

    const amberNear = ["255, 214, 102", "251, 191, 36", "255, 232, 153"];
    const amberMid = ["245, 158, 11", "234, 179, 8", "217, 119, 6"];
    const amberFar = ["161, 98, 7", "180, 132, 58", "120, 92, 56"];

    const pickColor = (z: number, isDust: boolean) => {
      if (isDust) return amberFar[Math.floor(Math.random() * amberFar.length)];
      if (z > 1.18) return amberNear[Math.floor(Math.random() * amberNear.length)];
      if (z > 0.68) return amberMid[Math.floor(Math.random() * amberMid.length)];
      return amberFar[Math.floor(Math.random() * amberFar.length)];
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

            pts.push({
              x: nx + Math.sin(ny * 5) * 0.035,
              y: ny + Math.cos(nx * 4) * 0.025,
            });
          }

          attempts++;
        }

        return pts;
      });
    };

    const applyShape = (shapeIndex: number) => {
      const cloud = shapeClouds[shapeIndex];
      if (!cloud?.length) return;

      let pIndex = 0;

      particles.forEach((p) => {
        if (!p.isDust && p.isShapeNode) {
          const pt = cloud[pIndex % cloud.length];
          p.shapeX = pt.x;
          p.shapeY = pt.y;
          pIndex++;
        }
      });
    };

    const init = (w: number, h: number) => {
      particles = [];

      const area = w * h;
      const nodeCount = Math.min(Math.max(Math.floor(area / 4300), 140), 280);
      const dustCount = Math.min(Math.max(Math.floor(area / 5400), 55), 115);
      const shapeNodeCount = Math.floor(nodeCount * 0.74);

      shapeClouds = generateShapeClouds(shapeNodeCount);
      activeShapeIndex = Math.floor(Math.random() * Math.max(shapeClouds.length, 1));

      const cloud = shapeClouds[activeShapeIndex] || [];

      for (let i = 0; i < nodeCount; i++) {
        const z = Math.random() * 1.4 + 0.28;
        const isShapeNode = i < shapeNodeCount;
        const pt = isShapeNode && cloud.length ? cloud[i % cloud.length] : { x: 0, y: 0 };

        const x = Math.random() * w;
        const y = Math.random() * h;

        particles.push({
          x,
          y,
          homeX: x,
          homeY: y,
          z,
          vx: (Math.random() - 0.5) * 0.13,
          vy: (Math.random() - 0.5) * 0.13,
          isShapeNode,
          shapeX: pt.x,
          shapeY: pt.y,
          baseSize: Math.random() * 1.25 + 0.75,
          color: pickColor(z, false),
          isDust: false,
          pulseOffset: Math.random() * Math.PI * 10,
          pulseSpeed: Math.random() * 0.9 + 0.45,
          assemblyLevel: 0,
          scatterSeed: Math.random() * Math.PI * 2,
        });
      }

      for (let i = 0; i < dustCount; i++) {
        const z = Math.random() * 0.62 + 0.12;
        const x = Math.random() * w;
        const y = Math.random() * h;

        particles.push({
          x,
          y,
          homeX: x,
          homeY: y,
          z,
          vx: (Math.random() - 0.5) * 0.045,
          vy: (Math.random() - 0.5) * 0.045,
          isShapeNode: false,
          shapeX: 0,
          shapeY: 0,
          baseSize: Math.random() * 0.75 + 0.18,
          color: pickColor(z, true),
          isDust: true,
          pulseOffset: Math.random() * Math.PI * 10,
          pulseSpeed: Math.random() * 0.4 + 0.22,
          assemblyLevel: 0,
          scatterSeed: Math.random() * Math.PI * 2,
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
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      opacity: number,
      depth: number,
      assembly: number,
      seed: number
    ) => {
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);

      grad.addColorStop(0, `rgba(245, 158, 11, ${opacity * 0.25})`);
      grad.addColorStop(0.42, `rgba(255, 214, 102, ${opacity})`);
      grad.addColorStop(1, `rgba(245, 158, 11, ${opacity * 0.18})`);

      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(0.38, depth * (0.45 + assembly * 0.9));
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      const phase = (time * (0.55 + assembly * 0.65) + seed) % 1;
      const signalVisible = Math.sin((phase + seed) * Math.PI * 2) > -0.25;

      if (!signalVisible) return;

      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;

      const ux = dx / len;
      const uy = dy / len;

      const head = phase;
      const tail = Math.max(0, head - 0.18);

      const sx = x1 + dx * tail;
      const sy = y1 + dy * tail;
      const ex = x1 + dx * head;
      const ey = y1 + dy * head;

      const impulseOpacity = opacity * (0.75 + assembly * 0.8);
      const impulseGrad = ctx.createLinearGradient(sx, sy, ex, ey);

      impulseGrad.addColorStop(0, `rgba(255, 214, 102, 0)`);
      impulseGrad.addColorStop(0.45, `rgba(255, 231, 168, ${impulseOpacity * 0.65})`);
      impulseGrad.addColorStop(1, `rgba(255, 255, 235, ${impulseOpacity})`);

      ctx.beginPath();
      ctx.strokeStyle = impulseGrad;
      ctx.lineWidth = Math.max(0.8, depth * (1.25 + assembly * 1.2));
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(ex + ux * 1.2, ey + uy * 1.2, Math.max(1, depth * 1.55), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 246, 210, ${impulseOpacity})`;
      ctx.fill();
    };

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      time += 0.006;
      ctx.clearRect(0, 0, w, h);

      const hasMouse = currentMouse.x > -1000;

      const mdx = currentMouse.x - lastMouse.x;
      const mdy = currentMouse.y - lastMouse.y;
      const rawSpeed = hasMouse ? Math.sqrt(mdx * mdx + mdy * mdy) : 0;

      smoothMouseSpeed = smoothMouseSpeed * 0.86 + rawSpeed * 0.14;

      lastMouse.x = currentMouse.x;
      lastMouse.y = currentMouse.y;

      if (hasMouse) {
        if (gravityCenter.x < -1000) {
          gravityCenter.x = currentMouse.x;
          gravityCenter.y = currentMouse.y;
        }

        const follow = smoothMouseSpeed > 10 ? 0.085 : 0.042;
        gravityCenter.x += (currentMouse.x - gravityCenter.x) * follow;
        gravityCenter.y += (currentMouse.y - gravityCenter.y) * follow;
      }

      const parallaxBaseX = hasMouse ? currentMouse.x : w / 2;
      const parallaxBaseY = hasMouse ? currentMouse.y : h / 2;

      const nodes = particles.filter((p) => !p.isDust);

      const shapeScale = Math.min(Math.max(Math.min(w, h) * 0.34, 220), 430);
      const captureRadius = Math.min(330, Math.max(210, Math.min(w, h) * 0.3));
      const repelRadius = Math.min(680, Math.max(410, Math.min(w, h) * 0.62));

      particles.forEach((p) => {
        const dxMouse = p.x - currentMouse.x;
        const dyMouse = p.y - currentMouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse) || 1;

        if (!hasMouse) {
          p.assemblyLevel = Math.max(0, p.assemblyLevel - 0.01);
        } else if (!p.isDust && p.isShapeNode) {
          if (distMouse < captureRadius) {
            const closeness = 1 - distMouse / captureRadius;
            p.assemblyLevel = Math.min(1, p.assemblyLevel + 0.01 + closeness * 0.032);
          } else {
            const farDrop = smoothMouseSpeed > 2 ? 0.023 : 0.007;
            p.assemblyLevel = Math.max(0, p.assemblyLevel - farDrop);
          }
        }

        if (!p.isDust && p.isShapeNode && p.assemblyLevel > 0.001 && hasMouse) {
          const depthScale = 0.78 + p.z * 0.18;
          const targetX = gravityCenter.x + p.shapeX * shapeScale * depthScale;
          const targetY = gravityCenter.y + p.shapeY * shapeScale * depthScale;

          const pull = 0.002 + p.assemblyLevel * 0.016;
          p.vx += (targetX - p.x) * pull * p.assemblyLevel;
          p.vy += (targetY - p.y) * pull * p.assemblyLevel;
        }

        if (hasMouse && distMouse > captureRadius * 0.78 && distMouse < repelRadius) {
          const repelZone =
            1 - (distMouse - captureRadius * 0.78) / (repelRadius - captureRadius * 0.78);
          const speedBoost = Math.min(smoothMouseSpeed / 30, 1);
          const repel = (0.018 + speedBoost * 0.2) * repelZone * (p.isDust ? 0.5 : 1);

          p.vx += (dxMouse / distMouse) * repel;
          p.vy += (dyMouse / distMouse) * repel;
        }

        const homePull = p.isDust ? 0.00007 : 0.00015 * (1 - p.assemblyLevel);
        p.vx += (p.homeX - p.x) * homePull;
        p.vy += (p.homeY - p.y) * homePull;

        const cosmicDrift = p.isDust ? 0.008 : 0.012 * (1 - p.assemblyLevel);
        p.vx += Math.cos(time * 0.7 + p.scatterSeed) * cosmicDrift * p.z;
        p.vy += Math.sin(time * 0.6 + p.scatterSeed) * cosmicDrift * p.z;

        const friction = p.isDust ? 0.993 : 0.96 - p.assemblyLevel * 0.036;

        p.vx *= friction;
        p.vy *= friction;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -140) {
          p.x = w + 140;
          p.homeX = p.x;
        }

        if (p.x > w + 140) {
          p.x = -140;
          p.homeX = p.x;
        }

        if (p.y < -140) {
          p.y = h + 140;
          p.homeY = p.y;
        }

        if (p.y > h + 140) {
          p.y = -140;
          p.homeY = p.y;
        }
      });

      for (let i = 0; i < nodes.length; i++) {
        const p1 = nodes[i];
        let connections = 0;

        const drawX1 = p1.x + (parallaxBaseX - w / 2) * p1.z * 0.034;
        const drawY1 = p1.y + (parallaxBaseY - h / 2) * p1.z * 0.034;

        for (let j = i + 1; j < nodes.length; j++) {
          if (connections > 6) break;

          const p2 = nodes[j];
          const depthDiff = Math.abs(p1.z - p2.z);

          if (depthDiff > 0.58) continue;

          const drawX2 = p2.x + (parallaxBaseX - w / 2) * p2.z * 0.034;
          const drawY2 = p2.y + (parallaxBaseY - h / 2) * p2.z * 0.034;

          const dx = drawX1 - drawX2;
          const dy = drawY1 - drawY2;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const assembly = (p1.assemblyLevel + p2.assemblyLevel) / 2;
          const depth = (p1.z + p2.z) / 2;

          const freeNetworkBoost = assembly < 0.18 ? 58 : 28;
          const maxDist = 86 + depth * 72 + assembly * 125 + freeNetworkBoost;

          if (dist < maxDist) {
            connections++;

            const distanceAlpha = Math.pow((maxDist - dist) / maxDist, 1.45);
            const baseAlpha = 0.16 + assembly * 0.38;
            const depthAlpha = Math.min(1, 0.45 + depth * 0.42);
            const opacity = Math.min(0.72, distanceAlpha * baseAlpha * depthAlpha);

            drawSynapse(
              drawX1,
              drawY1,
              drawX2,
              drawY2,
              opacity,
              depth,
              assembly,
              p1.pulseOffset + p2.pulseOffset
            );
          }
        }
      }

      particles.forEach((p) => {
        const drawX = p.x + (parallaxBaseX - w / 2) * p.z * 0.034;
        const drawY = p.y + (parallaxBaseY - h / 2) * p.z * 0.034;

        const pulse = Math.sin(time * 2.2 + p.pulseOffset) * 0.08 + 0.92;
        const depthSize = Math.pow(p.z, 1.08);
        const size = p.baseSize * depthSize * pulse * (1 + p.assemblyLevel * 0.28);

        const dustTwinkle = p.isDust
          ? Math.sin(time * p.pulseSpeed * 1.8 + p.pulseOffset) * 0.22 + 0.58
          : 1;

        const alpha = p.isDust
          ? 0.12 * dustTwinkle + p.z * 0.06
          : Math.min(0.24 + p.z * 0.42 + p.assemblyLevel * 0.22, 0.86);

        if (!p.isDust) {
          const softGlow = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, size * 7.5);
          softGlow.addColorStop(0, `rgba(${p.color}, ${0.16 + p.assemblyLevel * 0.06})`);
          softGlow.addColorStop(0.42, `rgba(${p.color}, ${0.045 + p.assemblyLevel * 0.025})`);
          softGlow.addColorStop(1, `rgba(${p.color}, 0)`);

          ctx.beginPath();
          ctx.fillStyle = softGlow;
          ctx.arc(drawX, drawY, size * 7.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(drawX, drawY, Math.max(size, 0.22), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
        ctx.fill();

        if (!p.isDust && p.z > 1.18) {
          ctx.beginPath();
          ctx.arc(drawX - size * 0.18, drawY - size * 0.18, size * 0.24, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 238, ${0.22 + p.assemblyLevel * 0.18})`;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    const changeShape = () => {
      if (!shapeClouds.length) return;

      activeShapeIndex = (activeShapeIndex + 1) % shapeClouds.length;
      applyShape(activeShapeIndex);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();

      currentMouse.x = e.clientX - rect.left;
      currentMouse.y = e.clientY - rect.top;

      if (gravityCenter.x < -1000) {
        gravityCenter.x = currentMouse.x;
        gravityCenter.y = currentMouse.y;
        changeShape();
      }
    };

    const onMouseLeave = () => {
      currentMouse.x = -9999;
      currentMouse.y = -9999;
      gravityCenter.x = -9999;
      gravityCenter.y = -9999;
    };

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("click", changeShape);

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