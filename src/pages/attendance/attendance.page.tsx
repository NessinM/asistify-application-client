import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera } from '@mediapipe/camera_utils';
import { FaceMesh, Results } from '@mediapipe/face_mesh';
import { drawConnectors } from '@mediapipe/drawing_utils';
import { FACEMESH_TESSELATION } from '../../constants/face_mesh_tesselation.constants';

export default function FaceIDCenteredCard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceCenteredRef = useRef<{ startTime: number | null }>({ startTime: null });

  const [loading, setLoading] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const [progress, setProgress] = useState(0);
  const totalSteps = 5;

  const requiredCenteredTime = 2000; // ms
  const keyLandmarks = [1, 33, 263, 61, 291]; // nariz, ojos, boca

  const tuplesTesselation = toTuples(FACEMESH_TESSELATION);

  function toTuples(array: number[]): [number, number][] {
    const tuples: [number, number][] = [];
    for (let i = 0; i < array.length; i += 2) {
      if (i + 1 < array.length) tuples.push([array[i], array[i + 1]]);
    }
    return tuples;
  }

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      if (videoRef.current) {
        canvas.width = videoRef.current.videoWidth || 480;
        canvas.height = videoRef.current.videoHeight || 360;
      }
    };

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

      setCanvasSize(); // asegúrate de que canvas coincida con video
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image!, 0, 0, canvas.width, canvas.height);

      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];

        drawConnectors(ctx, landmarks, tuplesTesselation, {
          color: 'rgba(0,255,128,0.3)',
          lineWidth: 2,
        });

        const xs = keyLandmarks.map((i) => landmarks[i].x);
        const ys = keyLandmarks.map((i) => landmarks[i].y);
        const centerX = (xs.reduce((a, b) => a + b, 0) / xs.length) * canvas.width;
        const centerY = (ys.reduce((a, b) => a + b, 0) / ys.length) * canvas.height;

        const centered =
          centerX > canvas.width * 0.35 &&
          centerX < canvas.width * 0.65 &&
          centerY > canvas.height * 0.35 &&
          centerY < canvas.height * 0.65;

        if (centered && progress < totalSteps) {
          if (!faceCenteredRef.current.startTime)
            faceCenteredRef.current.startTime = performance.now();
          const elapsed = performance.now() - faceCenteredRef.current.startTime;
          if (elapsed >= requiredCenteredTime) {
            setProgress(progress + 1);
            faceCenteredRef.current.startTime = null;
          }
        } else {
          faceCenteredRef.current.startTime = null;
        }
      } else {
        setFaceDetected(false);
        faceCenteredRef.current.startTime = null;
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current && videoRef.current.readyState >= 2) {
          await faceMesh.send({ image: videoRef.current });
        }
      },
      width: 480,
      height: 360,
    });

    camera.start().then(() => setLoading(false));
    window.addEventListener('resize', setCanvasSize);

    return () => {
      camera.stop();
      faceMesh.close();
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  const circleSize = 360;
  const radius = 150;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-[520px] p-6 bg-black rounded-[40px] shadow-2xl flex flex-col items-center">
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
          <video
            ref={videoRef}
            className="absolute top-1/2 left-1/2 w-full h-full object-cover rounded-[36px] -translate-x-1/2 -translate-y-1/2"
            autoPlay
            playsInline
          />
          <canvas
            ref={canvasRef}
            className="absolute top-1/2 left-1/2 w-full h-full rounded-[36px] -translate-x-1/2 -translate-y-1/2"
          />
          <svg className="absolute top-1/2 left-1/2 w-[360px] h-[360px] -translate-x-1/2 -translate-y-1/2 -rotate-90">
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="16"
              fill="transparent"
            />
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke="url(#gradientStroke)"
              strokeWidth="16"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (progress / totalSteps) * circumference}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />
            <defs>
              <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
          </svg>
          <motion.div
            animate={{
              scale: faceDetected ? [1, 1.03, 1] : 1,
              boxShadow: faceDetected
                ? '0 0 40px 15px rgba(52,211,153,0.4)'
                : '0 0 20px 8px rgba(255,255,255,0.15)',
            }}
            transition={{ duration: 0.5 }}
            className={`absolute top-1/2 left-1/2 w-[200px] h-[200px] rounded-[36px] border-4 ${
              faceDetected ? 'border-green-400' : 'border-gray-500'
            } -translate-x-1/2 -translate-y-1/2 flex items-center justify-center`}
          >
            <div className="w-[140px] h-[140px] rounded-[32px] border-2 border-gray-300" />
          </motion.div>
        </div>
        <AnimatePresence mode="wait">
          {progress < totalSteps && !loading && (
            <motion.div
              key={progress}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center mt-6"
            >
              <p className="text-2xl font-semibold text-white">Paso {progress + 1}</p>
              <p className="text-gray-300 mt-1 text-sm">Mantén tu rostro centrado</p>
            </motion.div>
          )}
          {progress === totalSteps && !loading && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="mt-6 px-6 py-3 bg-green-500 bg-opacity-20 rounded-3xl text-green-400 font-bold shadow-md text-lg"
            >
              ✅ Rostro validado con éxito
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
