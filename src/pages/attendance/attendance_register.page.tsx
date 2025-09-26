import FaceDetector from '@/components/attendance/face-id/face-detection-camera';

const FaceIdScanner: React.FC = () => {
  return (
    <FaceDetector
      width={540}
      height={540}
      maxFaces={1}
      showPoints={true}
      // onFaceDetected={(results) => console.log(results.multiFaceLandmarks)}
    />
  );
};

export default FaceIdScanner;
