import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Node = { p: THREE.Vector3; kind: number };

/**
 * Narrative second act: the camera dissolves into the network it lives on —
 * edge devices, aggregation switches, and the recording/analytics core.
 */
export function NetworkField({
  progress,
  lowDetail = false,
}: {
  progress: React.RefObject<number>;
  lowDetail?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const pulseRef = useRef<THREE.Points>(null);

  const { nodes, linePositions, pulsePath } = useMemo(() => {
    const count = lowDetail ? 14 : 26;
    const nodes: Node[] = [];
    const rows = 3;
    for (let i = 0; i < count; i++) {
      const row = i % rows;
      const t = Math.floor(i / rows);
      nodes.push({
        p: new THREE.Vector3(
          -5.4 + t * (10.8 / Math.ceil(count / rows)) + (row % 2) * 0.5,
          -1.6 + row * 1.6 + Math.sin(i * 1.7) * 0.22,
          -1.2 + Math.cos(i * 2.3) * 1.1,
        ),
        kind: i % 5 === 0 ? 1 : 0,
      });
    }
    const core = new THREE.Vector3(0, 0.1, 0.4);
    const segs: number[] = [];
    const path: number[] = [];
    nodes.forEach((n, i) => {
      segs.push(n.p.x, n.p.y, n.p.z, core.x, core.y, core.z);
      if (i + rows < nodes.length) {
        const q = nodes[i + rows]!.p;
        segs.push(n.p.x, n.p.y, n.p.z, q.x, q.y, q.z);
      }
      path.push(n.p.x, n.p.y, n.p.z);
    });
    return {
      nodes,
      linePositions: new Float32Array(segs),
      pulsePath: new Float32Array(path),
    };
  }, [lowDetail]);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const p = progress.current ?? 0;
    const reveal = THREE.MathUtils.clamp((p - 0.42) / 0.4, 0, 1);
    if (group.current) {
      group.current.visible = reveal > 0.001;
      group.current.position.y = (1 - reveal) * -1.4;
      group.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.08) * 0.06 + (1 - reveal) * 0.25;
    }
    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity += (reveal * 0.42 - mat.opacity) * (1 - Math.exp(-6 * delta));
    }
    if (pulseRef.current) {
      const mat = pulseRef.current.material as THREE.PointsMaterial;
      mat.opacity = reveal;
      mat.size = 0.09 + Math.sin(state.clock.elapsedTime * 2) * 0.015;
    }
  });

  return (
    <group ref={group} visible={false}>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            count={linePositions.length / 3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#7fb6d6" transparent opacity={0} />
      </lineSegments>

      <points ref={pulseRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pulsePath, 3]}
            count={pulsePath.length / 3}
          />
        </bufferGeometry>
        <pointsMaterial color="#bfe0f0" size={0.09} transparent opacity={0} sizeAttenuation />
      </points>

      {nodes.map((n, i) => (
        <mesh key={i} position={n.p}>
          {n.kind === 1 ? (
            <boxGeometry args={[0.34, 0.1, 0.24]} />
          ) : (
            <boxGeometry args={[0.16, 0.16, 0.16]} />
          )}
          <meshStandardMaterial color="#39424a" metalness={0.85} roughness={0.4} />
        </mesh>
      ))}

      {/* recording / analytics core */}
      <mesh position={[0, 0.1, 0.4]}>
        <boxGeometry args={[0.9, 0.5, 0.6]} />
        <meshStandardMaterial color="#4a545c" metalness={0.9} roughness={0.32} />
      </mesh>
    </group>
  );
}
