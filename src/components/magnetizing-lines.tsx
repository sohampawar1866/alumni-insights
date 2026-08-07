"use client";

import { useEffect, useRef } from "react";

// Normalize angle delta to [-π, π] so lines always take the shortest rotation path
function shortestAngle(from: number, to: number): number {
  let diff = to - from;
  while (diff > Math.PI)  diff -= 2 * Math.PI;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  return from + diff;
}

export default function MagnetizingLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SPACING   = 38;   // grid cell size in px
    const LINE_LEN  = 14;   // half-length of each dash (drawn -len to +len)
    const LINE_W    = 1.4;  // stroke width
    const LERP      = 0.07; // rotation smoothing speed (lower = more elastic)
    const COLOR     = "#1e293b"; // slate-800 — will be dimmed by container opacity

    type Agent = { x: number; y: number; angle: number };
    let agents: Agent[] = [];

    // Mouse in canvas-local coordinates
    const mouse = { x: -9999, y: -9999 };

    // ── Build the grid ────────────────────────────────────────────────────────
    const buildGrid = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      canvas.width  = W;
      canvas.height = H;

      agents = [];
      const cols = Math.ceil(W / SPACING) + 1;
      const rows = Math.ceil(H / SPACING) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Offset every other row for a staggered look (like Framer component)
          const offsetX = r % 2 === 0 ? 0 : SPACING / 2;
          agents.push({
            x: c * SPACING + offsetX,
            y: r * SPACING,
            angle: Math.random() * Math.PI * 2,  // initial random direction
          });
        }
      }
    };

    buildGrid();

    // ── Mouse tracking ────────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      // Drift slowly back toward default (horizontal) when mouse leaves
      mouse.x = -9999;
      mouse.y = -9999;
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    // Also track parent section so lines react even when hovering cards
    const section = canvas.parentElement;
    section?.addEventListener("mousemove", onMouseMove as EventListener);
    section?.addEventListener("mouseleave", onMouseLeave as EventListener);

    // ── Render loop ───────────────────────────────────────────────────────────
    let animId: number;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = COLOR;
      ctx.lineWidth   = LINE_W;
      ctx.lineCap     = "round";

      for (const agent of agents) {
        // Target angle: point toward mouse, or stay at idle (slight diagonal)
        let target: number;
        if (mouse.x > -1000) {
          const dx = mouse.x - agent.x;
          const dy = mouse.y - agent.y;
          target = Math.atan2(dy, dx);
        } else {
          // Idle: slow drift back toward a gentle diagonal
          target = Math.PI / 4;
        }

        // Smooth lerp with short-path correction
        agent.angle = shortestAngle(agent.angle, target);
        agent.angle += (target - agent.angle) * LERP;

        ctx.save();
        ctx.translate(agent.x, agent.y);
        ctx.rotate(agent.angle);
        ctx.beginPath();
        ctx.moveTo(-LINE_LEN, 0);
        ctx.lineTo( LINE_LEN, 0);
        ctx.stroke();
        ctx.restore();
      }
    };

    draw();

    // ── Resize observer ───────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      buildGrid();
    });
    ro.observe(canvas.parentElement ?? canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      section?.removeEventListener("mousemove", onMouseMove as EventListener);
      section?.removeEventListener("mouseleave", onMouseLeave as EventListener);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
