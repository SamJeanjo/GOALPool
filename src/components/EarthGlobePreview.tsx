"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function EarthGlobePreview() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    let frame = 0;
    let resizeObserver: ResizeObserver | null = null;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(3.2, 2.4, 4.2);
    scene.add(key);

    const goldKicker = new THREE.DirectionalLight(0xf7d774, 0.38);
    goldKicker.position.set(-2, 1.6, 3);
    scene.add(goldKicker);

    const rim = new THREE.DirectionalLight(0xa8c7ff, 0.76);
    rim.position.set(-3.4, -1.4, -2.2);
    scene.add(rim);

    const radius = 1;
    const ballMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x080d16,
      metalness: 0.48,
      roughness: 0.31,
      clearcoat: 0.78,
      clearcoatRoughness: 0.18,
      emissive: 0x020712,
      emissiveIntensity: 0.34,
      specularIntensity: 0.82,
    });

    const ball = new THREE.Mesh(new THREE.SphereGeometry(radius, 128, 128), ballMaterial);
    const tournamentBall = new THREE.Group();
    tournamentBall.add(ball);
    tournamentBall.rotation.z = 0.32;
    scene.add(tournamentBall);

    const seamMaterial = new THREE.LineBasicMaterial({
      color: 0xd9e6ff,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
    });
    const stitchMaterial = new THREE.LineBasicMaterial({
      color: 0xf7d774,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });

    const createCurveLine = (points: THREE.Vector3[], material: THREE.LineBasicMaterial) => {
      const curve = new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.5);
      const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(96));
      const line = new THREE.LineLoop(geometry, material);
      tournamentBall.add(line);
      return line;
    };

    const sphericalPoint = (lat: number, lon: number, scale = 1.012) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = lon * (Math.PI / 180);
      return new THREE.Vector3(
        scale * radius * Math.sin(phi) * Math.cos(theta),
        scale * radius * Math.cos(phi),
        -scale * radius * Math.sin(phi) * Math.sin(theta),
      );
    };

    for (let band = 0; band < 6; band += 1) {
      const lonOffset = band * 60;
      createCurveLine(
        Array.from({ length: 8 }, (_, index) => {
          const lat = Math.sin((index / 8) * Math.PI * 2) * 42;
          const lon = lonOffset + index * 42 + Math.cos((index / 8) * Math.PI * 2) * 14;
          return sphericalPoint(lat, lon);
        }),
        seamMaterial,
      );
    }

    for (let panel = 0; panel < 8; panel += 1) {
      const baseLon = panel * 45;
      createCurveLine(
        Array.from({ length: 6 }, (_, index) => {
          const angle = (index / 6) * Math.PI * 2;
          return sphericalPoint(Math.sin(angle) * 18, baseLon + Math.cos(angle) * 26, 1.016);
        }),
        stitchMaterial,
      );
    }

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.18, 64, 64),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        vertexShader: "varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
        fragmentShader: "varying vec3 vN; void main(){ float i = pow(0.62 - vN.z, 2.35); gl_FragColor = vec4(0.42,0.62,1.0,1.0)*i; }",
      }),
    );
    scene.add(atmosphere);

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height || 1;
      camera.updateProjectionMatrix();
    };

    const tick = () => {
      tournamentBall.rotation.y += 0.0024;
      tournamentBall.rotation.x = Math.sin(performance.now() * 0.00022) * 0.08;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };

    resize();
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    tick();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material.dispose();
        }
      });
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="earth-globe-host pointer-events-none absolute left-1/2 top-[42%] h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2"
      aria-hidden="true"
    >
      <div className="earth-globe-glow-2" />
      <div className="earth-globe-glow-1" />
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
