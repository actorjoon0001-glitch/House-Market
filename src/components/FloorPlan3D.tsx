"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import type { FloorPlan } from "@/lib/types";

const ROOM_COLORS: Record<string, string> = {
  거실: "#FFE0CC",
  "주방/식당": "#FFD7B5",
  주방: "#FFD7B5",
  안방: "#CFE3FF",
  침실1: "#CFE3FF",
  침실2: "#CFE3FF",
  침실3: "#CFE3FF",
  욕실: "#BDE8DC",
  현관: "#E5E5E5",
};

const WALL_HEIGHT = 2.7;
const WALL_THICKNESS = 0.12;

type Props = {
  plan: FloorPlan;
  className?: string;
};

export default function FloorPlan3D({ plan, className }: Props) {
  // Center the plan around origin
  const cx = plan.width / 2;
  const cz = plan.depth / 2;

  return (
    <div className={className}>
      <Canvas
        camera={{
          position: [plan.width * 0.9, plan.depth * 1.1, plan.depth * 0.9],
          fov: 45,
        }}
        shadows
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[plan.width, plan.depth * 1.5, plan.depth]}
          intensity={1.0}
          castShadow
        />
        <Grid
          args={[plan.width * 3, plan.depth * 3]}
          cellSize={1}
          sectionSize={5}
          sectionColor="#cccccc"
          cellColor="#eeeeee"
          position={[0, -0.01, 0]}
          infiniteGrid={false}
        />

        <group position={[-cx, 0, -cz]}>
          {/* Floor slab */}
          <mesh position={[plan.width / 2, 0, plan.depth / 2]} receiveShadow>
            <boxGeometry args={[plan.width, 0.05, plan.depth]} />
            <meshStandardMaterial color="#f5f5f5" />
          </mesh>

          {/* Rooms (colored floor tiles) */}
          {plan.rooms.map((r) => (
            <mesh
              key={`floor-${r.id}`}
              position={[r.x + r.w / 2, 0.03, r.y + r.h / 2]}
              receiveShadow
            >
              <boxGeometry args={[r.w - 0.02, 0.02, r.h - 0.02]} />
              <meshStandardMaterial color={ROOM_COLORS[r.name] ?? "#fafafa"} />
            </mesh>
          ))}

          {/* Outer walls */}
          <Wall
            x={0}
            z={0}
            length={plan.width}
            rotationY={0}
            color="#bbbbbb"
          />
          <Wall
            x={0}
            z={plan.depth}
            length={plan.width}
            rotationY={0}
            color="#bbbbbb"
          />
          <Wall
            x={0}
            z={0}
            length={plan.depth}
            rotationY={Math.PI / 2}
            color="#bbbbbb"
          />
          <Wall
            x={plan.width}
            z={0}
            length={plan.depth}
            rotationY={Math.PI / 2}
            color="#bbbbbb"
          />

          {/* Inner walls per room */}
          {plan.rooms.map((r) => (
            <group key={`walls-${r.id}`}>
              <Wall x={r.x} z={r.y} length={r.w} rotationY={0} />
              <Wall x={r.x} z={r.y + r.h} length={r.w} rotationY={0} />
              <Wall x={r.x} z={r.y} length={r.h} rotationY={Math.PI / 2} />
              <Wall
                x={r.x + r.w}
                z={r.y}
                length={r.h}
                rotationY={Math.PI / 2}
              />
            </group>
          ))}
        </group>

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          maxPolarAngle={Math.PI / 2.05}
        />
      </Canvas>
    </div>
  );
}

function Wall({
  x,
  z,
  length,
  rotationY,
  color = "#dddddd",
}: {
  x: number;
  z: number;
  length: number;
  rotationY: number;
  color?: string;
}) {
  // Wall is centered along its length, position is the start corner.
  const dx = rotationY === 0 ? length / 2 : 0;
  const dz = rotationY === 0 ? 0 : length / 2;
  return (
    <mesh
      position={[x + dx, WALL_HEIGHT / 2, z + dz]}
      rotation={[0, rotationY, 0]}
      castShadow
    >
      <boxGeometry args={[length, WALL_HEIGHT, WALL_THICKNESS]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
