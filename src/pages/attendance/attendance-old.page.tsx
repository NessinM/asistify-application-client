
import React, { useRef, useEffect } from 'react';
import { FaceMesh, Results } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors } from '@mediapipe/drawing_utils';
import { FACEMESH_TESSELATION } from '../../constants/face_mesh_tesselation.constants';

export default function FaceMeshComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function toTuples(array: number[]): [number, number][] {
    const tuples: [number, number][] = [];
    for (let i = 0; i < array.length; i += 2) {
      // Si el array tiene cantidad impar, se ignora el último elemento
      if (i + 1 < array.length) {
        tuples.push([array[i], array[i + 1]]);
      }
    }
    return tuples;
  }

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const faceMesh = new FaceMesh({
      locateFile: (file) => `/models/mediapipe/face_mesh/${file}`, // ruta de tu public
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true, // precisión máxima
      minDetectionConfidence: 0.8,
      minTrackingConfidence: 0.8,
    });

    faceMesh.onResults((results: Results) => {
      const canvasCtx = canvasRef.current!.getContext('2d');
      if (!canvasCtx) return;
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      canvasCtx.drawImage(
        results.image!,
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height
      );

      if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
          drawConnectors(canvasCtx, landmarks, toTuples(FACEMESH_TESSELATION), {
            color: '#C0C0C0',
            lineWidth: 1,
          });
        }
      }
      canvasCtx.restore();
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => await faceMesh.send({ image: videoRef.current! }),
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
    <div style={{ position: 'relative', width: 640, height: 480 }}>
      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} width={640} height={480} />
    </div>
  );
}
