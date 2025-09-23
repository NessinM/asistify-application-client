import { useEffect, useRef, useState } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { FaceMesh, Results } from '@mediapipe/face_mesh';
// import { drawConnectors } from '@mediapipe/drawing_utils';
import { FACEMESH_TESSELATION } from '../../../constants/face_mesh_tesselation.constants';

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

  const tesselationPairs: [number, number][] = [];
  for (let i = 0; i < FACEMESH_TESSELATION.length; i += 2) {
    if (i + 1 < FACEMESH_TESSELATION.length) {
      tesselationPairs.push([FACEMESH_TESSELATION[i], FACEMESH_TESSELATION[i + 1]]);
    }
  }

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
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.8,
      minTrackingConfidence: 0.8,
    });

    faceMesh.onResults((results: Results) => {
      if (!videoRef.current) return;

      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image!, 0, 0, canvas.width, canvas.height);

      const hasFace = !!(results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0);

      if (faceDetectedRef.current !== hasFace) {
        faceDetectedRef.current = hasFace;
        setFaceDetectedState(hasFace);
      }

      if (hasFace && showPointsRef.current) {
        const landmarks = results.multiFaceLandmarks![0];

        landmarks.forEach((lm, index) => {
          const x = lm.x * canvas.width;
          const y = lm.y * canvas.height;

          // Puntos muy pequeños, pulso mínimo
          const radius = 0.8 + 0.2 * Math.sin(Date.now() * 0.02 + index);

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(20, 158, 163, 0.7)';
          ctx.fill();
        });
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
