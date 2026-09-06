import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Procedural enterprise bullet-style CCTV camera.
 * Kept in named constants so a real product model (GLB) can replace the
 * mesh tree later without touching the surrounding scene or hotspot anchors.
 */

function useMaterials() {
  return useMemo(() => {
    const housing = new THREE.MeshStandardMaterial({
      color: "#2b3035",
      metalness: 0.92,
      roughness: 0.38,
    });
    const shield = new THREE.MeshStandardMaterial({
      color: "#3a4046",
      metalness: 0.85,
      roughness: 0.45,
    });
    const trim = new THREE.MeshStandardMaterial({
      color: "#15181b",
      metalness: 0.6,
      roughness: 0.6,
    });
    const bolt = new THREE.MeshStandardMaterial({
      color: "#8d959c",
      metalness: 1,
      roughness: 0.3,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: "#080b0e",
      metalness: 0.1,
      roughness: 0.06,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
    });
    const irLed = new THREE.MeshStandardMaterial({
      color: "#241014",
      metalness: 0.2,
      roughness: 0.35,
      emissive: new THREE.Color("#5c1420"),
      emissiveIntensity: 0.5,
    });
    const cable = new THREE.MeshStandardMaterial({
      color: "#101315",
      metalness: 0.2,
      roughness: 0.85,
    });
    return { housing, shield, trim, bolt, glass, irLed, cable };
  }, []);
}

export function CctvCamera({
  pointer,
  lowDetail = false,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
  lowDetail?: boolean;
}) {
  const head = useRef<THREE.Group>(null);
  const m = useMaterials();
  const seg = lowDetail ? 20 : 48;

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    if (!head.current) return;
    const p = pointer.current ?? { x: 0, y: 0 };
    const targetY = p.x * 0.42;
    const targetX = -p.y * 0.2;
    const k = 1 - Math.exp(-4 * delta);
    head.current.rotation.y += (targetY - head.current.rotation.y) * k;
    head.current.rotation.x += (targetX - head.current.rotation.x) * k;
  });

  const irRing = useMemo(
    () =>
      Array.from({ length: lowDetail ? 6 : 10 }, (_, i) => {
        const a = (i / (lowDetail ? 6 : 10)) * Math.PI * 2;
        return [Math.cos(a) * 0.315, Math.sin(a) * 0.315] as const;
      }),
    [lowDetail],
  );

  return (
    <group>
      {/* wall plate + bracket ------------------------------------------- */}
      <group position={[0, -0.95, -0.75]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.07, seg]} />
          <primitive object={m.housing} attach="material" />
        </mesh>
        <mesh position={[0, 0.055, 0]}>
          <torusGeometry args={[0.44, 0.016, 8, seg]} />
          <primitive object={m.trim} attach="material" />
        </mesh>
        {(
          [
            [0.3, 0.3],
            [-0.3, 0.3],
            [0.3, -0.3],
            [-0.3, -0.3],
          ] as [number, number][]
        ).map(([x, z], i) => (
          <mesh key={i} position={[x, 0.05, z]} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.035, 0.035, 0.05, 12]} />
            <primitive object={m.bolt} attach="material" />
          </mesh>
        ))}
        {/* cable gland */}
        <mesh position={[0, -0.06, 0]}>
          <cylinderGeometry args={[0.09, 0.11, 0.16, 16]} />
          <primitive object={m.trim} attach="material" />
        </mesh>
        <mesh position={[0, -0.28, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.34, 12]} />
          <primitive object={m.cable} attach="material" />
        </mesh>
      </group>

      {/* arm ------------------------------------------------------------- */}
      <group position={[0, -0.5, -0.6]}>
        <mesh position={[0, 0.02, 0]} rotation-z={0} castShadow>
          <cylinderGeometry args={[0.13, 0.16, 0.62, seg / 2]} />
          <primitive object={m.housing} attach="material" />
        </mesh>
        <mesh position={[0, 0.36, 0.06]} rotation-x={0.5} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.42, seg / 2]} />
          <primitive object={m.housing} attach="material" />
        </mesh>
        {/* knuckle joint */}
        <mesh position={[0, 0.56, 0.16]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.17, 0.17, 0.26, seg / 2]} />
          <primitive object={m.shield} attach="material" />
        </mesh>
        <mesh position={[0.14, 0.56, 0.16]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.06, 0.06, 0.06, 12]} />
          <primitive object={m.bolt} attach="material" />
        </mesh>
        <mesh position={[-0.14, 0.56, 0.16]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.06, 0.06, 0.06, 12]} />
          <primitive object={m.bolt} attach="material" />
        </mesh>
      </group>

      {/* camera head ----------------------------------------------------- */}
      <group ref={head} position={[0, 0.1, 0]}>
        {/* main barrel */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.4, 0.4, 1.9, seg]} rotation-x={Math.PI / 2} />
          <primitive object={m.housing} attach="material" />
          <group />
        </mesh>
        {/* rotate barrel to face +Z */}
        <group rotation-x={Math.PI / 2}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.4, 0.4, 1.9, seg]} />
            <primitive object={m.housing} attach="material" />
          </mesh>
          {/* rear cap */}
          <mesh position={[0, -0.98, 0]}>
            <cylinderGeometry args={[0.41, 0.36, 0.1, seg]} />
            <primitive object={m.trim} attach="material" />
          </mesh>
          {/* body seam rings */}
          <mesh position={[0, 0.55, 0]}>
            <torusGeometry args={[0.402, 0.012, 8, seg]} />
            <primitive object={m.trim} attach="material" />
          </mesh>
          <mesh position={[0, -0.45, 0]}>
            <torusGeometry args={[0.402, 0.012, 8, seg]} />
            <primitive object={m.trim} attach="material" />
          </mesh>
          {/* front bezel */}
          <mesh position={[0, 0.96, 0]}>
            <cylinderGeometry args={[0.43, 0.42, 0.12, seg]} />
            <primitive object={m.shield} attach="material" />
          </mesh>
          {/* IR ring plate */}
          <mesh position={[0, 1.015, 0]}>
            <cylinderGeometry args={[0.41, 0.41, 0.02, seg]} />
            <primitive object={m.trim} attach="material" />
          </mesh>
          {irRing.map(([x, z], i) => (
            <mesh key={i} position={[x, 1.03, z]}>
              <sphereGeometry args={[0.045, 12, 10]} />
              <primitive object={m.irLed} attach="material" />
            </mesh>
          ))}
          {/* lens housing + glass */}
          <mesh position={[0, 1.02, 0]}>
            <cylinderGeometry args={[0.22, 0.24, 0.09, seg]} />
            <primitive object={m.shield} attach="material" />
          </mesh>
          <mesh position={[0, 1.075, 0]}>
            <sphereGeometry args={[0.2, seg, seg / 2, 0, Math.PI * 2, 0, Math.PI / 2.4]} />
            <primitive object={m.glass} attach="material" />
          </mesh>
        </group>

        {/* sun shield */}
        <group position={[0, 0.34, 0.06]}>
          <mesh rotation-x={Math.PI / 2} castShadow>
            <cylinderGeometry
              args={[0.47, 0.47, 1.7, seg, 1, true, Math.PI * 0.08, Math.PI * 0.84]}
            />
            <primitive object={m.shield} attach="material" />
          </mesh>
          {!lowDetail && (
            <>
              <mesh position={[0.2, 0.0, 0.1]} rotation-x={Math.PI / 2}>
                <boxGeometry args={[0.012, 1.6, 0.05]} />
                <primitive object={m.trim} attach="material" />
              </mesh>
              <mesh position={[-0.2, 0.0, 0.1]} rotation-x={Math.PI / 2}>
                <boxGeometry args={[0.012, 1.6, 0.05]} />
                <primitive object={m.trim} attach="material" />
              </mesh>
            </>
          )}
          <mesh position={[0, -0.08, -0.85]}>
            <boxGeometry args={[0.34, 0.05, 0.14]} />
            <primitive object={m.trim} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  );
}
