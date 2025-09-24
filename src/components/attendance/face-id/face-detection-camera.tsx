import { useEffect, useRef, useState } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { FaceMesh, Results, NormalizedLandmark } from '@mediapipe/face_mesh';

// Props configurables
interface FaceDetectorProps {
  width?: number;
  height?: number;
  maxFaces?: number;
  minDetectionConfidence?: number;
  minTrackingConfidence?: number;
  showPoints?: boolean;
  onFaceDetected?: (data: {
    centered: boolean;
    centerX: number;
    centerY: number;
    distanceFromCenter: number;
    embeddings?: Float32Array;
    landmarks: NormalizedLandmark[];
  }) => void;
}

export default function FaceDetector({
  width = 640,
  height = 480,
  maxFaces = 5,
  minDetectionConfidence = 0.85,
  minTrackingConfidence = 0.85,
  showPoints = true,
  onFaceDetected,
}: FaceDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [faceDetectedState, setFaceDetectedState] = useState(false);
  const faceDetectedRef = useRef(false);

  const [showPointsState, setShowPointsState] = useState(showPoints);
  const showPointsRef = useRef(showPointsState);
  useEffect(() => {
    showPointsRef.current = showPointsState;
  }, [showPointsState]);

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

    video.width = width;
    video.height = height;
    canvas.width = width;
    canvas.height = height;

    const faceMesh = new FaceMesh({
      locateFile: (file) => `/models/mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      selfieMode: true,
      maxNumFaces: maxFaces,
      refineLandmarks: true,
      minDetectionConfidence,
      minTrackingConfidence,
    });

    const animatePoints = (landmarks: NormalizedLandmark[]) => {
      if (!video) return;
      const prev = prevLandmarksRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar video espejado
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      ctx.restore();

      landmarks.forEach((lm, index) => {
        const targetX = lm.x * canvas.width;
        const targetY = lm.y * canvas.height;
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

    faceMesh.onResults(async (results: Results) => {
      const multiFaces = results.multiFaceLandmarks || [];
      if (multiFaces.length === 0) {
        faceDetectedRef.current = false;
        setFaceDetectedState(false);
        prevLandmarksRef.current = [];
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

      if (showPointsRef.current) animatePoints(mainFace);
      else {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      // Posición de la cara con respecto al centro
      const xs = mainFace.map((lm) => lm.x);
      const ys = mainFace.map((lm) => lm.y);
      const centerX = (Math.max(...xs) + Math.min(...xs)) / 2;
      const centerY = (Math.max(...ys) + Math.min(...ys)) / 2;
      const distanceFromCenter = Math.hypot(centerX - 0.5, centerY - 0.5);
      const centered = distanceFromCenter < 0.1; // margen 10%

      // Embeddings (ejemplo placeholder, integrar tu modelo)
      let embeddings: Float32Array | undefined;
      // if(faceEmbeddingModel) embeddings = await faceEmbeddingModel.run(croppedFaceTensor);

      onFaceDetected?.({
        centered,
        centerX,
        centerY,
        distanceFromCenter,
        embeddings,
        landmarks: mainFace,
      });
    });

    const camera = new Camera(video, {
      onFrame: async () => {
        if (video.readyState >= 2) await faceMesh.send({ image: video });
      },
      width,
      height,
    });

    camera.start();

    return () => {
      camera.stop();
      faceMesh.close();
    };
  }, [width, height, maxFaces, minDetectionConfidence, minTrackingConfidence, onFaceDetected]);

  return (
    // <div className=" flex flex-col items-center justify-center ">


    //   <p
    //     className={`mt-4 text-xl font-bold ${
    //       faceDetectedState ? 'text-green-400' : 'text-red-400'
    //     }`}
    //   >
    //     {faceDetectedState ? 'Rostro detectado ✅' : 'No se detecta rostro ❌'}
    //   </p>

    //   <button
    //     onClick={() => setShowPointsState((prev) => !prev)}
    //     className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg"
    //   >
    //     {showPointsState ? 'Ocultar puntos' : 'Mostrar puntos'}
    //   </button>
    // </div>
     <div className="relative">
        <video
          ref={videoRef}
          className="object-cover rounded-lg"
          autoPlay
          playsInline
          style={{ width, height, transform: 'scaleX(-1)' }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 pointer-events-none rounded-lg"
          style={{ width, height }}
        />
      </div>
  );
}
