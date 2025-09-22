import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { motion, AnimatePresence } from 'framer-motion';

export default function FaceIDCenteredCard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const [progress, setProgress] = useState(0);
  const totalSteps = 5;

  useEffect(() => {
    const init = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 480, height: 360, facingMode: 'user' },
      });
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      await videoRef.current.play();
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (loading) return;
    let animationFrame: number;

    const detectFace = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.5 });
      const detection = await faceapi
        .detectSingleFace(videoRef.current, options)
        .withFaceLandmarks();

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detection) {
        setFaceDetected(true);
        const resized = detection;
        faceapi.draw.drawDetections(canvas, resized);
        faceapi.draw.drawFaceLandmarks(canvas, resized);

        const box = resized.detection.box;
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;

        if (
          centerX > canvas.width * 0.35 &&
          centerX < canvas.width * 0.65 &&
          centerY > canvas.height * 0.35 &&
          centerY < canvas.height * 0.65
        ) {
          setProgress((p) => Math.min(p + 1, totalSteps));
        }
      } else {
        setFaceDetected(false);
      }

      animationFrame = requestAnimationFrame(detectFace);
    };

    detectFace();
    return () => cancelAnimationFrame(animationFrame);
  }, [loading]);

  const circleSize = 360; // tamaño del círculo principal
  const radius = 150;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-[520px] p-6 bg-black rounded-[40px] shadow-2xl flex flex-col items-center">
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
          {/* Video y canvas centrados */}
          <video
            ref={videoRef}
            className="absolute top-1/2 left-1/2 w-full h-full max-w-full max-h-full object-cover rounded-[36px] -translate-x-1/2 -translate-y-1/2"
            autoPlay
            playsInline
          />
          <canvas
            ref={canvasRef}
            className="absolute top-1/2 left-1/2 w-full h-full max-w-full max-h-full rounded-[36px] -translate-x-1/2 -translate-y-1/2"
          />

          {/* Círculo de progreso centrado */}
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
              className="transition-all duration-500 ease-out"
            />
            <defs>
              <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
          </svg>

          {/* Círculo interior pulsante */}
          <motion.div
            animate={{
              scale: faceDetected ? [1, 1.08, 1] : 1,
              boxShadow: faceDetected
                ? '0 0 60px 20px rgba(52,211,153,0.5)'
                : '0 0 25px 8px rgba(255,255,255,0.2)',
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className={`absolute top-1/2 left-1/2 w-[200px] h-[200px] rounded-[36px] border-4 ${
              faceDetected ? 'border-green-400' : 'border-gray-500'
            } -translate-x-1/2 -translate-y-1/2 flex items-center justify-center`}
          >
            <div className="w-[140px] h-[140px] rounded-[32px] border-2 border-gray-300" />
          </motion.div>
        </div>

        {/* Indicaciones y mensaje */}
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