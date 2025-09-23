// FaceHologramGLB.tsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

// Shader avanzado tipo FaceID
const HologramMaterial = shaderMaterial(
  { time: 0, color: new THREE.Color(0x00ffff) },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;

    void main() {
      float scanline = abs(sin(vUv.y*50.0 + time*10.0));
      float glow = abs(sin(time*2.0 + vUv.y*6.28));
      float edge = smoothstep(0.45,0.5,length(vUv-0.5));
      gl_FragColor = vec4(color*glow*(0.5+0.5*scanline), 0.5 + 0.3*glow - edge*0.3);
    }
  `
);

extend({ HologramMaterial });

interface GLTFResult extends THREE.Object3D {
  scene: THREE.Scene;
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
}

const FaceHologramGLB: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/face.glb') as unknown as GLTFResult;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(clock.getElapsedTime() / 4) * 0.25;
      meshRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh & {
            material: { uniforms?: { time: { value: number } } };
          };
          if (mesh.material?.uniforms?.time) {
            mesh.material.uniforms.time.value = clock.getElapsedTime();
          }
        }
      });
    }
  });

  return (
    <primitive ref={meshRef} object={scene} scale={1.5} position={[0, -0.2, 0]} dispose={null} />
  );
};

export default FaceHologramGLB;
