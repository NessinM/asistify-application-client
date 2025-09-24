import { useEffect, useRef, useState } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { FaceMesh, Results, NormalizedLandmark } from '@mediapipe/face_mesh';

export default function FaceDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [faceDetectedState, setFaceDetectedState] = useState(false);
  const faceDetectedRef = useRef(false);

  const [showPoints, setShowPoints] = useState(true);
  const showPointsRef = useRef(showPoints);
  useEffect(() => {
    showPointsRef.current = showPoints;
  }, [showPoints]);

  const prevLandmarksRef = useRef<{ x: number; y: number; z: number }[]>([]);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const faceMesh = new FaceMesh({
      locateFile: (file) => `/models/mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      selfieMode: true,
      maxNumFaces: 5,
      refineLandmarks: true,
      minDetectionConfidence: 0.85,
      minTrackingConfidence: 0.85,
    });

    const animatePoints = (landmarks: NormalizedLandmark[]) => {
      const time = performance.now() * 0.006; // más rápido que Date.now()
      const prev = prevLandmarksRef.current;

      landmarks.forEach((lm, index) => {
        const targetX = lm.x * canvas.width;
        const targetY = lm.y * canvas.height;
        const targetZ = lm.z;

        const prevX = prev[index]?.x ?? targetX;
        const prevY = prev[index]?.y ?? targetY;
        const prevZ = prev[index]?.z ?? targetZ;

        // suavizado más rápido (mayor responsividad)
        const smoothX = prevX + (targetX - prevX) * 0.5;
        const smoothY = prevY + (targetY - prevY) * 0.5;
        const smoothZ = prevZ + (targetZ - prevZ) * 0.5;

        prev[index] = { x: smoothX, y: smoothY, z: smoothZ };

        // radio con pulso sutil
        const radius = 0.6 + 0.15 * Math.sin(time + index);

        // brillo según profundidad z
        const brightness = 0.7 + (0.3 * (-smoothZ + 0.1)) / 0.2;
        const color = `rgba(20, 158, 163, ${brightness})`;

        ctx.beginPath();
        ctx.arc(smoothX, smoothY, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      prevLandmarksRef.current = prev;
    };

    faceMesh.onResults((results: Results) => {
      if (!videoRef.current) return;

      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image!, 0, 0, canvas.width, canvas.height);

      const multiFaces = results.multiFaceLandmarks || [];
      if (multiFaces.length === 0) {
        faceDetectedRef.current = false;
        setFaceDetectedState(false);
        return;
      }

      // Elegir la cara más cercana según área
      let bestFaceIndex = 0;
      let maxArea = 0;
      multiFaces.forEach((landmarks, i) => {
        const xs = landmarks.map((lm) => lm.x);
        const ys = landmarks.map((lm) => lm.y);
        const width = Math.max(...xs) - Math.min(...xs);
        const height = Math.max(...ys) - Math.min(...ys);
        const area = width * height;
        if (area > maxArea) {
          maxArea = area;
          bestFaceIndex = i;
        }
      });

      const mainFace = multiFaces[bestFaceIndex];
      faceDetectedRef.current = true;
      setFaceDetectedState(true);

      if (showPointsRef.current) {
        animatePoints(mainFace);
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current && videoRef.current.readyState >= 2) {
          await faceMesh.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      camera.stop();
      faceMesh.close();
    };
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-black">
      <div className="relative">
        <video
          ref={videoRef}
          className="w-[640px] h-[480px] object-cover rounded-lg"
          autoPlay
          playsInline
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-[640px] h-[480px] rounded-lg pointer-events-none"
        />
      </div>

      <p
        className={`mt-4 text-xl font-bold ${faceDetectedState ? 'text-green-400' : 'text-red-400'}`}
      >
        {faceDetectedState ? 'Rostro detectado ✅' : 'No se detecta rostro ❌'}
      </p>

      <button
        onClick={() => setShowPoints((prev) => !prev)}
        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg"
      >
        {showPoints ? 'Ocultar puntos' : 'Mostrar puntos'}
      </button>
    </div>
  );
}
