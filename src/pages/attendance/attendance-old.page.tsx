import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
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
  const [authenticated, setAuthenticated] = useState(false);

  const totalTime = 2000;
  const keyLandmarks = [1, 33, 263, 61, 291];
  const tuplesTesselation = FACEMESH_TESSELATION.reduce<[number, number][]>((acc, val, i) => {
    if (i % 2 === 0 && i + 1 < FACEMESH_TESSELATION.length)
      acc.push([val, FACEMESH_TESSELATION[i + 1]]);
    return acc;
  }, []);

  const progress = useMotionValue(0);
  const smoothProgress = useSpring(progress, { stiffness: 140, damping: 28 });

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

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image!, 0, 0, canvas.width, canvas.height);

      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        setFaceDetected(true);
        const landmarks = results.multiFaceLandmarks[0];

        drawConnectors(ctx, landmarks, tuplesTesselation, {
          color: 'rgba(0,255,200,0.25)',
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

  const circleSize = 400;
  const radius = 160;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = useTransform(smoothProgress, (p) => circumference - p * circumference);

  return (
    <div className="w-screen h-screen  flex items-center justify-center p-4">
      <div className="relative w-full max-w-[640px] p-8 bg-black bg-opacity-70 rounded-[48px] shadow-2xl flex flex-col items-center">
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
          <svg className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 -rotate-90">
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="18"
              fill="transparent"
            />
            <motion.circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke="url(#gradientStroke)"
              strokeWidth="18"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
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
              scale: faceDetected ? 1.05 : 1,
              boxShadow: faceDetected
                ? '0 0 60px 20px rgba(52,211,153,0.5)'
                : '0 0 25px 10px rgba(255,255,255,0.1)',
            }}
            transition={{ duration: 0.4 }}
            className={`absolute top-1/2 left-1/2 w-[240px] h-[240px] rounded-[40px] border-4 ${
              faceDetected ? 'border-green-400' : 'border-gray-500'
            } -translate-x-1/2 -translate-y-1/2 flex items-center justify-center`}
          >
            <div className="w-[160px] h-[160px] rounded-[32px] border-2 border-gray-300" />
          </motion.div>
        </div>
        <AnimatePresence>
          {!loading && (
            <motion.div
              key="progress-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center mt-8"
            >
              {!authenticated ? (
                <>
                  <p className="text-3xl font-bold text-white">
                    {Math.round(smoothProgress.get() * 100)}%
                  </p>
                  <p className="text-lg text-gray-300 mt-2">Mantén tu rostro centrado</p>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-4 px-8 py-4 bg-green-500 bg-opacity-20 rounded-3xl text-green-400 font-bold shadow-md text-lg"
                >
                  ✅ Rostro autenticado con éxito
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


// import { useEffect, useRef } from 'react';
// import { Camera } from '@mediapipe/camera_utils';
// import { FaceMesh, Results, NormalizedLandmark } from '@mediapipe/face_mesh';

// interface FaceDetectorProps {
//   width?: number;
//   height?: number;
//   maxFaces?: number;
//   showPoints?: boolean;
//   modelBasePath?: string;
//   onFaceDetected?: (data: Results) => void;
// }

// export default function FaceDetector({
//   width = 640,
//   height = 480,
//   maxFaces = 1,
//   showPoints = true,
//   modelBasePath = '/models/mediapipe',
//   onFaceDetected,
// }: FaceDetectorProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const gl = canvas.getContext('webgl');
//     if (!gl) return;

//     canvas.width = width;
//     canvas.height = height;

//     // --- Shader para video ---
//     const vsVideo = `
//       attribute vec2 a_position;
//       attribute vec2 a_texCoord;
//       varying vec2 v_texCoord;
//       void main() {
//         gl_Position = vec4(a_position, 0, 1);
//         v_texCoord = a_texCoord;
//       }
//     `;
//     const fsVideo = `
//       precision mediump float;
//       varying vec2 v_texCoord;
//       uniform sampler2D u_texture;
//       void main() {
//         gl_FragColor = texture2D(u_texture, v_texCoord);
//       }
//     `;

//     // --- Shader para puntos circulares ---
//     const vsPoints = `
//       attribute vec2 a_position;
//       uniform float u_pointSize;
//       void main() {
//         gl_Position = vec4(a_position, 0, 1);
//         gl_PointSize = u_pointSize;
//       }
//     `;
//     const fsPoints = `
//       precision mediump float;
//       void main() {
//         vec2 coord = gl_PointCoord - vec2(0.5);
//         float dist = length(coord);
//         if (dist > 0.5) discard; // círculo
//         gl_FragColor = vec4(0.078, 0.619, 0.639, 1.0);
//       }
//     `;

//     // --- Funciones helpers ---
//     function createShader(gl: WebGLRenderingContext, type: number, source: string) {
//       const shader = gl.createShader(type)!;
//       gl.shaderSource(shader, source);
//       gl.compileShader(shader);
//       if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//         console.error(gl.getShaderInfoLog(shader));
//       }
//       return shader;
//     }

//     function createProgram(gl: WebGLRenderingContext, vsSrc: string, fsSrc: string) {
//       const vs = createShader(gl, gl.VERTEX_SHADER, vsSrc);
//       const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSrc);
//       const prog = gl.createProgram()!;
//       gl.attachShader(prog, vs);
//       gl.attachShader(prog, fs);
//       gl.linkProgram(prog);
//       if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
//         console.error(gl.getProgramInfoLog(prog));
//       }
//       return prog;
//     }

//     const videoProgram = createProgram(gl, vsVideo, fsVideo);
//     const pointsProgram = createProgram(gl, vsPoints, fsPoints);

//     // --- Buffers video ---
//     const posBuffer = gl.createBuffer()!;
//     gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

//     const texBuffer = gl.createBuffer()!;
//     gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, 0, 1, 1, 0, 0, 0]), gl.STATIC_DRAW);

//     const texture = gl.createTexture()!;
//     gl.bindTexture(gl.TEXTURE_2D, texture);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

//     // --- FaceMesh ---
//     const faceMesh = new FaceMesh({
//       locateFile: (file) => `${modelBasePath}/face_mesh/${file}`,
//     });
//     faceMesh.setOptions({ selfieMode: true, maxNumFaces: maxFaces, refineLandmarks: true });

//     faceMesh.onResults((results: Results) => {
//       gl.viewport(0, 0, width, height);
//       gl.clearColor(0, 0, 0, 0);
//       gl.clear(gl.COLOR_BUFFER_BIT);

//       // --- Dibujar video ---
//       gl.useProgram(videoProgram);
//       const posLoc = gl.getAttribLocation(videoProgram, 'a_position');
//       gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
//       gl.enableVertexAttribArray(posLoc);
//       gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

//       const texLoc = gl.getAttribLocation(videoProgram, 'a_texCoord');
//       gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
//       gl.enableVertexAttribArray(texLoc);
//       gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);

//       gl.activeTexture(gl.TEXTURE0);
//       gl.bindTexture(gl.TEXTURE_2D, texture);
//       gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
//       const uTexture = gl.getUniformLocation(videoProgram, 'u_texture');
//       gl.uniform1i(uTexture, 0);

//       gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

//       // --- Dibujar landmarks ---
//       if (showPoints && results.multiFaceLandmarks?.[0]) {
//         gl.useProgram(pointsProgram);

//         const landmarks = results.multiFaceLandmarks[0];
//         const vertices: number[] = [];
//         landmarks.forEach((lm: NormalizedLandmark) => {
//           const x = 2 * lm.x - 1; // reflejo horizontal
//           const y = 1 - 2 * lm.y; // invertir Y
//           vertices.push(x, y);
//         });

//         const pointBuffer = gl.createBuffer()!;
//         gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
//         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);

//         const aPosition = gl.getAttribLocation(pointsProgram, 'a_position');
//         gl.enableVertexAttribArray(aPosition);
//         gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

//         const uPointSize = gl.getUniformLocation(pointsProgram, 'u_pointSize');
//         gl.uniform1f(uPointSize, 2.5);

//         gl.drawArrays(gl.POINTS, 0, vertices.length / 2);
//       }

//       onFaceDetected?.(results);
//     });

//     // --- Camera ---
//     const camera = new Camera(video, {
//       onFrame: async () => {
//         if (video.readyState >= 2) await faceMesh.send({ image: video });
//       },
//       width,
//       height,
//     });
//     camera.start();

//     return () => {
//       camera.stop();
//       faceMesh.close();
//     };
//   }, [width, height, maxFaces, modelBasePath, showPoints, onFaceDetected]);

//   return (
//     <div>
//       <video ref={videoRef} autoPlay playsInline style={{ display: 'none' }} />
//       <canvas ref={canvasRef} width={width} height={height} />
//     </div>
//   );
// }
