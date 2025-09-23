import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import FaceHologramCamera from './FaceHologramCamera'; // nuevo componente con video

const instructions: string[] = [
  'Gira suavemente a la izquierda',
  'Gira suavemente a la derecha',
  'Sube la cabeza',
  'Baja la cabeza',
];

const FaceIDRegisterFinal: React.FC = () => {
  const [currentInstruction, setCurrentInstruction] = useState<number>(0);
  const [registrationComplete, setRegistrationComplete] = useState<boolean>(false);

  useEffect(() => {
    if (registrationComplete) return;
    const interval = setInterval(() => {
      setCurrentInstruction((prev) => (prev < instructions.length - 1 ? prev + 1 : prev));
      if (currentInstruction === instructions.length - 1) {
        setTimeout(() => setRegistrationComplete(true), 1500);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentInstruction, registrationComplete]);

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-sm flex flex-col items-center bg-white/5 backdrop-blur-md rounded-3xl p-6 shadow-lg">
        {/* Holograma con cámara */}
        <div className="w-64 h-64 mb-4">
          <Canvas camera={{ position: [0, 0, 2.5] }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[0, 2, 5]} intensity={1} />
            <FaceHologramCamera /> {/* ⚡ Aquí reemplazamos el GLB */}
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </div>

        {/* Indicaciones animadas */}
        <AnimatePresence mode="wait">
          {!registrationComplete && (
            <motion.div
              key={currentInstruction}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-gray-200 text-center text-lg font-semibold mb-2"
            >
              {instructions[currentInstruction]}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtítulo */}
        <div className="text-gray-400 text-sm mb-4">
          {registrationComplete
            ? 'Registro completado'
            : 'Moviendo tu rostro para registrar FaceID...'}
        </div>

        {/* Botones minimalistas */}
        <div className="flex space-x-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-white/10 rounded-full backdrop-blur-md"
          >
            <X className="w-6 h-6 text-red-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-white/10 rounded-full backdrop-blur-md"
          >
            <Check className="w-6 h-6 text-green-400" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default FaceIDRegisterFinal;
