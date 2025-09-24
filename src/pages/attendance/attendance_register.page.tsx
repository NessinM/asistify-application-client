import FaceDetector from '@/components/attendance/face-id/face-detection-camera';
import { NormalizedLandmark } from '@mediapipe/face_mesh';
import React, { useState, useEffect, useRef } from 'react';

interface TickMark {
  angle: number;
  completed: boolean;
  glowing: boolean;
  intensity: number;
}

const FaceIdScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [tickMarks, setTickMarks] = useState<TickMark[]>([]);
  const [scanLinePosition, setScanLinePosition] = useState(0);
  const [completedScan, setCompletedScan] = useState(false);
  const [faceInfo, setFaceInfo] = useState< {
    centered: boolean;
    centerX: number;
    centerY: number;
    distanceFromCenter: number;
    embeddings?: Float32Array;
    landmarks: NormalizedLandmark[];
}>();
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  // Tamaño base escalable
  const size = 384;
  const center = size / 2;
  const innerRadius = center - 12;
  const outerRadius = center - 2;

  useEffect(() => {
    const ticks: TickMark[] = [];
    for (let i = 0; i < 90; i++) {
      ticks.push({
        angle: i * 4 - 90,
        completed: false,
        glowing: false,
        intensity: 0.3,
      });
    }
    setTickMarks(ticks);
  }, []);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanLinePosition(0);
    setCompletedScan(false);
    startTimeRef.current = Date.now();

    setTickMarks((prev) =>
      prev.map((tick) => ({
        ...tick,
        completed: false,
        glowing: false,
        intensity: 0.3,
      }))
    );
  };

  useEffect(() => {
    if (!isScanning) return;

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const duration = 4000;
      const progress = Math.min(elapsed / duration, 1);

      setScanProgress(progress);
      setScanLinePosition(progress * 100);

      const completedTicks = Math.floor(progress * tickMarks.length);

      setTickMarks((currentTicks) =>
        currentTicks.map((tick, index) => {
          const isCompleted = index <= completedTicks;
          const isActive = index >= completedTicks - 3 && index <= completedTicks + 3;

          // Pulso suave con seno
          const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 200);

          return {
            ...tick,
            completed: isCompleted,
            glowing: isActive && isScanning,
            intensity: isCompleted ? 1 : isActive ? 0.6 + 0.4 * pulse : 0.3,
          };
        })
      );

      if (progress >= 1) {
        setIsScanning(false);
        setCompletedScan(true);
        setTickMarks((prev) =>
          prev.map((tick) => ({
            ...tick,
            completed: true,
            glowing: false,
            intensity: 1,
          }))
        );
      } else {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isScanning, tickMarks.length]);

  return (
    <div className="bg-black flex flex-col items-center justify-center p-12 rounded-4xl w-full max-w-3xl mx-auto">
      {/* Face ID container */}
          {/* <small className='text-white'>centerX : {faceInfo?.centerX}</small>
          <small className='text-white'>centerY : {faceInfo?.centerY}</small>
          <small className='text-white'>distanceFromCenter : {faceInfo?.distanceFromCenter}</small>
          <small className='text-white'>centered : {faceInfo?.centered}</small> */}

      <div className="relative w-full flex justify-center">
        <div className="relative w-[95vw] max-w-[600px] aspect-square">
          {/* Video circular con clip-path */}
          <div
            className="absolute inset-8 rounded-full flex items-center justify-center"
            style={{
              clipPath: 'circle(50% at 50% 50%)',
              background: 'radial-gradient(circle, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.95) 100%)',
            }}
          >
            <FaceDetector
              width={540}
              height={540}
              maxFaces={1}
              showPoints={true}
              // onFaceDetected={(info) => setFaceInfo(info) }
            />
          </div>

          {/* Círculo animado */}
          <div className="absolute inset-0">
            <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
              {/* Línea de escaneo con glow */}
              {isScanning && (
                <rect
                  x="0"
                  y={(scanLinePosition / 100) * size - 1}
                  width={size}
                  height="2"
                  fill="url(#laserGradient)"
                  filter="url(#glow)"
                />
              )}

              <defs>
                <linearGradient id="laserGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(0,255,255,0)" />
                  <stop offset="50%" stopColor="rgba(0,255,255,0.8)" />
                  <stop offset="100%" stopColor="rgba(0,255,255,0)" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Tick marks */}
              {tickMarks.map((tick, index) => {
                const angle = (tick.angle * Math.PI) / 180;

                const x1 = center + innerRadius * Math.cos(angle);
                const y1 = center + innerRadius * Math.sin(angle);
                const x2 = center + outerRadius * Math.cos(angle);
                const y2 = center + outerRadius * Math.sin(angle);

                const strokeColor = tick.completed
                  ? '#FFFFFF'
                  : tick.glowing
                    ? '#FFFFFF'
                    : 'rgba(255, 255, 255, 0.3)';

                const strokeWidth = tick.completed ? 2.5 : tick.glowing ? 2 : 1.5;
                const opacity = tick.intensity;

                return (
                  <line
                    key={index}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                    style={{
                      filter:
                        tick.completed || tick.glowing
                          ? `drop-shadow(0 0 ${tick.intensity * 8}px rgba(255,255,255,0.9))`
                          : 'none',
                      transition: 'stroke 0.3s ease, opacity 0.3s ease',
                    }}
                  />
                );
              })}

              {/* Círculo base */}
              <circle
                cx={center}
                cy={center}
                r={center - 7}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-12 text-center">
        <p
          className="text-white text-xl sm:text-2xl font-normal tracking-wide"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            lineHeight: '26px',
          }}
        >
          {completedScan
            ? 'Escaneo completado'
            : isScanning
              ? 'Mantén tu rostro estable'
              : 'Céntrate en el círculo y mueve la cabeza lentamente para completar el Face ID'}
        </p>

        {!isScanning && (
          <button
            onClick={startScan}
            className="mt-6 px-8 py-3 bg-white bg-opacity-10 text-white rounded-full font-medium backdrop-blur-sm border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-200"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              fontSize: '16px',
            }}
          >
            {completedScan ? 'Escanear de nuevo' : 'Comenzar Face ID'}
          </button>
        )}
      </div>

      {isScanning && (
        <div className="mt-6 w-80 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{ width: `${scanProgress * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default FaceIdScanner;
