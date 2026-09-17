"use client";

import { useLoader } from "@react-three/fiber";
import { forwardRef, type MutableRefObject } from "react";
import { DoubleSide, Group, SRGBColorSpace, TextureLoader } from "three";

const TRUCK_SRC = "/loader/image 1.png";

type TruckModelProps = {
  wheelRef: MutableRefObject<Group | null>;
};

export const TruckModel = forwardRef<Group, TruckModelProps>(function TruckModel(
  { wheelRef },
  ref,
) {
  const map = useLoader(TextureLoader, TRUCK_SRC);
  map.anisotropy = 8;
  map.colorSpace = SRGBColorSpace;

  const paint = (
    <meshBasicMaterial map={map} toneMapped={false} />
  );

  return (
    <group ref={ref}>
      <mesh position={[0, 0.4, 0.05]} castShadow>
        <boxGeometry args={[1.7, 0.22, 7.2]} />
        {paint}
      </mesh>

      <mesh position={[0, 1.72, -1.05]} castShadow>
        <boxGeometry args={[2.05, 2.35, 4.9]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>

      <mesh position={[0, 1.48, 2.55]} castShadow>
        <boxGeometry args={[1.9, 1.85, 2.15]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>

      <mesh position={[0, 2.92, -0.2]}>
        <boxGeometry args={[2.08, 0.1, 8.2]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>

      <mesh position={[0, 1.7, 3.72]}>
        <boxGeometry args={[1.9, 2.2, 0.08]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.7, -3.55]}>
        <boxGeometry args={[1.9, 2.35, 0.08]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>

      <mesh position={[1.08, 1.82, 0.05]} rotation={[0, Math.PI / 2, 0]} scale={[-1, 1, 1]}>
        <planeGeometry args={[9.35, 4.05]} />
        <meshBasicMaterial
          map={map}
          transparent
          alphaTest={0.12}
          toneMapped={false}
          side={DoubleSide}
          depthWrite
        />
      </mesh>
      <mesh position={[-1.08, 1.82, 0.05]} rotation={[0, -Math.PI / 2, 0]} scale={[-1, 1, 1]}>
        <planeGeometry args={[9.35, 4.05]} />
        <meshBasicMaterial
          map={map}
          transparent
          alphaTest={0.12}
          toneMapped={false}
          side={DoubleSide}
          depthWrite
        />
      </mesh>

      <group ref={wheelRef}>
        <Wheel position={[-0.92, 0.44, 2.45]} />
        <Wheel position={[0.92, 0.44, 2.45]} />
        <Wheel position={[-0.92, 0.44, -0.85]} />
        <Wheel position={[0.92, 0.44, -0.85]} />
        <Wheel position={[-0.92, 0.44, -2.35]} />
        <Wheel position={[0.92, 0.44, -2.35]} />
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0.1]}>
        <circleGeometry args={[1.05, 20]} />
        <meshBasicMaterial color="#111" transparent opacity={0.16} />
      </mesh>
    </group>
  );
});

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.44, 0.44, 0.3, 16]} />
        <meshBasicMaterial color="#1a0f12" />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 0.32, 12]} />
        <meshBasicMaterial color="#c44569" />
      </mesh>
    </group>
  );
}
