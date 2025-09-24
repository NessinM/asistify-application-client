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
  const phases = useRef<number[]>(
    Array(468)
      .fill(0)
      .map(() => Math.random() * 2 * Math.PI)
  );

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    video.width = 640;
    video.height = 480;
    canvas.width = video.width;
    canvas.height = video.height;

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
      if (!video) return;
      const width = canvas.width;
      const height = canvas.height;
      const prev = prevLandmarksRef.current;

      ctx.clearRect(0, 0, width, height);

      // Dibujar video espejado
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, -width, 0, width, height);
      ctx.restore();

      landmarks.forEach((lm, index) => {
        const targetX = lm.x * width; // puntos en coordenadas correctas
        const targetY = lm.y * height;
        const targetZ = lm.z;

        const prevX = prev[index]?.x ?? targetX;
        const prevY = prev[index]?.y ?? targetY;
        const prevZ = prev[index]?.z ?? targetZ;

        const smoothX = prevX + (targetX - prevX) * 0.35;
        const smoothY = prevY + (targetY - prevY) * 0.35;
        const smoothZ = prevZ + (targetZ - prevZ) * 0.35;

        prev[index] = { x: smoothX, y: smoothY, z: smoothZ };

        const radius = 0.7 + 0.14 * Math.sin(performance.now() * 0.01 + phases.current[index]);
        const brightness = 0.6 + (0.4 * (-smoothZ + 0.1)) / 0.2;
        const perspectiveRadius = radius * (1 - smoothZ);

        ctx.beginPath();
        ctx.arc(smoothX, smoothY, perspectiveRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(20,158,163,${brightness})`;
        ctx.fill();
      });

      prevLandmarksRef.current = prev;
    };

    faceMesh.onResults((results: Results) => {
      const multiFaces = results.multiFaceLandmarks || [];
      if (multiFaces.length === 0) {
        faceDetectedRef.current = false;
        setFaceDetectedState(false);
        prevLandmarksRef.current = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();
        return;
      }

      let bestFaceIndex = 0;
      let bestScore = -Infinity;
      multiFaces.forEach((landmarks, i) => {
        const xs = landmarks.map((lm) => lm.x);
        const ys = landmarks.map((lm) => lm.y);
        const widthFace = Math.max(...xs) - Math.min(...xs);
        const heightFace = Math.max(...ys) - Math.min(...ys);
        const area = widthFace * heightFace;

        const centerX = (Math.max(...xs) + Math.min(...xs)) / 2;
        const centerY = (Math.max(...ys) + Math.min(...ys)) / 2;
        const centerDist = Math.hypot(centerX - 0.5, centerY - 0.5);

        const avgZ = landmarks.reduce((acc, lm) => acc + lm.z, 0) / landmarks.length;

        const score = area * 0.5 - centerDist * 0.3 - avgZ * 0.2;
        if (score > bestScore) {
          bestScore = score;
          bestFaceIndex = i;
        }
      });

      const mainFace = multiFaces[bestFaceIndex];
      faceDetectedRef.current = true;
      setFaceDetectedState(true);

      if (showPointsRef.current) {
        animatePoints(mainFace);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();
      }
    });

    const camera = new Camera(video, {
      onFrame: async () => {
        if (video.readyState >= 2) await faceMesh.send({ image: video });
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
          className="object-cover rounded-lg"
          autoPlay
          playsInline
          style={{ width: 640, height: 480, transform: 'scaleX(-1)' }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 pointer-events-none rounded-lg"
          style={{ width: 640, height: 480 }}
        />
      </div>

      <p
        className={`mt-4 text-xl font-bold ${
          faceDetectedState ? 'text-green-400' : 'text-red-400'
        }`}
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
