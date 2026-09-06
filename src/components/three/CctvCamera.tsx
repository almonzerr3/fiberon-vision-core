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
      color: "#1a1214",
      metalness: 0.2,
      roughness: 0.35,
      emissive: new THREE.Color("#3a0f16"),
      emissiveIntensity: 0.22,
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

  const irRing = useMemo(() => {
    const n = lowDetail ? 8 : 12;
    return Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      return [Math.cos(a) * 0.3, Math.sin(a) * 0.3] as [number, number];
    });
  }, [lowDetail]);

  return (
    <group>
      {/* wall plate ------------------------------------------------------ */}
      <group position={[0, -0.4, -1.6]} rotation-x={Math.PI / 2}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.08, seg]} />
          <primitive object={m.housing} attach="material" />
        </mesh>
        <mesh position={[0, 0.045, 0]}>
          <torusGeometry args={[0.37, 0.014, 8, seg]} />
          <primitive object={m.trim} attach="material" />
        </mesh>
        {(
          [
            [0.25, 0.25],
            [-0.25, 0.25],
            [0.25, -0.25],
            [-0.25, -0.25],
          ] as [number, number][]
        ).map(([x, z], i) => (
          <mesh key={i} position={[x, 0.055, z]}>
            <cylinderGeometry args={[0.032, 0.032, 0.04, 12]} />
            <primitive object={m.bolt} attach="material" />
          </mesh>
        ))}
      </group>

      {/* cable gland + drop loop ----------------------------------------- */}
      <mesh position={[0, -0.4, -1.48]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.075, 0.095, 0.16, 16]} />
        <primitive object={m.trim} attach="material" />
      </mesh>
      <mesh position={[0, -0.62, -1.5]}>
        <cylinderGeometry args={[0.045, 0.045, 0.45, 12]} />
        <primitive object={m.cable} attach="material" />
      </mesh>

      {/* arm ------------------------------------------------------------- */}
      <mesh position={[0, -0.4, -1.05]} rotation-x={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.95, seg / 2]} />
        <primitive object={m.housing} attach="material" />
      </mesh>
      <mesh position={[0, -0.4, -0.56]} castShadow>
        <sphereGeometry args={[0.16, seg / 2, seg / 3]} />
        <primitive object={m.shield} attach="material" />
      </mesh>
      <mesh position={[0, -0.24, -0.5]} rotation-x={-0.22} castShadow>
        <cylinderGeometry args={[0.1, 0.11, 0.42, seg / 2]} />
        <primitive object={m.housing} attach="material" />
      </mesh>
      {/* tilt knuckle under the barrel */}
      <mesh position={[0, -0.02, -0.44]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.15, 0.15, 0.24, seg / 2]} />
        <primitive object={m.shield} attach="material" />
      </mesh>
      {[0.13, -0.13].map((x) => (
        <mesh key={x} position={[x, -0.02, -0.44]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.05, 0.05, 0.06, 12]} />
          <primitive object={m.bolt} attach="material" />
        </mesh>
      ))}

      {/* camera head ----------------------------------------------------- */}
      <group ref={head} position={[0, 0.3, 0]}>
        <group rotation-x={Math.PI / 2}>
          {/* barrel */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.36, 0.36, 1.75, seg]} />
            <primitive object={m.housing} attach="material" />
          </mesh>
          {/* rear cap */}
          <mesh position={[0, -0.9, 0]}>
            <cylinderGeometry args={[0.37, 0.32, 0.1, seg]} />
            <primitive object={m.trim} attach="material" />
          </mesh>
          {/* seam rings */}
          <mesh position={[0, 0.5, 0]}>
            <torusGeometry args={[0.362, 0.011, 8, seg]} />
            <primitive object={m.trim} attach="material" />
          </mesh>
          <mesh position={[0, -0.42, 0]}>
            <torusGeometry args={[0.362, 0.011, 8, seg]} />
            <primitive object={m.trim} attach="material" />
          </mesh>
          {/* front bezel */}
          <mesh position={[0, 0.88, 0]} castShadow>
            <cylinderGeometry args={[0.39, 0.37, 0.12, seg]} />
            <primitive object={m.shield} attach="material" />
          </mesh>
          {/* recessed IR / lens face */}
          <mesh position={[0, 0.93, 0]}>
            <cylinderGeometry args={[0.36, 0.36, 0.02, seg]} />
            <primitive object={m.trim} attach="material" />
          </mesh>
          {irRing.map(([x, z], i) => (
            <mesh key={i} position={[x, 0.945, z]}>
              <cylinderGeometry args={[0.032, 0.032, 0.012, 10]} />
              <primitive object={m.irLed} attach="material" />
            </mesh>
          ))}
          {/* lens barrel + dome glass */}
          <mesh position={[0, 0.95, 0]}>
            <cylinderGeometry args={[0.19, 0.21, 0.08, seg]} />
            <primitive object={m.shield} attach="material" />
          </mesh>
          <mesh position={[0, 0.985, 0]}>
            <sphereGeometry args={[0.175, seg, seg / 2, 0, Math.PI * 2, 0, Math.PI / 2.6]} />
            <primitive object={m.glass} attach="material" />
          </mesh>
        </group>

        {/* sun shield */}
        <group position={[0, 0.3, 0.02]}>
          <mesh rotation-x={Math.PI / 2} castShadow>
            <cylinderGeometry
              args={[0.43, 0.43, 1.55, seg, 1, true, Math.PI * 0.1, Math.PI * 0.8]}
            />
            <primitive object={m.shield} attach="material" />
          </mesh>
          {!lowDetail &&
            [0.18, -0.18].map((x) => (
              <mesh key={x} position={[x, -0.02, 0.06]} rotation-x={Math.PI / 2}>
                <boxGeometry args={[0.01, 1.45, 0.045]} />
                <primitive object={m.trim} attach="material" />
              </mesh>
            ))}
          <mesh position={[0, -0.07, -0.78]}>
            <boxGeometry args={[0.3, 0.045, 0.12]} />
            <primitive object={m.trim} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  );
}
