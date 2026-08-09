/**
 * three-hero.js — genuine 3D wireframe scene behind the hero avatar.
 * A slowly rotating icosahedron "brain lattice" with a scattered point
 * cloud, both reacting to cursor position. Runs behind the paper avatar
 * and the pinned tech tags to give the hero real depth instead of a
 * flat gradient blob.
 */
(function initHeroThree() {
  function start() {
    const stage = document.getElementById('orbStage');
    if (!stage || typeof THREE === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'heroThreeCanvas';
    stage.insertBefore(canvas, stage.firstChild);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (e) {
      canvas.remove();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5.4;

    function size() {
      const rect = stage.getBoundingClientRect();
      const w = rect.width || 400;
      const h = rect.height || 400;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    size();
    window.addEventListener('resize', size);

    // Wireframe lattice — the "brain"
    const icoGeo = new THREE.IcosahedronGeometry(1.9, 1);
    const edges = new THREE.EdgesGeometry(icoGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0xE1572C, transparent: true, opacity: 0.5 });
    const wireframe = new THREE.LineSegments(edges, wireMat);
    scene.add(wireframe);

    const innerGeo = new THREE.IcosahedronGeometry(1.15, 0);
    const innerEdges = new THREE.EdgesGeometry(innerGeo);
    const innerMat = new THREE.LineBasicMaterial({ color: 0x2FB9A6, transparent: true, opacity: 0.4 });
    const innerWire = new THREE.LineSegments(innerEdges, innerMat);
    scene.add(innerWire);

    // Scattered node points — "neurons"
    const dotCount = 70;
    const positions = new Float32Array(dotCount * 3);
    for (let i = 0; i < dotCount; i++) {
      const r = 2.3 + Math.random() * 0.7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dotMat = new THREE.PointsMaterial({ color: 0xE7B34C, size: 0.05, transparent: true, opacity: 0.8 });
    const points = new THREE.Points(dotGeo, dotMat);
    scene.add(points);

    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });
    stage.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });

    let raf;
    function animate() {
      raf = requestAnimationFrame(animate);
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;

      wireframe.rotation.y += 0.0028;
      wireframe.rotation.x += 0.0009;
      innerWire.rotation.y -= 0.0022;
      innerWire.rotation.z += 0.0014;
      points.rotation.y -= 0.0016;

      camera.position.x += (mouseX * 0.7 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 0.7 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    animate();

    // Pause rendering when off-screen to save battery/CPU
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!raf) animate();
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = null;
        }
      });
    }, { threshold: 0.05 });
    io.observe(stage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
