'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { animate } from 'framer-motion';

export default function ThreeDIncomeExpenseChart() {
  const mountRef = useRef(null);
  const tooltipRef = useRef(null);
  const [tooltipState, setTooltipState] = useState({ visible: false, x: 0, y: 0, month: '', income: 0, expense: 0 });

  useEffect(() => {
    // 1. Data based on the user's prompt
    const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
    const income = [4800, 4600, 6100, 5200, 4900, 5678];
    const expense = [21000, 25000, 27500, 24500, 22500, 25800];

    // Canvas Container size
    const width = mountRef.current.clientWidth;
    const height = 340;

    // 2. Setup Three.js Scene
    const scene = new THREE.Scene();
    scene.background = null; // transparent to show the dark #111111 card background

    // Orthographic Camera (Flat 2D Look)
    const aspect = width / height;
    const frustumSize = 12; // Adjust to fit all bars
    const camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      100
    );
    camera.position.set(0, 5, 10);
    // Look slightly down to give a mild isometric feel, or strictly head-on if purely flat.
    // The prompt says "top-down side view" - we'll do an almost flat side view but slightly angled.
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // 3. Create Bars
    const barGroups = [];
    const maxVal = Math.max(...income, ...expense);
    
    // Normalize heights so max value is height ~6
    const heightScale = 6 / maxVal;

    const groupGap = 1.2;
    const barSpacing = 0.15;
    const barWidth = 0.4;
    const startX = -((months.length - 1) * groupGap) / 2; // Center the graph

    const incomeMaterial = new THREE.MeshBasicMaterial({ color: 0x1D9E75 });
    const expenseMaterial = new THREE.MeshBasicMaterial({ color: 0xE24B4A });

    for (let i = 0; i < months.length; i++) {
        const group = new THREE.Group();
        group.position.x = startX + i * groupGap;

        // Income Bar (Left)
        const incHeight = income[i] * heightScale;
        const incGeo = new THREE.BoxGeometry(barWidth, incHeight, barWidth);
        const incMesh = new THREE.Mesh(incGeo, incomeMaterial.clone());
        incMesh.position.set(-barSpacing, incHeight / 2, 0);
        
        // Scale Y 0 initially for Framer Motion animation
        incMesh.scale.y = 0.001; 

        // Expense Bar (Right)
        const expHeight = expense[i] * heightScale;
        const expGeo = new THREE.BoxGeometry(barWidth, expHeight, barWidth);
        const expMesh = new THREE.Mesh(expGeo, expenseMaterial.clone());
        expMesh.position.set(barSpacing, expHeight / 2, 0);
        
        // Scale Y 0 initially
        expMesh.scale.y = 0.001;

        group.add(incMesh);
        group.add(expMesh);

        // Store user data in the group for raycasting
        group.userData = {
            index: i,
            month: months[i],
            income: income[i],
            expense: expense[i],
            incMesh,
            expMesh
        };

        scene.add(group);
        barGroups.push(group);
    }

    // 4. Framer Motion entry animations!
    // Staggered entry animation over the groups
    barGroups.forEach((group, index) => {
        const incM = group.userData.incMesh;
        const expM = group.userData.expMesh;
        
        // Animate Income
        animate(0, 1, {
            delay: index * 0.1,
            duration: 0.8,
            ease: "easeOut",
            onUpdate: (v) => { incM.scale.y = Math.max(0.001, v); incM.position.y = (income[index] * heightScale / 2) * v; }
        });

        // Animate Expense
        animate(0, 1, {
            delay: index * 0.1 + 0.05,
            duration: 0.8,
            ease: "easeOut",
            onUpdate: (v) => { expM.scale.y = Math.max(0.001, v); expM.position.y = (expense[index] * heightScale / 2) * v; }
        });
    });

    // 5. Raycasting (Hover effect)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredGroupIndex = -1;

    const onPointerMove = (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // Intersect all meshes in our groups
        const interactableMeshes = barGroups.flatMap(g => [g.userData.incMesh, g.userData.expMesh]);
        const intersects = raycaster.intersectObjects(interactableMeshes);

        if (intersects.length > 0) {
            // Find parent group of intersected mesh
            const matchGroup = barGroups.find(g => 
                g.userData.incMesh === intersects[0].object || 
                g.userData.expMesh === intersects[0].object
            );

            if (matchGroup && matchGroup.userData.index !== hoveredGroupIndex) {
                hoveredGroupIndex = matchGroup.userData.index;

                // Simple tooltip position tracking (center it horizontally to the group roughly)
                // Convert group 3D pos to 2D
                const vector = matchGroup.position.clone();
                vector.y = (Math.max(matchGroup.userData.income, matchGroup.userData.expense) * heightScale) + 0.5;
                vector.project(camera);
                
                const x = (vector.x * 0.5 + 0.5) * width;
                const y = -(vector.y * 0.5 - 0.5) * height - 30; // 30px above

                setTooltipState({
                    visible: true,
                    x,
                    y,
                    month: matchGroup.userData.month,
                    income: matchGroup.userData.income,
                    expense: matchGroup.userData.expense
                });

                // Hover visual effect: Dim non-hovered, scale up hovered
                barGroups.forEach((g, i) => {
                    const isHovered = i === hoveredGroupIndex;
                    const opacityDest = isHovered ? 1 : 0.4;
                    const scaleDest = isHovered ? 1.05 : 1.0;
                    
                    // Simple manual animation (could use frame motion, but lerp in render loop is easier or just direct set)
                    g.userData.incMesh.material.opacity = opacityDest;
                    g.userData.incMesh.material.transparent = true;
                    g.userData.expMesh.material.opacity = opacityDest;
                    g.userData.expMesh.material.transparent = true;
                    
                    animate(g.scale.x, scaleDest, {
                        duration: 0.2, ease: "easeOut",
                        onUpdate: (v) => { g.scale.set(v, v, v); }
                    });
                });
            }
        } else {
            if (hoveredGroupIndex !== -1) {
                hoveredGroupIndex = -1;
                setTooltipState(s => ({ ...s, visible: false }));
                
                // Reset visual effect
                barGroups.forEach(g => {
                    g.userData.incMesh.material.opacity = 1;
                    g.userData.expMesh.material.opacity = 1;
                    animate(g.scale.x, 1, {
                        duration: 0.2, ease: "easeOut",
                        onUpdate: (v) => { g.scale.set(v, 1, v); } // Only scaling X/Z so Y doesn't mess up height
                    });
                });
            }
        }
    };

    window.addEventListener('mousemove', onPointerMove);

    // 6. Render Loop
    let animationFrameId;
    const render = () => {
        animationFrameId = requestAnimationFrame(render);
        renderer.render(scene, camera);
    };
    render();

    // 7. Cleanup
    return () => {
        window.removeEventListener('mousemove', onPointerMove);
        cancelAnimationFrame(animationFrameId);
        mountRef.current?.removeChild(renderer.domElement);
        scene.clear();
        renderer.dispose();
    };
  }, []);

  const yLabels = ['₹30k', '₹25k', '₹20k', '₹15k', '₹10k', '₹5k', '₹0'];
  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '340px',
      background: '#111111',
      borderRadius: '16px',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden'
    }}>
      
      {/* Y-Axis Labels & Gridlines */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        bottom: 40,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }}>
        {yLabels.map((lbl, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, width: 32, textAlign: 'right', marginRight: 12 }}>
              {lbl}
            </span>
            <div style={{
              flex: 1,
              borderTop: '1px dashed rgba(255,255,255,0.12)'
            }} />
          </div>
        ))}
      </div>

      {/* X-Axis Labels */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        left: 64, // offset past y axis
        right: 20,
        display: 'flex',
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }}>
        {months.map((m, i) => (
          <span key={i} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, flex: 1, textAlign: 'center' }}>
            {m}
          </span>
        ))}
      </div>

      {/* Three.js Canvas Container */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />

      {/* Tooltip */}
      {tooltipState.visible && (
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            background: '#222',
            color: '#fff',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            zIndex: 10,
            left: tooltipState.x,
            top: tooltipState.y,
            transform: 'translate(-50%, -100%)', // Center directly above bar
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}
        >
          <div style={{ marginBottom: 4, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{tooltipState.month}</div>
          <div style={{ color: '#1D9E75', fontWeight: 500 }}>Income: ₹{tooltipState.income.toLocaleString()}</div>
          <div style={{ color: '#E24B4A', fontWeight: 500 }}>Expense: ₹{tooltipState.expense.toLocaleString()}</div>
        </div>
      )}
    </div>
  );
}
