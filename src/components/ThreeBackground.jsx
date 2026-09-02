import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground({ activeTaskCount = 0 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 32;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create 3D Serverless Network Nodes (Sphere particles & connection lines)
    const nodeCount = 45;
    const nodeGeometry = new THREE.SphereGeometry(0.35, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.85
    });

    const nodes = [];
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

    for (let i = 0; i < nodeCount; i++) {
      const mesh = new THREE.Mesh(
        nodeGeometry,
        i % 4 === 0
          ? new THREE.MeshBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.9 })
          : i % 3 === 0
          ? new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.9 })
          : nodeMaterial
      );

      const radius = 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
      mesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
      mesh.position.z = radius * Math.cos(phi);

      mesh.userData = {
        originX: mesh.position.x,
        originY: mesh.position.y,
        originZ: mesh.position.z,
        speed: 0.002 + Math.random() * 0.003
      };

      nodeGroup.add(mesh);
      nodes.push(mesh);
    }

    // Connect nodes with line segments (Serverless Distributed Mesh)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.18
    });

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(nodeCount * nodeCount * 3);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    nodeGroup.add(linesMesh);

    // Glowing core cloud engine in the center
    const coreGeo = new THREE.IcosahedronGeometry(2.5, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const coreCloud = new THREE.Mesh(coreGeo, coreMat);
    nodeGroup.add(coreCloud);

    // Mouse parallax tracking
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize listener
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate network cluster based on activity
      const rotSpeed = 0.0015 + (activeTaskCount > 0 ? 0.004 : 0);
      nodeGroup.rotation.y += rotSpeed;
      nodeGroup.rotation.x += rotSpeed * 0.5;

      coreCloud.rotation.y -= rotSpeed * 2;
      coreCloud.rotation.z += rotSpeed * 1.5;

      // Mouse Parallax smooth lerp
      camera.position.x += (mouseX * 4 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 4 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Update mesh connection lines
      let vertexIndex = 0;
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dist = nodes[i].position.distanceTo(nodes[j].position);
          if (dist < 9.5) {
            linePositions[vertexIndex++] = nodes[i].position.x;
            linePositions[vertexIndex++] = nodes[i].position.y;
            linePositions[vertexIndex++] = nodes[i].position.z;

            linePositions[vertexIndex++] = nodes[j].position.x;
            linePositions[vertexIndex++] = nodes[j].position.y;
            linePositions[vertexIndex++] = nodes[j].position.z;
          }
        }
      }
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.setDrawRange(0, vertexIndex / 3);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeTaskCount]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
      style={{ overflow: 'hidden' }}
    />
  );
}
