import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import * as THREE from "three";

const NAVY_COVER = "#0b2450";
const BLUE = "#3d8bff";
const GOLD = "#e7bd72";
const PEARL = "#f2f5fa";

const clampDelta = (delta: number) => Math.min(delta, 0.05);

/**
 * Shared pointer position (normalized -1..1) tracked on window, because the
 * text content overlays the canvas and would block canvas pointer events.
 */
function useWindowPointer() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pointer;
}

/** Slowly rising, additive-blended knowledge particles. */
function Particles({ count = 200, reduced }: { count?: number; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.2 + Math.random() * 4.2;
      const theta = Math.random() * Math.PI * 2;
      arr[i * 3] = Math.cos(theta) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = Math.sin(theta) * r * 0.65 - 1.2;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (reduced || !ref.current) return;
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const dt = clampDelta(delta);
    for (let i = 0; i < count; i++) {
      let y = attr.getY(i) + dt * (0.05 + ((i % 6) / 6) * 0.09);
      if (y > 3.4) y = -3.4;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={BLUE}
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Faint constellation of knowledge nodes linked by luminous lines. */
function Constellation({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { linePositions, nodePositions } = useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < 15; i++) {
      const r = 3 + Math.random() * 3.6;
      const theta = (i / 15) * Math.PI * 2 + Math.random() * 0.8;
      nodes.push(
        new THREE.Vector3(
          Math.cos(theta) * r,
          (Math.random() - 0.4) * 4.6,
          Math.sin(theta) * r * 0.7 - 1.6,
        ),
      );
    }
    const linePts: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 3) {
          linePts.push(
            nodes[i].x, nodes[i].y, nodes[i].z,
            nodes[j].x, nodes[j].y, nodes[j].z,
          );
        }
      }
    }
    return {
      linePositions: new Float32Array(linePts),
      nodePositions: new Float32Array(nodes.flatMap((n) => [n.x, n.y, n.z])),
    };
  }, []);

  useFrame((_, delta) => {
    if (reduced || !group.current) return;
    group.current.rotation.y += clampDelta(delta) * 0.03;
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={BLUE} transparent opacity={0.16} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color={GOLD}
          transparent
          opacity={0.75}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

/** A partially open hardcover book — the hero's focal point. */
function Book({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    if (!reduced) {
      group.current.rotation.z = Math.sin(t * 0.35) * 0.045;
      group.current.position.y = Math.sin(t * 0.6) * 0.1;
      // Gentle perspective shift as the visitor scrolls away from the hero.
      const scroll = Math.min(window.scrollY / window.innerHeight, 1);
      group.current.rotation.x = 0.9 + scroll * 0.35;
      group.current.position.y += scroll * 0.9;
    }
  });

  const coverMaterial = (
    <meshStandardMaterial color={NAVY_COVER} roughness={0.32} metalness={0.18} />
  );
  const pageMaterial = <meshStandardMaterial color={PEARL} roughness={0.88} />;

  return (
    <group ref={group} rotation={[0.9, -0.38, 0.05]}>
      {/* Left half of the open book */}
      <group rotation={[0, 0, 0.16]}>
        <mesh position={[-0.74, -0.02, 0]}>
          <boxGeometry args={[1.56, 0.06, 2.8]} />
          {coverMaterial}
        </mesh>
        <mesh position={[-0.7, 0.09, 0]}>
          <boxGeometry args={[1.44, 0.18, 2.6]} />
          {pageMaterial}
        </mesh>
        {/* Fanned pages */}
        <mesh position={[-0.68, 0.19, 0]} rotation={[0, 0, 0.015]}>
          <boxGeometry args={[1.36, 0.02, 2.5]} />
          {pageMaterial}
        </mesh>
        <mesh position={[-0.66, 0.21, -0.1]} rotation={[0, 0, 0.05]}>
          <boxGeometry args={[1.3, 0.02, 2.3]} />
          {pageMaterial}
        </mesh>
        {/* Gold-gilt fore-edge */}
        <mesh position={[-0.7, 0.09, 1.31]}>
          <boxGeometry args={[1.44, 0.19, 0.02]} />
          <meshStandardMaterial color={GOLD} roughness={0.3} metalness={0.6} />
        </mesh>
      </group>

      {/* Right half, opened a touch wider */}
      <group rotation={[0, 0, -0.28]}>
        <mesh position={[0.74, -0.02, 0]}>
          <boxGeometry args={[1.56, 0.06, 2.8]} />
          {coverMaterial}
        </mesh>
        <mesh position={[0.7, 0.09, 0]}>
          <boxGeometry args={[1.44, 0.18, 2.6]} />
          {pageMaterial}
        </mesh>
        <mesh position={[0.68, 0.19, 0]} rotation={[0, 0, -0.02]}>
          <boxGeometry args={[1.36, 0.02, 2.5]} />
          {pageMaterial}
        </mesh>
        <mesh position={[0.66, 0.21, 0.12]} rotation={[0, 0, -0.06]}>
          <boxGeometry args={[1.3, 0.02, 2.3]} />
          {pageMaterial}
        </mesh>
        <mesh position={[0.7, 0.09, 1.31]}>
          <boxGeometry args={[1.44, 0.19, 0.02]} />
          <meshStandardMaterial color={GOLD} roughness={0.3} metalness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

/** Two loose pages drifting around the book. */
function LoosePages({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (reduced || !group.current) return;
    const t = clock.elapsedTime;
    group.current.rotation.y = t * 0.12;
    group.current.position.y = Math.sin(t * 0.5) * 0.3;
  });
  return (
    <group ref={group}>
      <mesh position={[2.6, 1.4, -0.6]} rotation={[0.4, 0.3, -0.4]}>
        <planeGeometry args={[0.8, 1.05]} />
        <meshStandardMaterial color={PEARL} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-2.9, 0.6, -1]} rotation={[-0.3, -0.4, 0.5]}>
        <planeGeometry args={[0.7, 0.95]} />
        <meshStandardMaterial color={PEARL} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/** Small floating educational objects for layered depth. */
function FloatingShapes({ reduced }: { reduced: boolean }) {
  const shapes = (
    <>
      <mesh>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color={GOLD} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh rotation={[0.6, 0.2, 0]}>
        <torusGeometry args={[0.26, 0.09, 12, 32]} />
        <meshStandardMaterial color={BLUE} roughness={0.35} metalness={0.3} />
      </mesh>
      <mesh rotation={[0.2, 0.5, 0.1]}>
        <boxGeometry args={[0.52, 0.12, 0.72]} />
        <meshStandardMaterial color={NAVY_COVER} roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color={BLUE} roughness={0.4} metalness={0.3} />
      </mesh>
    </>
  );

  const placements: Array<[number, number, number]> = [
    [-3.4, 1.8, -1.2],
    [3.6, 2.4, -2],
    [3.1, -1.9, -0.6],
    [-3, -2, -2],
  ];

  if (reduced) {
    return (
      <>
        {placements.map((p, i) => (
          <group key={i} position={p} rotation={[0.3 * i, 0.4 * i, 0]}>
            {shapes}
          </group>
        ))}
      </>
    );
  }
  return (
    <>
      {placements.map((p, i) => (
        <Float
          key={i}
          position={p}
          speed={1.1 + i * 0.2}
          rotationIntensity={0.7}
          floatIntensity={1.1}
        >
          {shapes}
        </Float>
      ))}
    </>
  );
}

/** Positions the book responsively and applies gentle pointer parallax. */
function BookRig({ reduced, children }: { reduced: boolean; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const pointer = useWindowPointer();
  const { size } = useThree();
  const wide = size.width >= 1024;

  useFrame((_, delta) => {
    if (!ref.current) return;
    const dt = clampDelta(delta);
    ref.current.position.x = wide ? 2 : 0.4;
    ref.current.position.y = wide ? 0.1 : -1.15;
    ref.current.scale.setScalar(wide ? 1 : 0.72);
    if (!reduced) {
      const tx = pointer.current.x * 0.14;
      const ty = pointer.current.y * 0.1;
      ref.current.rotation.y += (tx - ref.current.rotation.y) * Math.min(1, dt * 2.5);
      ref.current.rotation.x += (0.06 + ty - ref.current.rotation.x) * Math.min(1, dt * 2.5);
    }
  });

  return <group ref={ref}>{children}</group>;
}

export default function HeroScene({ reduced }: { reduced: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 7], fov: 42 }}
      dpr={[1, 1.75]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={(state) => {
        const wrapper = state.gl.domElement.closest("[data-scene-wrapper]");
        wrapper?.setAttribute("data-scene-ready", "true");
      }}
    >
      <fog attach="fog" args={["#071426", 9.5, 20]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[-4, 6, 4]} intensity={1.15} color="#e6edff" />
      <pointLight position={[2.5, -0.5, 2.5]} intensity={16} color={GOLD} distance={9} />
      <pointLight position={[-3.5, 2, 2]} intensity={26} color={BLUE} distance={13} />

      <BookRig reduced={reduced}>
        <Book reduced={reduced} />
        <LoosePages reduced={reduced} />
      </BookRig>
      <Particles reduced={reduced} />
      <Constellation reduced={reduced} />
      <FloatingShapes reduced={reduced} />

      <Environment resolution={256}>
        <Lightformer intensity={1.8} position={[0, 5, 0]} scale={[10, 10, 1]} rotation-x={Math.PI / 2} />
        <Lightformer intensity={1.1} color="#8bb4ff" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 2, 1]} />
        <Lightformer intensity={0.7} color="#e7bd72" position={[5, 0, 2]} rotation-y={-Math.PI / 2} scale={[10, 1, 1]} />
      </Environment>
    </Canvas>
  );
}
