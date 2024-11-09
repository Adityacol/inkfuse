import React, { useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import { Mesh } from 'three';

const Background: React.FC = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[5, 32, 32]} />
      <meshStandardMaterial color="#4B0082" wireframe />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
    </mesh>
  );
};

export default Background;