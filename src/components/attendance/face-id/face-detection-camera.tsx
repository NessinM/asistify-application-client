import { useEffect, useRef } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { FaceMesh, Results } from '@mediapipe/face_mesh';

interface FaceDetectorProps {
  width?: number;
  height?: number;
  maxFaces?: number;
  showPoints?: boolean;
  modelBasePath?: string;
  onFaceDetected?: (data: Results) => void;
}

export default function FaceDetector({
  width = 640,
  height = 480,
  maxFaces = 1,
  showPoints = true,
  modelBasePath = '/models/mediapipe',
  onFaceDetected,
}: FaceDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    canvas.width = width;
    canvas.height = height;

    // --- Shaders ---
    const vsVideo = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      void main() {
        gl_Position = vec4(a_position, 0, 1);
        v_texCoord = a_texCoord;
      }
    `;
    const fsVideo = `
      precision mediump float;
      varying vec2 v_texCoord;
      uniform sampler2D u_texture;
      void main() {
        gl_FragColor = texture2D(u_texture, vec2(v_texCoord.x, 1.0 - v_texCoord.y));

      }
    `;
    const vsPoints = `
      attribute vec2 a_position;
      uniform float u_pointSize;
      void main() {
        gl_Position = vec4(a_position, 0, 1);
        gl_PointSize = u_pointSize;
      }
    `;
    const fsPoints = `
      precision mediump float;
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        if(length(coord) > 0.5) discard;
        gl_FragColor = vec4(0.078, 0.619, 0.639, 1.0);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
      }
      return shader;
    }

    function createProgram(gl: WebGLRenderingContext, vsSrc: string, fsSrc: string) {
      const vs = createShader(gl, gl.VERTEX_SHADER, vsSrc);
      const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSrc);
      const prog = gl.createProgram()!;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(prog));
      }
      return prog;
    }

    const videoProgram = createProgram(gl, vsVideo, fsVideo);
    const pointsProgram = createProgram(gl, vsPoints, fsPoints);

    // --- Buffers fijos ---
    const posBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const texBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, 0, 1, 1, 0, 0, 0]), gl.STATIC_DRAW);

    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const pointBuffer = gl.createBuffer()!; // buffer único para puntos

    // --- FaceMesh ---
    const faceMesh = new FaceMesh({
      locateFile: (file) => `${modelBasePath}/face_mesh/${file}`,
    });
    faceMesh.setOptions({ selfieMode: true, maxNumFaces: maxFaces, refineLandmarks: true });

    faceMesh.onResults((results: Results) => {
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // --- Dibujar video ---
      gl.useProgram(videoProgram);
      const posLoc = gl.getAttribLocation(videoProgram, 'a_position');
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      const texLoc = gl.getAttribLocation(videoProgram, 'a_texCoord');
      gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
      gl.enableVertexAttribArray(texLoc);
      gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
      const uTexture = gl.getUniformLocation(videoProgram, 'u_texture');
      gl.uniform1i(uTexture, 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // --- Dibujar landmarks ---
      if (showPoints && results.multiFaceLandmarks?.[0]) {
        gl.useProgram(pointsProgram);
        const landmarks = results.multiFaceLandmarks[0];
        const aspect = width / height;
          const vertices = landmarks.flatMap((lm) => [
            (lm.x * 2 - 1) * aspect,
            1 - lm.y * 2,
          ]);

        gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);

        const aPosition = gl.getAttribLocation(pointsProgram, 'a_position');
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        const uPointSize = gl.getUniformLocation(pointsProgram, 'u_pointSize');
        gl.uniform1f(uPointSize, Math.max(width, height) / 300);


        gl.drawArrays(gl.POINTS, 0, vertices.length / 2);
      }

      onFaceDetected?.(results);
    });

    // --- Cámara ---
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
  }, [width, height, maxFaces, modelBasePath, showPoints, onFaceDetected]);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ display: 'none' }} />
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
}
