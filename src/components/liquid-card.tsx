"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec2 uMouse;
  uniform vec2 uPrevMouse;
  uniform float uTime;
  uniform float uStrength;
  varying vec2 vUv;

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
    vec2 mouseDelta = uMouse - uPrevMouse;
    float dist = distance(uv, uMouse);
    float radius = 0.45;
    float falloff = 1.0 - smoothstep(0.0, radius, dist);
    vec2 displacement = mouseDelta * falloff * uStrength * 10.0;
    float n = smoothNoise(uv * 4.0 + uTime * 0.18) * 0.015;
    vec2 displacedUv = uv + displacement + vec2(n, n);

    // Deep blue-indigo palette matching hero — slightly lighter for cards
    vec3 base = mix(
      vec3(0.055, 0.118, 0.247),   // dark navy
      vec3(0.094, 0.188, 0.408),   // royal blue
      smoothNoise(displacedUv * 3.0 + uTime * 0.1)
    );
    float swirl = smoothNoise(displacedUv * 7.0 - uTime * 0.14);
    vec3 mid = mix(
      vec3(0.149, 0.282, 0.580),   // sapphire
      vec3(0.224, 0.431, 0.761),   // cornflower
      swirl
    );
    float highlight = smoothstep(0.0, 0.15, falloff * uStrength);
    vec3 highlightColor = vec3(0.376, 0.773, 0.984);   // sky blue

    vec3 colour = mix(base, mid, swirl * 0.65);
    colour = mix(colour, highlightColor, highlight * 0.4);

    // Gentle vignette to soften card edges
    float vignette = 1.0 - smoothstep(0.25, 0.75, length(uv - 0.5) * 1.6);
    colour *= 0.6 + 0.4 * vignette;

    gl_FragColor = vec4(colour, 1.0);
  }
`;

export default function LiquidCard() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      uMouse:     { value: new THREE.Vector2(0.5, 0.5) },
      uPrevMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime:      { value: 0 },
      uStrength:  { value: 0 },
    };

    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    scene.add(new THREE.Mesh(geometry, material));

    let targetMouse    = new THREE.Vector2(0.5, 0.5);
    let currentMouse   = new THREE.Vector2(0.5, 0.5);
    let targetStrength = 0;
    let currentStrength= 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.set(
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height
      );
      targetStrength = 1;
    };

    const onMouseLeave = () => { targetStrength = 0; };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      uniforms.uTime.value += delta;
      uniforms.uPrevMouse.value.copy(uniforms.uMouse.value);
      currentMouse.lerp(targetMouse, Math.min(6 * delta, 1));
      uniforms.uMouse.value.copy(currentMouse);
      currentStrength += (targetStrength - currentStrength) * Math.min(5 * delta, 1);
      uniforms.uStrength.value = currentStrength;
      targetStrength *= 0.95;
      renderer.render(scene, camera);
    };

    animate();

    const ro = new ResizeObserver(() => {
      if (!container) return;
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden"
      aria-hidden="true"
    />
  );
}
