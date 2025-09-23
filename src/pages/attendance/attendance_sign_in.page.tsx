import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { Camera } from '@mediapipe/camera_utils';
import { FaceMesh, Results } from '@mediapipe/face_mesh';
import { drawConnectors } from '@mediapipe/drawing_utils';
import { FACEMESH_TESSELATION } from '../../constants/face_mesh_tesselation.constants';

export default function FaceIDCenteredCard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceCenteredRef = useRef<{ startTime: number | null }>({ startTime: null });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const resultsRef = useRef<Results | null>(null);

  const totalTime = 2000;
  const keyLandmarks = [1, 33, 263, 61, 291];
  const tuplesTesselation = FACEMESH_TESSELATION.reduce<[number, number][]>((acc, val, i) => {
    if (i % 2 === 0 && i + 1 < FACEMESH_TESSELATION.length)
      acc.push([val, FACEMESH_TESSELATION[i + 1]]);
    return acc;
  }, []);

  const progress = useMotionValue(0);

  useEffect(() => {
    const setCanvasSize = () => {
      if (videoRef.current && canvasRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth || 640;
        canvasRef.current.height = videoRef.current.videoHeight || 480;
      }
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    return () => window.removeEventListener('resize', setCanvasSize);
  }, []);

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

      resultsRef.current = results;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image!, 0, 0, canvas.width, canvas.height);

      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        setFaceDetected(true);
        const landmarks = results.multiFaceLandmarks[0];

        drawConnectors(ctx, landmarks, tuplesTesselation, {
          color: 'rgba(20 158 163 / 0.4)',
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

        if (centered && !authenticated) {
          if (!faceCenteredRef.current.startTime)
            faceCenteredRef.current.startTime = performance.now();

          const elapsed = performance.now() - faceCenteredRef.current.startTime;
          const newProgress = Math.min(elapsed / totalTime, 1);
          progress.set(newProgress);

          if (newProgress >= 1) {
            setAuthenticated(true);
            faceCenteredRef.current.startTime = null;
          }
        } else if (!authenticated) {
          faceCenteredRef.current.startTime = null;
          progress.set(0);
        }
      } else if (!authenticated) {
        setFaceDetected(false);
        faceCenteredRef.current.startTime = null;
        progress.set(0);
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

    camera.start().then(() => setLoading(false));

    return () => {
      camera.stop();
      faceMesh.close();
    };
  }, [progress, authenticated]);

  return (
    <div className="w-screen h-screen flex items-center justify-center p-4 ">
      <div className="relative w-full max-w-[700px] p-8 rounded-[48px] shadow-2xl flex flex-col items-center bg-black backdrop-blur-md">
        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
          <video
            ref={videoRef}
            className="absolute top-1/2 left-1/2 w-full h-full object-cover rounded-[40px] -translate-x-1/2 -translate-y-1/2 scale-x-[-1]"
            autoPlay
            playsInline
          />
          <canvas
            ref={canvasRef}
            className="absolute top-1/2 left-1/2 w-full h-full rounded-[40px] -translate-x-1/2 -translate-y-1/2 scale-x-[-1]"
          />

          {/* Recuadro exterior dinámico */}
          <motion.div
            animate={{
              boxShadow: faceDetected
                ? '0 0 80px 30px rgba(52,211,153,0.3)'
                : '0 0 20px 8px rgba(107,114,128,0.2)',
              borderColor: faceDetected ? 'rgba(52,211,153,0.8)' : 'rgba(107,114,128,0.3)',
            }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
            className="absolute top-1/2 left-1/2 w-[280px] h-[280px] rounded-[48px] border-4 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          >
            {/* Recuadro interior fijo */}
            <div className="w-[140px] h-[140px] rounded-[32px] border-4 border-gray-500 flex items-center justify-center">
              {/* Texto dinámico */}
              <motion.p
                key={faceDetected ? 'detected' : 'notDetected'}
                className="text-white text-center text-sm font-semibold p-2"
              >
                {(() => {
                  if (!faceDetected || !resultsRef.current) return 'Mantén tu rostro centrado';

                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const canvas = canvasRef.current!;
                  const landmarks = resultsRef.current.multiFaceLandmarks![0];
                  const centerX =
                    keyLandmarks.map((i) => landmarks[i].x).reduce((a, b) => a + b, 0) /
                    keyLandmarks.length;
                  const centerY =
                    keyLandmarks.map((i) => landmarks[i].y).reduce((a, b) => a + b, 0) /
                    keyLandmarks.length;

                  const left = centerX < 0.35;
                  const right = centerX > 0.65;
                  const up = centerY < 0.35;
                  const down = centerY > 0.65;

                  if (up) return 'Sube';
                  if (down) return 'Baja';
                  if (left) return 'Derecha';
                  if (right) return 'Izquierda';
                  return 'Perfecto';
                  return 'Perfecto';
                })()}
              </motion.p>
            </div>
          </motion.div>
        </div>

        <div className="text-center mt-8">
          <p className="text-2xl font-bold text-white">
            {authenticated ? 'Rostro autenticado con éxito' : 'Mantén tu rostro centrado'}
          </p>
          <p className="text-lg text-gray-300 mt-2">
            {authenticated ? '' : 'El sistema verificará tu identidad automáticamente'}
          </p>
        </div>
      </div>
    </div>
  );
}
// // FaceIDRegisterFinal.tsx
// import React, { useState, useEffect } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import { motion, AnimatePresence } from 'framer-motion';
// import FaceHologramGLB from '../../components/attendance/face-id/FaceHologramGLB';
// import { X, Check } from 'lucide-react';

// const instructions: string[] = [
//   'Gira suavemente a la izquierda',
//   'Gira suavemente a la derecha',
//   'Sube la cabeza',
//   'Baja la cabeza',
// ];

// const FaceIDRegisterFinal: React.FC = () => {
//   const [currentInstruction, setCurrentInstruction] = useState<number>(0);
//   const [registrationComplete, setRegistrationComplete] = useState<boolean>(false);

//   useEffect(() => {
//     if (registrationComplete) return;
//     const interval = setInterval(() => {
//       setCurrentInstruction((prev) => (prev < instructions.length - 1 ? prev + 1 : prev));
//       if (currentInstruction === instructions.length - 1) {
//         setTimeout(() => setRegistrationComplete(true), 1500);
//       }
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [currentInstruction, registrationComplete]);

//   return (
//     <div className="w-full h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
//       <div className="relative w-full max-w-sm flex flex-col items-center bg-white/5 backdrop-blur-md rounded-3xl p-6 shadow-lg">
//         {/* Holograma 3D */}
//         <div className="w-64 h-64 mb-4">
//           <Canvas camera={{ position: [0, 0, 2.5] }}>
//             <ambientLight intensity={0.6} />
//             <directionalLight position={[0, 2, 5]} intensity={1} />
//             <FaceHologramGLB />
//             <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
//           </Canvas>
//         </div>

//         {/* Indicaciones animadas */}
//         <AnimatePresence mode="wait">
//           {!registrationComplete && (
//             <motion.div
//               key={currentInstruction}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.5 }}
//               className="text-gray-200 text-center text-lg font-semibold mb-2"
//             >
//               {instructions[currentInstruction]}
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Subtítulo */}
//         <div className="text-gray-400 text-sm mb-4">
//           {registrationComplete
//             ? 'Registro completado'
//             : 'Moviendo tu rostro para registrar FaceID...'}
//         </div>

//         {/* Botones minimalistas */}
//         <div className="flex space-x-6">
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             className="p-3 bg-white/10 rounded-full backdrop-blur-md"
//           >
//             <X className="w-6 h-6 text-red-400" />
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             className="p-3 bg-white/10 rounded-full backdrop-blur-md"
//           >
//             <Check className="w-6 h-6 text-green-400" />
//           </motion.button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FaceIDCenteredCard;
