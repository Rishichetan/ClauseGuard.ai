import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

function CardMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (meshRef.current) {
      targetRotation.current.x = -mouseRef.current.y * 0.3;
      targetRotation.current.y = mouseRef.current.x * 0.3;
      
      meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 5 * delta;
      meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 5 * delta;
    }
    if (glowRef.current && meshRef.current) {
      glowRef.current.rotation.x = meshRef.current.rotation.x;
      glowRef.current.rotation.y = meshRef.current.rotation.y;
      const scale = hovered ? 1.08 : 1.02;
      glowRef.current.scale.setScalar(scale + Math.sin(Date.now() * 0.002) * 0.01);
    }
  });

  const handlePointerMove = (e: THREE.Event | any) => {
    const event = e as { uv?: THREE.Vector2 };
    if (event.uv) {
      mouseRef.current.x = (event.uv.x - 0.5) * 2;
      mouseRef.current.y = (event.uv.y - 0.5) * 2;
    }
  };

  return (
    <group>
      {/* Glow halo behind */}
      <RoundedBox
        ref={glowRef}
        args={[4.3, 2.8, 0.4]}
        radius={0.1}
        smoothness={4}
      >
        <meshBasicMaterial
          color="#0EA5E9"
          transparent
          opacity={0.15}
        />
      </RoundedBox>

      {/* Main card body */}
      <RoundedBox
        ref={meshRef}
        args={[4, 2.6, 0.25]}
        radius={0.08}
        smoothness={4}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshPhysicalMaterial
          color="#111827"
          metalness={0.1}
          roughness={0.2}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>

      {/* Chip icon */}
      <RoundedBox args={[0.5, 0.35, 0.05]} radius={0.05} position={[-1.5, 0.6, 0.15]}>
        <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.3, 0.2, 0.06]} radius={0.03} position={[-1.5, 0.6, 0.16]}>
        <meshStandardMaterial color="#111827" />
      </RoundedBox>

      {/* Text labels */}
      <Text
        position={[0.3, 0.5, 0.15]}
        fontSize={0.35}
        color="#0EA5E9"
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2"
        anchorX="center"
        anchorY="middle"
      >
        CLAUSEGUARD
      </Text>

      <Text
        position={[0.3, 0.05, 0.15]}
        fontSize={0.18}
        color="#94A3B8"
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        AI RISK ANALYSIS
      </Text>

      <Text
        position={[0.3, -0.5, 0.15]}
        fontSize={0.12}
        color="#6B7280"
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        SECURE • ANALYZE • PROTECT
      </Text>

      {/* Decorative lines */}
      <mesh position={[1.5, -0.2, 0.14]}>
        <planeGeometry args={[0.8, 0.02]} />
        <meshBasicMaterial color="#0EA5E9" transparent opacity={0.5} />
      </mesh>
      <mesh position={[1.5, -0.35, 0.14]}>
        <planeGeometry args={[0.5, 0.02]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

export default function Card3D() {
  return (
    <div className="w-[400px] h-[260px] relative" style={{ perspective: '1000px' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 2, 4]} intensity={2} color="#0EA5E9" />
        <pointLight position={[-2, -2, 4]} intensity={1} color="#8B5CF6" />
        <pointLight position={[0, 0, 6]} intensity={0.5} color="#ffffff" />
        <CardMesh />
      </Canvas>
    </div>
  );
}
