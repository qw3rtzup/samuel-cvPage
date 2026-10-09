import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import * as d3Geo from 'https://cdn.jsdelivr.net/npm/d3-geo@3.1.0/+esm';

function initGlobe() {
  const container = document.getElementById('globe-background');
  if (!container) {
    console.error("Kondajner #globe-background sa nenašiel.");
    return;
  }

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  
  const scaleMultiplier = 1;
  const globeRadius = 1 * scaleMultiplier;
  camera.position.set(0, 0, 2.5 / scaleMultiplier);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const globeGroup = new THREE.Group();
  globeGroup.rotation.x = (30 * Math.PI) / 180;
  globeGroup.rotation.y = (-22 * Math.PI) / 180;
  scene.add(globeGroup);

  const oceanGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
  const oceanMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#000000'),
    transparent: true,
    opacity: 0,
  });
  const oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
  globeGroup.add(oceanMesh);

  fetch("https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/50m/physical/ne_50m_land.json")
    .then((res) => {
      if (!res.ok) throw new Error("Chyba načítania GeoJSON dáta");
      return res.json();
    })
    .then((landFeatures) => {
      const bitmapW = 2048;
      const bitmapH = 1024;
      const offCanvas = document.createElement("canvas");
      offCanvas.width = bitmapW;
      offCanvas.height = bitmapH;
      const ctx = offCanvas.getContext("2d", { willReadFrequently: true });

      const projection = d3Geo.geoEquirectangular().fitSize([bitmapW, bitmapH], { type: "Sphere" });
      const pathGenerator = d3Geo.geoPath().projection(projection).context(ctx);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, bitmapW, bitmapH);
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      landFeatures.features.forEach((feature) => pathGenerator(feature));
      ctx.fill();

      const pixels = ctx.getImageData(0, 0, bitmapW, bitmapH).data;
      const isOnLand = (lng, lat) => {
        const x = Math.round(((lng + 180) / 360) * bitmapW) % bitmapW;
        const y = Math.round(((90 - lat) / 180) * bitmapH);
        const clampedY = Math.max(0, Math.min(bitmapH - 1, y));
        const idx = (clampedY * bitmapW + x) * 4;
        return pixels[idx] > 128;
      };

      const dotCoords = [];
      const baseStep = 1.2; 
      for (let lat = -90; lat <= 90; lat += baseStep) {
        const cosLat = Math.cos((Math.abs(lat) * Math.PI) / 180);
        const lngStep = cosLat > 0.01 ? baseStep / Math.max(0.3, cosLat) : 360;
        for (let lng = -180; lng < 180; lng += lngStep) {
          if (isOnLand(lng, lat)) {
            dotCoords.push([lng, lat]);
          }
        }
      }

      if (dotCoords.length > 0) {
        const dotGeometry = new THREE.SphereGeometry(0.005, 4, 4);
        const dotMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffffff"), transparent: true, opacity: 0.1});
        const instancedMesh = new THREE.InstancedMesh(dotGeometry, dotMaterial, dotCoords.length);
        const dummy = new THREE.Object3D();

        dotCoords.forEach(([lng, lat], i) => {
          const latRad = lat * (Math.PI / 180);
          const lngRad = lng * (Math.PI / 180);
          dummy.position.set(
            Math.cos(latRad) * Math.sin(lngRad) * globeRadius,
            Math.sin(latRad) * globeRadius,
            Math.cos(latRad) * Math.cos(lngRad) * globeRadius
          );
          dummy.updateMatrix();
          instancedMesh.setMatrixAt(i, dummy.matrix);
        });

        instancedMesh.instanceMatrix.needsUpdate = true;
        globeGroup.add(instancedMesh);
      }
    })
    .catch((err) => console.error("Chyba pri načítavaní glóbusu:", err));

  const speed = 0.0015;
  function animate() {
    requestAnimationFrame(animate);
    globeGroup.rotation.y -= speed;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

// Spustenie bez ohľadu na to, či DOMContentLoaded už prebehol
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobe);
} else {
  initGlobe();
}