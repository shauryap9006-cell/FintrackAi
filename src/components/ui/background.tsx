"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ===================== BACKGROUND COMPONENT ===================== */

export const AnimatedBackground = ({
  animationSpeed = 3,
  dotSize = 6,
  reverse = false,
}: {
  animationSpeed?: number;
  dotSize?: number;
  reverse?: boolean;
}) => {
  const dotColor = [[255, 255, 255]];
  const gradientColor = "rgba(0,0,0,1)";
  const topGradient = "from-black";

  return (
    <div className="absolute inset-0 -z-10 bg-[var(--bg-primary)] transition-colors duration-500">
      <CanvasRevealEffect
        animationSpeed={animationSpeed}
        dotSize={dotSize}
        reverse={reverse}
        colors={dotColor}
      />

      {/* overlays from original */}
      <div 
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at center, ${gradientColor} 0%, transparent 100%)` }}
      />
      <div className={`absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b ${topGradient} to-transparent`} />
    </div>
  );
};

/* ===================== ORIGINAL EFFECT ===================== */

export const CanvasRevealEffect = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[255, 255, 255]],
  dotSize = 3,
  reverse = false,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  dotSize?: number;
  reverse?: boolean;
}) => {
  return (
    <div className="h-full w-full">
      <DotMatrix
        colors={colors}
        dotSize={dotSize}
        opacities={opacities}
        shader={`
          ${reverse ? "u_reverse_active" : "false"}_;
          animation_speed_factor_${animationSpeed.toFixed(1)}_;
        `}
        center={["x", "y"]}
      />
    </div>
  );
};

const DotMatrix = ({
  colors = [[255, 255, 255]],
  opacities = [0.3],
  totalSize = 20,
  dotSize = 2,
  shader = "",
  center = ["x", "y"],
}: any) => {
  const uniforms = useMemo(() => {
    const normalizedColors = colors.length > 0 ? colors : [[255, 255, 255]];
    const speedMatch = shader.match(/animation_speed_factor_(\d+(\.\d+)?)_/);
    const speedFactor = speedMatch ? Number(speedMatch[1]) : 1;
    const colorVectors = Array.from({ length: 6 }, (_, index) => {
      const color = normalizedColors[index % normalizedColors.length];
      return new THREE.Vector3(color[0] / 255, color[1] / 255, color[2] / 255);
    });

    return {
      u_colors: {
        value: colorVectors,
      },
      u_opacities: { value: opacities },
      u_total_size: { value: totalSize },
      u_dot_size: { value: dotSize },
      u_speed: { value: speedFactor },
      u_reverse: { value: shader.includes("u_reverse_active") ? 1 : 0 },
    };
  }, [colors, opacities, totalSize, dotSize, shader]);

  return <Shader source={fragmentShader(center)} uniforms={uniforms} />;
};

/* ===================== SHADER ===================== */

const fragmentShader = (center: string[]) => `
precision mediump float;

uniform float u_time;
uniform float u_opacities[10];
uniform vec3 u_colors[6];
uniform float u_total_size;
uniform float u_dot_size;
uniform float u_speed;
uniform vec2 u_resolution;
uniform int u_reverse;

float random(vec2 xy) {
  return fract(sin(dot(xy, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec2 st = gl_FragCoord.xy;

  float opacity = 1.0;

  vec2 grid = floor(st / u_total_size);

  float dir = u_reverse == 1 ? -1.0 : 1.0;
  float speed = max(0.001, u_speed) * 2.8;
  vec2 diagDir = normalize(vec2(1.0, 1.0)) * dir;
  float travel = u_time * speed;

  // Diagonal propagation with smooth temporal evolution.
  float diagonalPhase = dot(grid, diagDir) * 0.85;
  float baseRand = random(grid);
  float wave = sin(diagonalPhase + travel + baseRand * 6.2831853) * 0.5 + 0.5;
  float rand = random(grid + diagDir * floor(travel * 0.65));
  opacity *= u_opacities[int(rand * 10.0)] * mix(0.45, 1.0, wave);

  opacity *= step(fract(st.x / u_total_size), u_dot_size / u_total_size);
  opacity *= step(fract(st.y / u_total_size), u_dot_size / u_total_size);

  vec3 color = u_colors[0];

  gl_FragColor = vec4(color * opacity, opacity);
}
`;

/* ===================== CANVAS ===================== */

const ShaderMaterial = ({ source, uniforms }: any) => {
  const { size } = useThree();
  const ref = useRef<any>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.material.uniforms.u_time.value = clock.getElapsedTime();
    }
  });

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: source,
      uniforms: {
        u_time: { value: 0 },
        u_resolution: {
          value: new THREE.Vector2(size.width, size.height),
        },
        ...uniforms,
      },
    });
  }, [size, source, uniforms]);

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader = ({ source, uniforms }: any) => {
  return (
    <Canvas className="absolute inset-0" dpr={[1, 1.25]} gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}>
      <ShaderMaterial source={source} uniforms={uniforms} />
    </Canvas>
  );
};
