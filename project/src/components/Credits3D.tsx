import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

interface Credits3DProps {
  theme: string;
}

const Credits3D: React.FC<Credits3DProps> = ({ theme }) => {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.1;
      textRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <div className="relative h-20">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Text
          ref={textRef}
          color={theme === 'dark' ? '#ffffff' : '#000000'}
          fontSize={0.5}
          maxWidth={200}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="center"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptug8zYS_SKggPNyC0IT4ttDfA.woff2"
          anchorX="center"
          anchorY="middle"
        >
          Created by Aditya
        </Text>
      </Canvas>
    </div>
  );
};

export default Credits3D;