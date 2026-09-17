"use client";

import { useGSAP } from "@gsap/react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Group, PerspectiveCamera } from "three";
import { Highway } from "@/components/loader/Highway";
import { TruckModel } from "@/components/loader/TruckModel";
import { gsap, registerGsap } from "@/lib/gsap";

registerGsap();
gsap.registerPlugin(useGSAP);

type TruckCanvasProps = {
  lite: boolean;
  onComplete: () => void;
};

function Director({
  lite,
  onComplete,
}: {
  lite: boolean;
  onComplete: () => void;
}) {
  const truckRef = useRef<Group>(null);
  const wheelRef = useRef<Group>(null);
  const lastZ = useRef(-52);
  const { camera } = useThree();

  useGSAP(
    () => {
      const truck = truckRef.current;
      const persp = camera as PerspectiveCamera;
      if (!truck) return;

      gsap.set(truck.position, { x: 0, y: 0, z: -52 });
      gsap.set(persp.position, { x: 5.4, y: 2.35, z: 13.5 });
      persp.fov = lite ? 46 : 40;
      persp.near = 0.1;
      persp.far = 220;
      persp.lookAt(0, 1.2, -20);
      persp.updateProjectionMatrix();

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        onComplete,
      });

      tl.to(
        truck.position,
        {
          z: 8.5,
          duration: 6.4,
          ease: "power1.inOut",
        },
        0,
      )
        .to(
          persp.position,
          {
            x: 3.6,
            z: 7.4,
            y: 1.7,
            duration: 6.4,
            ease: "power1.inOut",
            onUpdate: () => {
              persp.lookAt(0.15, 1.25, truck.position.z + 0.8);
            },
          },
          0,
        )
        .to(
          persp,
          {
            fov: 48,
            duration: 1.4,
            ease: "power1.inOut",
            onUpdate: () => persp.updateProjectionMatrix(),
          },
          5.1,
        );
    },
    { dependencies: [lite] },
  );

  useFrame(() => {
    const truck = truckRef.current;
    const wheels = wheelRef.current;
    if (!truck || !wheels) return;
    const dz = truck.position.z - lastZ.current;
    lastZ.current = truck.position.z;
    wheels.children.forEach((wheel) => {
      wheel.rotation.x += dz * 1.65;
    });
    truck.rotation.z = Math.sin(truck.position.z * 0.28) * 0.008;
    truck.position.y = Math.abs(Math.sin(truck.position.z * 0.4)) * 0.03;
  });

  return <TruckModel ref={truckRef} wheelRef={wheelRef} />;
}

export function TruckCanvas({ lite, onComplete }: TruckCanvasProps) {
  return (
    <Canvas
      className="preloader-canvas"
      camera={{ fov: 40, position: [5.4, 2.35, 13.5], near: 0.1, far: 220 }}
      dpr={lite ? 1 : [1, 1.5]}
      shadows={!lite}
      gl={{
        antialias: !lite,
        alpha: false,
        powerPreference: lite ? "low-power" : "high-performance",
        stencil: false,
        depth: true,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#f5f6f4", 1);
      }}
    >
      <color attach="background" args={["#f5f6f4"]} />
      <fog attach="fog" args={["#f5f6f4", lite ? 18 : 28, lite ? 70 : 100]} />
      <hemisphereLight args={["#eef4ff", "#5a7c47", 1]} />
      <directionalLight
        position={[12, 20, 8]}
        intensity={1.35}
        castShadow={!lite}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <ambientLight intensity={0.42} />
      <Suspense fallback={null}>
        <Highway lite={lite} />
        <Director lite={lite} onComplete={onComplete} />
      </Suspense>
    </Canvas>
  );
}
