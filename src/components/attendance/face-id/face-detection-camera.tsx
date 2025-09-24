import { useEffect, useRef } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { FaceMesh, Results, NormalizedLandmark } from '@mediapipe/face_mesh';
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';

/** --- One Euro Filter --- */
class OneEuroFilter {
  private freq: number;
  private minCutoff: number;
  private beta: number;
  private dCutoff: number;
  private xPrev: number | null = null;
  private dxPrev: number | null = null;
  private tPrev: number | null = null;

  constructor(freq = 30, minCutoff = 1.0, beta = 0.007, dCutoff = 1.0) {
    this.freq = freq;
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.dCutoff = dCutoff;
  }

  private alpha(cutoff: number, te: number) {
    const tau = 1.0 / (2 * Math.PI * cutoff);
    return 1.0 / (1.0 + tau / te);
  }

  filter(value: number, t: number) {
    if (this.tPrev == null) {
      this.tPrev = t;
      this.xPrev = value;
      this.dxPrev = 0;
      return value;
    }
    const te = t - this.tPrev;
    this.tPrev = t;

    // estimate derivative
    const dx = (value - (this.xPrev ?? value)) / te;
    const alphaD = this.alpha(this.dCutoff, te);
    const dxHat = alphaD * dx + (1 - alphaD) * (this.dxPrev ?? dx);
    this.dxPrev = dxHat;

    const cutoff = this.minCutoff + this.beta * Math.abs(dxHat);
    const alphaX = this.alpha(cutoff, te);
    const xHat = alphaX * value + (1 - alphaX) * (this.xPrev ?? value);
    this.xPrev = xHat;

    return xHat;
  }
}

interface FaceDetectorProps {
  width?: number;
  height?: number;
  maxFaces?: number;
  minDetectionConfidence?: number;
  minTrackingConfidence?: number;
  showPoints?: boolean;
  modelBasePath?: string;
  onFaceDetected?: (data: {
    centered: boolean;
    centerX: number;
    centerY: number;
    distanceFromCenter: number;
    boundingBox: { x: number; y: number; w: number; h: number };
    pose: { pitch: number; yaw: number; roll: number };
    landmarks: NormalizedLandmark[];
  }) => void;
}

export default function FaceDetector({
  width = 640,
  height = 480,
  maxFaces = 1,
  minDetectionConfidence = 0.85,
  minTrackingConfidence = 0.85,
  showPoints = true,
  modelBasePath = '/models/mediapipe',
  onFaceDetected,
}: FaceDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const faceDetectedRef = useRef(false);
  const filtersRef = useRef<OneEuroFilter[]>([]);

  const segmentationMaskRef = useRef<any>(null);

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

    // ---- Selfie Segmentation ----
    const selfieSegmentation = new SelfieSegmentation({
      locateFile: (file) => `${modelBasePath}/selfie_segmentation/${file}`,
    });
    selfieSegmentation.setOptions({ modelSelection: 1 });

    selfieSegmentation.onResults((results) => {
      segmentationMaskRef.current = results.segmentationMask;
    });

    // ---- FaceMesh ----
    const faceMesh = new FaceMesh({
      locateFile: (file) => `${modelBasePath}/face_mesh/${file}`,
    });
    faceMesh.setOptions({
      selfieMode: true,
      maxNumFaces: maxFaces,
      refineLandmarks: true,
      minDetectionConfidence,
      minTrackingConfidence,
    });

    faceMesh.onResults((results: Results) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Paso 1: Fondo borroso
      ctx.save();
      ctx.filter = 'blur(12px)';
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Paso 2: recortar persona y ponerla nítida
      if (segmentationMaskRef.current) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.drawImage(segmentationMaskRef.current, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();
        ctx.globalCompositeOperation = 'source-over';
      }

      // Paso 3: detección facial
      const multiFaces = results.multiFaceLandmarks || [];
      if (multiFaces.length === 0) {
        faceDetectedRef.current = false;
        filtersRef.current = [];
        return;
      }

      const mainFace = multiFaces[0];
      faceDetectedRef.current = true;

      // inicializar filtros si es primera vez
      if (filtersRef.current.length !== mainFace.length * 3) {
        filtersRef.current = Array(mainFace.length * 3)
          .fill(0)
          .map(() => new OneEuroFilter());
      }

      // suavizar landmarks
      const t = performance.now() / 1000;
      const smoothed = mainFace.map((lm, i) => ({
        x: filtersRef.current[i * 3 + 0].filter(lm.x, t),
        y: filtersRef.current[i * 3 + 1].filter(lm.y, t),
        z: filtersRef.current[i * 3 + 2].filter(lm.z, t),
      }));

      if (showPoints) {
        ctx.fillStyle = 'rgba(20,158,163,0.9)';
        smoothed.forEach((lm) => {
          const x = (1 - lm.x) * canvas.width; // espejado en X
          const y = lm.y * canvas.height;
          ctx.beginPath();
          ctx.arc(x, y, 1.0, 0, Math.PI * 2); // radio más pequeño
          ctx.fill();
        });
      }

      // Datos extras
      const xs = smoothed.map((lm) => lm.x);
      const ys = smoothed.map((lm) => lm.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const distanceFromCenter = Math.hypot(centerX - 0.5, centerY - 0.5);
      const centered = distanceFromCenter < 0.1;

      // bounding box
      const boundingBox = {
        x: minX,
        y: minY,
        w: maxX - minX,
        h: maxY - minY,
      };

      // pose básica (yaw, pitch, roll aprox.)
      const leftEye = smoothed[33];
      const rightEye = smoothed[263];
      const nose = smoothed[1];
      const dx = rightEye.x - leftEye.x;
      const dy = rightEye.y - leftEye.y;
      const yaw = Math.atan2(dx, dy);
      const pitch = (nose.y - centerY) * 30;
      const roll = (nose.x - centerX) * 30;

      onFaceDetected?.({
        centered,
        centerX,
        centerY,
        distanceFromCenter,
        boundingBox,
        pose: { pitch, yaw, roll },
        landmarks: smoothed,
      });
    });

    const camera = new Camera(video, {
      onFrame: async () => {
        if (video.readyState >= 2) {
          await selfieSegmentation.send({ image: video });
          await faceMesh.send({ image: video });
        }
      },
      width,
      height,
    });

    camera.start();

    return () => {
      camera.stop();
      faceMesh.close();
      selfieSegmentation.close();
    };
  }, [
    width,
    height,
    maxFaces,
    minDetectionConfidence,
    minTrackingConfidence,
    onFaceDetected,
    showPoints,
    modelBasePath,
  ]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width, height, transform: 'scaleX(-1)' }}
        className="object-cover rounded-lg"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 pointer-events-none rounded-lg"
        style={{ width, height, transform: 'scaleX(-1)' }}
      />
    </div>
  );
}
