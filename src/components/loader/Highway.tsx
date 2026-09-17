"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import {
  CanvasTexture,
  Color,
  InstancedMesh,
  Object3D,
  RepeatWrapping,
  SRGBColorSpace,
} from "three";

function useRoadTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#3c3f45";
    ctx.fillRect(0, 0, 256, 1024);

    ctx.fillStyle = "#2f3238";
    for (let y = 0; y < 1024; y += 18) {
      ctx.fillRect(0, y, 256, 1);
    }

    ctx.fillStyle = "#f2d25a";
    for (let y = 0; y < 1024; y += 72) {
      ctx.fillRect(122, y, 12, 34);
    }

    ctx.fillStyle = "#eef0f3";
    ctx.fillRect(18, 0, 7, 1024);
    ctx.fillRect(231, 0, 7, 1024);

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(1, 22);
    texture.anisotropy = 8;
    return texture;
  }, []);
}

function TreeField({ count }: { count: number }) {
  const canopy = useRef<InstancedMesh>(null);
  const trunk = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  useLayoutEffect(() => {
    const canopyMesh = canopy.current;
    const trunkMesh = trunk.current;
    if (!canopyMesh || !trunkMesh) return;

    for (let i = 0; i < count; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const z = -95 + (i / count) * 175;
      const x = side * (8.6 + (i % 6) * 1.25 + (i % 3) * 0.35);
      const scale = 0.85 + (i % 5) * 0.16;

      dummy.position.set(x, 1.55 * scale, z);
      dummy.scale.set(scale, scale * 1.15, scale);
      dummy.rotation.set(0, (i * 0.7) % 1, 0);
      dummy.updateMatrix();
      canopyMesh.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x, 0.55, z);
      dummy.scale.set(scale * 0.55, scale, scale * 0.55);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      trunkMesh.setMatrixAt(i, dummy.matrix);
    }

    canopyMesh.instanceMatrix.needsUpdate = true;
    trunkMesh.instanceMatrix.needsUpdate = true;
  }, [count, dummy]);

  return (
    <group>
      <instancedMesh ref={trunk} args={[undefined, undefined, count]} frustumCulled={false}>
        <cylinderGeometry args={[0.18, 0.26, 1.2, 5]} />
        <meshStandardMaterial color="#5b3b27" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={canopy} args={[undefined, undefined, count]} frustumCulled={false}>
        <coneGeometry args={[1.2, 2.8, 6]} />
        <meshStandardMaterial color="#2f6b3c" roughness={0.82} />
      </instancedMesh>
    </group>
  );
}

function Guardrails() {
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  useLayoutEffect(() => {
    const rail = mesh.current;
    if (!rail) return;
    const count = 36;
    for (let i = 0; i < count; i += 1) {
      const side = i < 18 ? -1 : 1;
      const index = i % 18;
      dummy.position.set(side * 6.15, 0.42, -80 + index * 9);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      rail.setMatrixAt(i, dummy.matrix);
    }
    rail.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, 36]} frustumCulled={false}>
      <boxGeometry args={[0.12, 0.42, 7.4]} />
      <meshStandardMaterial color="#c9ccd1" metalness={0.55} roughness={0.35} />
    </instancedMesh>
  );
}

export function Highway({ lite }: { lite: boolean }) {
  const roadMap = useRoadTexture();
  const grass = useMemo(() => new Color("#4e8a4a"), []);
  const grassDark = useMemo(() => new Color("#3e6f3d"), []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -20]} receiveShadow>
        <planeGeometry args={[12.4, 220]} />
        <meshStandardMaterial map={roadMap ?? undefined} color={roadMap ? "#ffffff" : "#3c3f45"} roughness={0.92} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-18, -0.02, -20]} receiveShadow>
        <planeGeometry args={[24, 220]} />
        <meshStandardMaterial color={grass} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[18, -0.02, -20]} receiveShadow>
        <planeGeometry args={[24, 220]} />
        <meshStandardMaterial color={grassDark} roughness={1} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7.4, 0.01, -20]}>
        <planeGeometry args={[2.2, 220]} />
        <meshStandardMaterial color="#6aa15a" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7.4, 0.01, -20]}>
        <planeGeometry args={[2.2, 220]} />
        <meshStandardMaterial color="#5d934f" roughness={1} />
      </mesh>

      <Guardrails />
      <TreeField count={lite ? 18 : 36} />

      <mesh position={[0, 0.05, -18]}>
        <boxGeometry args={[1.6, 0.04, 220]} />
        <meshStandardMaterial color="#2b2e33" />
      </mesh>
    </group>
  );
}
