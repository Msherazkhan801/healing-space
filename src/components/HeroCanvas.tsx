"use client";

import React, { useEffect, useRef } from "react";

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Mouse coordinates for interactive gentle ripple
    let mouse = { x: width / 2, y: height / 2, radius: 150 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Particles array
    interface Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      color: string;
      alpha: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotSpeed: number;
      type: "spore" | "petal";
    }

    const particles: Particle[] = [];
    const particleCount = Math.min(width < 768 ? 35 : 75, 90);
    const colors = [
      "rgba(85, 141, 110, ",  // Sage
      "rgba(153, 116, 174, ", // Mauve / Lavender
      "rgba(212, 175, 55, ",  // Gold
      "rgba(123, 170, 141, ", // Light Sage
    ];

    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 5 + 2;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        size,
        density: Math.random() * 20 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.4 + 0.15,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.3 - 0.2, // slight upward float
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        type: Math.random() > 0.6 ? "petal" : "spore",
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render glowing soft auroras in the background
      const grad1 = ctx.createRadialGradient(
        width * 0.25,
        height * 0.3,
        20,
        width * 0.25,
        height * 0.3,
        width * 0.45
      );
      grad1.addColorStop(0, "rgba(85, 141, 110, 0.07)");
      grad1.addColorStop(1, "transparent");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(
        width * 0.8,
        height * 0.6,
        30,
        width * 0.8,
        height * 0.6,
        width * 0.5
      );
      grad2.addColorStop(0, "rgba(153, 116, 174, 0.07)");
      grad2.addColorStop(1, "transparent");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Render & Update Particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        // Wrap around boundaries
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Interactive mouse repulsion/drift
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          p.x -= forceDirectionX * force * 1.5;
          p.y -= forceDirectionY * force * 1.5;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === "petal") {
          // Soft botanical petal shape
          ctx.beginPath();
          ctx.fillStyle = `${p.color}${p.alpha})`;
          ctx.ellipse(0, 0, p.size * 1.8, p.size * 0.9, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Soft glowing spore
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.alpha})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = `${p.color}0.5)`;
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-80 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
}
