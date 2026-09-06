import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Html, AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import { CctvCamera } from "./CctvCamera";
import { HOTSPOTS, HOTSPOT_ANCHORS, type HotspotKey } from "@/lib/camera-hotspots";
import { NetworkField } from "./NetworkField";
import { useIsMobile } from "@/hooks/use-mobile";

function Rig({
  progress,
  pointer,
}: {
  progress: React.RefObject<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const p = THREE.MathUtils.clamp(progress.current ?? 0, 0, 1);
    const pull = THREE.MathUtils.smoothstep(p, 0.34, 0.9);
    const pt = pointer.current ?? { x: 0, y: 0 };
    target.set(
      THREE.MathUtils.lerp(2.2, 0.4, pull) + pt.x * 0.4,
      THREE.MathUtils.lerp(1.2, 2.0, pull) - pt.y * 0.3,
      THREE.MathUtils.lerp(5.5, 9.4, pull),
    );
    const k = 1 - Math.exp(-3 * delta);
    camera.position.lerp(target, k);
    camera.lookAt(
      THREE.MathUtils.lerp(-0.85, 0, pull),
      THREE.MathUtils.lerp(0.35, -0.1, pull),
      0,
    );
  });
  return null;
}

function Hotspot({
  anchor,
  index,
  active,
  visible,
  onSelect,
}: {
  anchor: [number, number, number];
  index: string;
  active: boolean;
  visible: boolean;
  onSelect: () => void;
}) {
  return (
    <Html position={anchor} center zIndexRange={[20, 10]} style={{ pointerEvents: "auto" }}>
      <button
        type="button"
        onClick={onSelect}
        onPointerEnter={onSelect}
        aria-label={`Hotspot ${index}`}
        className={[
          "flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[0.6rem] tracking-tight transition-all duration-300",
          active
            ? "border-signal bg-signal/20 text-foreground"
            : "border-border-strong bg-background/60 text-muted-foreground hover:border-signal",
          visible ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      >
        {index}
      </button>
    </Html>
  );
}

function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -2.1, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#191d21" metalness={0.2} roughness={0.8} />
    </mesh>
  );
}

export function SceneStage({
  progress,
  active,
  setActive,
  hotspotsVisible,
}: {
  progress: React.RefObject<number>;
  active: HotspotKey;
  setActive: (k: HotspotKey) => void;
  hotspotsVisible: boolean;
}) {
  const isMobile = useIsMobile();
  const pointer = useRef({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    setReady(true);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      shadows={!isMobile}
      dpr={isMobile ? [1, 1.4] : [1, 2]}
      gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
      camera={{ position: [2.2, 1.2, 5.5], fov: 38 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.28;
      }}
    >
      <color attach="background" args={["#0d1013"]} />
      <fog attach="fog" args={["#0d1013", 12, 26]} />
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={3.0}
        castShadow={!isMobile}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-5, 2, -3]} intensity={1.1} color="#9dc4dc" />
      <spotLight position={[-3, 1.2, 6]} angle={0.7} penumbra={1} intensity={22} color="#cfe4f2" />

      <Suspense fallback={null}>
        <Environment resolution={128}>
          <Lightformer intensity={2.4} position={[0, 5, 2]} scale={[8, 8, 1]} />
          <Lightformer
            intensity={1.1}
            color="#a9cbdd"
            position={[-6, 1, -2]}
            rotation-y={Math.PI / 2}
            scale={[16, 3, 1]}
          />
          <Lightformer
            intensity={0.8}
            color="#ffffff"
            position={[6, 2, 1]}
            rotation-y={-Math.PI / 2}
            scale={[14, 2, 1]}
          />
        </Environment>
      </Suspense>

      {!isMobile && <Floor />}
      <NetworkField progress={progress} lowDetail={isMobile} />

      {/* The camera study sits right of centre so hero copy keeps the left column. */}
      <group position={[isMobile ? 0 : 0.4, isMobile ? 0 : 0.15, 0]}>
        <CctvCamera pointer={pointer} lowDetail={isMobile} />
        {ready &&
          hotspotsVisible &&
          HOTSPOTS.map((h) => (
            <Hotspot
              key={h.key}
              anchor={HOTSPOT_ANCHORS[h.key] as [number, number, number]}
              index={h.index}
              active={active === h.key}
              visible={hotspotsVisible}
              onSelect={() => setActive(h.key)}
            />
          ))}
      </group>

      <Rig progress={progress} pointer={pointer} />
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}

export default SceneStage;
