"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Vertex shader — passes UV coords to fragment
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader — applies ripple distortion based on mouse position and velocity
const fragmentShader = `
  uniform vec2 uMouse;
  uniform vec2 uPrevMouse;
  uniform float uTime;
  uniform float uStrength;
  varying vec2 vUv;

  // Gradient noise for organic look
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 uv = vUv;

    // Mouse velocity vector
    vec2 mouseDelta = uMouse - uPrevMouse;
    float speed = length(mouseDelta) * 12.0;

    // Distance from each pixel to the mouse cursor (in UV space)
    float dist = distance(uv, uMouse);

    // Ripple radius — how wide the distortion spreads
    float radius = 0.28;
    float falloff = 1.0 - smoothstep(0.0, radius, dist);

    // Push pixels away from cursor in the direction of motion
    vec2 displacement = mouseDelta * falloff * uStrength * 8.0;

    // Animated organic turbulence background
    float n = smoothNoise(uv * 4.0 + uTime * 0.15) * 0.012;
    vec2 turbulence = vec2(n, n);

    // Final displaced UV — this is what drives the colour distortion
    vec2 displacedUv = uv + displacement + turbulence * (0.3 + speed * 0.4);

    // ─── Colour palette: deep blue-indigo institutional gradient ──────────
    // Base layer — static navy / indigo background
    vec3 base = mix(
      vec3(0.031, 0.082, 0.169),   // deep navy  #080d2b
      vec3(0.063, 0.133, 0.329),   // royal blue  #102254
      smoothNoise(displacedUv * 3.0 + uTime * 0.08)
    );

    // Mid layer — swirling sapphire using displaced UVs
    float swirl = smoothNoise(displacedUv * 6.0 - uTime * 0.12);
    vec3 mid = mix(
      vec3(0.102, 0.212, 0.502),   // sapphire  #1a3680
      vec3(0.165, 0.349, 0.722),   // cornflower  #2a59b8
      swirl
    );

    // Highlight layer — electric cyan where cursor has disturbed
    float highlight = smoothstep(0.0, 0.12, falloff * uStrength);
    vec3 highlightColor = vec3(0.259, 0.710, 0.969);  // sky-blue  #42b5f7

    // Combine layers
    vec3 colour = mix(base, mid, swirl * 0.7);
    colour = mix(colour, highlightColor, highlight * 0.35);

    // Subtle vignette to ground the element on page
    float vignette = 1.0 - smoothstep(0.35, 0.85, length(uv - 0.5) * 1.4);
    colour *= 0.55 + 0.45 * vignette;

    gl_FragColor = vec4(colour, 1.0);
  }
`;

export default function LiquidHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ─── Scene setup ────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Full-viewport plane
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      uMouse:     { value: new THREE.Vector2(0.5, 0.5) },
      uPrevMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime:      { value: 0 },
      uStrength:  { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    scene.add(new THREE.Mesh(geometry, material));

    // ─── Mouse tracking ─────────────────────────────────────────────────────
    let targetMouse    = new THREE.Vector2(0.5, 0.5);
    let currentMouse   = new THREE.Vector2(0.5, 0.5);
    let targetStrength = 0;
    let currentStrength= 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.set(
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top)  / rect.height  // flip Y for GL coords
      );
      targetStrength = 1;
    };

    const onMouseLeave = () => {
      targetStrength = 0;
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    // ─── Render loop ─────────────────────────────────────────────────────────
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      uniforms.uTime.value += delta;

      // Smooth lerp: mouse position
      uniforms.uPrevMouse.value.copy(uniforms.uMouse.value);

      const lerpSpeed = 6 * delta;
      currentMouse.lerp(targetMouse, Math.min(lerpSpeed, 1));
      uniforms.uMouse.value.copy(currentMouse);

      // Smooth lerp: distortion strength (fast in, slow out)
      currentStrength += (targetStrength - currentStrength) * Math.min(5 * delta, 1);
      uniforms.uStrength.value = currentStrength;

      // Decay strength when mouse is idle
      targetStrength *= 0.96;

      renderer.render(scene, camera);
    };

    animate();

    // ─── Resize handler ──────────────────────────────────────────────────────
    const onResize = () => {
      if (!container) return;
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
