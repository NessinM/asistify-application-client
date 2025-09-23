// FaceHologramCamera.tsx
import React, { useRef, useEffect } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { FaceMesh, Results } from '@mediapipe/face_mesh';
import { Camera as MP_Camera } from '@mediapipe/camera_utils';

const FaceHologramCameraContent: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const videoRef = useRef<HTMLVideoElement>(document.createElement('video'));
  const textureRef = useRef<THREE.VideoTexture>();

  useEffect(() => {
    const video = videoRef.current;
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;

    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results: Results) => {});

    const camera = new MP_Camera(video, {
      onFrame: async () => await faceMesh.send({ image: video }),
      width: 640,
      height: 480,
    });
    camera.start();

    textureRef.current = new THREE.VideoTexture(video);
    textureRef.current.minFilter = THREE.LinearFilter;
    textureRef.current.magFilter = THREE.LinearFilter;
    textureRef.current.format = THREE.RGBAFormat;

    return () => {
      faceMesh.close();
      camera.stop();
    };
  }, []);

  useFrame(() => {
    if (textureRef.current) textureRef.current.needsUpdate = true;
    if (meshRef.current) meshRef.current.rotation.y += 0.005;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1.5, (1.5 * 480) / 640]} />
      <meshBasicMaterial map={textureRef.current} toneMapped={false} transparent opacity={0.9} />
    </mesh>
  );
};

const FaceHologramCamera: React.FC = () => {
  return <FaceHologramCameraContent />;
};

export default FaceHologramCamera;
