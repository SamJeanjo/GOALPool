"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { feature } from "topojson-client";

type LandGeometry = {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
};

type LandFeature = {
  geometry: LandGeometry | null;
};

type LandCollection = {
  features: LandFeature[];
};

type WorldAtlasTopology = {
  objects: {
    land: object;
  };
};

export function EarthGlobePreview() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    let disposed = false;
    let frame = 0;
    let resizeObserver: ResizeObserver | null = null;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 4.6);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    const key = new THREE.DirectionalLight(0xffffff, 1);
    key.position.set(3, 2.5, 4);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x88aaff, 0.7);
    rim.position.set(-3, -1, -2);
    scene.add(rim);

    const radius = 1;
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 0.985, 96, 96),
      new THREE.MeshPhongMaterial({ color: 0x0a1424, shininess: 24, specular: 0x1a3050 }),
    );

    const atmos = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.18, 64, 64),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        vertexShader: "varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
        fragmentShader: "varying vec3 vN; void main(){ float i = pow(0.62 - vN.z, 2.4); gl_FragColor = vec4(0.35,0.6,1.0,1.0)*i; }",
      }),
    );

    const globe = new THREE.Group();
    globe.add(core);
    globe.rotation.z = 0.41;
    scene.add(globe);
    scene.add(atmos);

    const resize = () => {
      if (!host) return;
      const width = host.clientWidth;
      const height = host.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height || 1;
      camera.updateProjectionMatrix();
    };

    const landCanvasWidth = 1024;
    const landCanvasHeight = 512;
    const landCanvas = document.createElement("canvas");
    landCanvas.width = landCanvasWidth;
    landCanvas.height = landCanvasHeight;
    const landContext = landCanvas.getContext("2d");

    const lonLatToCanvas = (lon: number, lat: number) => [
      ((lon + 180) / 360) * landCanvasWidth,
      ((90 - lat) / 180) * landCanvasHeight,
    ];

    const drawRing = (ring: number[][]) => {
      if (!landContext || ring.length === 0) return;
      const [x0, y0] = lonLatToCanvas(ring[0][0], ring[0][1]);
      landContext.moveTo(x0, y0);
      for (let index = 1; index < ring.length; index += 1) {
        const [x, y] = lonLatToCanvas(ring[index][0], ring[index][1]);
        landContext.lineTo(x, y);
      }
      landContext.closePath();
    };

    const buildDots = async () => {
      if (!landContext || disposed) return;

      try {
        const topo = (await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json").then((response) => response.json())) as WorldAtlasTopology;
        const land = feature(topo as never, topo.objects.land as never) as unknown as LandCollection;

        landContext.fillStyle = "#000";
        landContext.fillRect(0, 0, landCanvasWidth, landCanvasHeight);
        landContext.fillStyle = "#fff";
        landContext.beginPath();

        for (const item of land.features) {
          if (!item.geometry) continue;
          if (item.geometry.type === "Polygon") {
            for (const ring of item.geometry.coordinates as number[][][]) drawRing(ring);
          } else {
            for (const polygon of item.geometry.coordinates as number[][][][]) {
              for (const ring of polygon) drawRing(ring);
            }
          }
        }

        landContext.fill();
        const data = landContext.getImageData(0, 0, landCanvasWidth, landCanvasHeight).data;
        const isLand = (lon: number, lat: number) => {
          const x = Math.floor((((lon + 540) % 360) / 360) * landCanvasWidth);
          const y = Math.floor(((90 - lat) / 180) * landCanvasHeight);
          return y >= 0 && y < landCanvasHeight && data[(y * landCanvasWidth + x) * 4] > 128;
        };

        const positions: number[] = [];
        const stepLat = 1.8;
        for (let lat = -86; lat <= 86; lat += stepLat) {
          const cosLat = Math.cos((lat * Math.PI) / 180);
          const lonCount = Math.max(8, Math.round((360 / stepLat) * cosLat));
          for (let index = 0; index < lonCount; index += 1) {
            const lon = -180 + (360 / lonCount) * index;
            if (!isLand(lon, lat)) continue;
            const phi = ((90 - lat) * Math.PI) / 180;
            const theta = (lon * Math.PI) / 180;
            positions.push(
              radius * Math.sin(phi) * Math.cos(theta),
              radius * Math.cos(phi),
              -radius * Math.sin(phi) * Math.sin(theta),
            );
          }
        }

        if (disposed) return;

        const dotGeometry = new THREE.SphereGeometry(0.013, 6, 6);
        const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xb6d8ff });
        const dots = new THREE.InstancedMesh(dotGeometry, dotMaterial, positions.length / 3);
        const matrix = new THREE.Matrix4();

        for (let index = 0; index < positions.length / 3; index += 1) {
          matrix.makeTranslation(positions[index * 3], positions[index * 3 + 1], positions[index * 3 + 2]);
          dots.setMatrixAt(index, matrix);
        }

        dots.instanceMatrix.needsUpdate = true;
        globe.add(dots);
      } catch (error) {
        console.warn("Unable to load globe land data", error);
      }
    };

    let isDown = false;
    const last = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0 };

    const getPoint = (event: MouseEvent | TouchEvent) => ("touches" in event ? event.touches[0] : event);

    const onDown = (event: MouseEvent | TouchEvent) => {
      isDown = true;
      const point = getPoint(event);
      last.x = point.clientX;
      last.y = point.clientY;
    };

    const onMove = (event: MouseEvent | TouchEvent) => {
      if (!isDown) return;
      const point = getPoint(event);
      const dx = point.clientX - last.x;
      const dy = point.clientY - last.y;
      last.x = point.clientX;
      last.y = point.clientY;
      velocity.x = dy * 0.005;
      velocity.y = dx * 0.005;
      globe.rotation.x += velocity.x;
      globe.rotation.y += velocity.y;
    };

    const onUp = () => {
      isDown = false;
    };

    const tick = () => {
      if (!isDown) {
        velocity.x *= 0.94;
        velocity.y *= 0.94;
        globe.rotation.x += velocity.x;
        globe.rotation.y += velocity.y + 0.0024;
      }

      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };

    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    canvas.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);

    resize();
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    void buildDots();
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("touchstart", onDown);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
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
      className="earth-globe-host absolute left-1/2 top-[42%] h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2"
    >
      <div className="earth-globe-glow-2" />
      <div className="earth-globe-glow-1" />
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" aria-hidden="true" />
      <div className="absolute bottom-[18%] left-0 right-0 text-center text-[10px] font-black uppercase tracking-[0.22em] text-white/30">
        drag to rotate
      </div>
    </div>
  );
}
