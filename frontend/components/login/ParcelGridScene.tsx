"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

const GRID_SIZE = 15;
const SPACING = 1.12;
const ROAD_INTERVAL = 4; // roads every N cells (creates blocks of 3x3)

// Village-style building heights: mostly 1–2 storeys, a few taller
const BUILDING_HEIGHTS = [0.45, 0.5, 0.55, 0.6, 0.65, 0.5, 0.55, 0.7, 0.6, 0.5];
const LANDMARK_HEIGHT = 0.85; // slightly taller for block "center" buildings

const COLORS = [
  "#2d5a4a",
  "#3d6b5c",
  "#1e4d6b",
  "#4a7c59",
  "#03045e",
  "#2c5f4f",
  "#356b7c",
  "#3e6d52",
  "#284d5c",
];

const EMPTY_LOT_COLOR = "#9a8f6e";
const LAND_COLOR = "#6b7d5c";
const ROAD_COLOR = "#4a4845";
const PARK_COLOR = "#5a7d5a";

type CellType = "road" | "building" | "open" | "empty";

function getCellType(i: number, j: number): CellType {
  const isRoad = i % ROAD_INTERVAL === 0 || j % ROAD_INTERVAL === 0;
  if (isRoad) return "road";

  // Town square / plaza: center 3x3 block
  const center = (GRID_SIZE - 1) / 2;
  const inCenter =
    i >= center - 1 && i <= center + 1 && j >= center - 1 && j <= center + 1;
  if (inCenter) return "open";

  // Small park blocks (2x2) in two corners
  const inPark1 = i >= 1 && i <= 2 && j >= 1 && j <= 2;
  const inPark2 =
    i >= GRID_SIZE - 3 &&
    i <= GRID_SIZE - 2 &&
    j >= GRID_SIZE - 3 &&
    j <= GRID_SIZE - 2;
  if (inPark1 || inPark2) return "open";

  // Occasional vacant lot (empty) among buildings
  const isEmpty = (i * 7 + j * 11) % 17 === 0;
  if (isEmpty) return "empty";

  return "building";
}

function isBlockCenter(i: number, j: number): boolean {
  const lo = (n: number) =>
    Math.floor(n / ROAD_INTERVAL) * ROAD_INTERVAL + 1;
  const hi = (n: number) => lo(n) + ROAD_INTERVAL - 2;
  const inBlockI = i >= lo(i) && i <= hi(i);
  const inBlockJ = j >= lo(j) && j <= hi(j);
  const midI = (lo(i) + hi(i)) / 2;
  const midJ = (lo(j) + hi(j)) / 2;
  return (
    inBlockI &&
    inBlockJ &&
    Math.abs(i - midI) <= 0.5 &&
    Math.abs(j - midJ) <= 0.5
  );
}

function ParcelBlock({
  x,
  z,
  height,
  color,
  index,
  reduceMotion,
}: {
  x: number;
  z: number;
  height: number;
  color: string;
  index: number;
  reduceMotion: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    if (reduceMotion) {
      mesh.current.position.y = height / 2;
    } else {
      const t = state.clock.elapsedTime + index * 0.1;
      mesh.current.position.y = height / 2 + Math.sin(t * 0.4) * 0.02;
    }
  });
  return (
    <RoundedBox
      ref={mesh}
      args={[0.92, height, 0.92]}
      radius={0.06}
      smoothness={4}
      position={[x, height / 2, z]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        roughness={0.65}
        metalness={0.08}
        flatShading={false}
      />
    </RoundedBox>
  );
}

function EmptyLot({ x, z }: { x: number; z: number }) {
  return (
    <RoundedBox
      args={[0.92, 0.06, 0.92]}
      radius={0.04}
      smoothness={4}
      position={[x, 0.03, z]}
      receiveShadow
    >
      <meshStandardMaterial
        color={EMPTY_LOT_COLOR}
        roughness={0.85}
        metalness={0.02}
      />
    </RoundedBox>
  );
}

function RoadCell({ x, z }: { x: number; z: number }) {
  return (
    <RoundedBox
      args={[0.95, 0.04, 0.95]}
      radius={0.03}
      smoothness={2}
      position={[x, 0.02, z]}
      receiveShadow
    >
      <meshStandardMaterial
        color={ROAD_COLOR}
        roughness={0.95}
        metalness={0}
      />
    </RoundedBox>
  );
}

function ParkCell({ x, z }: { x: number; z: number }) {
  return (
    <RoundedBox
      args={[0.92, 0.04, 0.92]}
      radius={0.04}
      smoothness={4}
      position={[x, 0.02, z]}
      receiveShadow
    >
      <meshStandardMaterial
        color={PARK_COLOR}
        roughness={0.9}
        metalness={0}
      />
    </RoundedBox>
  );
}

function LandLayer() {
  const size = GRID_SIZE * SPACING + 4;
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.02, 0]}
      receiveShadow
    >
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial
        color={LAND_COLOR}
        roughness={0.9}
        metalness={0}
      />
    </mesh>
  );
}

function GridGroup({ reduceMotion }: { reduceMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    if (!reduceMotion) {
      group.current.rotation.y = state.clock.elapsedTime * 0.001;
    }
  });
  const half = (GRID_SIZE * SPACING) / 2;
  const cells: {
    i: number;
    j: number;
    x: number;
    z: number;
    type: CellType;
    height: number;
    color: string;
    index: number;
  }[] = [];
  let index = 0;
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const x = i * SPACING - half + SPACING / 2;
      const z = j * SPACING - half + SPACING / 2;
      const type = getCellType(i, j);
      const height =
        type === "building"
          ? isBlockCenter(i, j)
            ? LANDMARK_HEIGHT
            : BUILDING_HEIGHTS[(i * 3 + j * 7) % BUILDING_HEIGHTS.length]
          : 0;
      const color = COLORS[(i + j * 2) % COLORS.length];
      cells.push({ i, j, x, z, type, height, color, index: index++ });
    }
  }
  return (
    <group ref={group}>
      {cells.map(({ i, j, x, z, type, height, color, index }) => {
        const key = `${i}-${j}`;
        if (type === "road") return <RoadCell key={key} x={x} z={z} />;
        if (type === "open") return <ParkCell key={key} x={x} z={z} />;
        if (type === "empty") return <EmptyLot key={key} x={x} z={z} />;
        return (
          <ParcelBlock
            key={key}
            x={x}
            z={z}
            height={height}
            color={color}
            index={index}
            reduceMotion={reduceMotion}
          />
        );
      })}
    </group>
  );
}

// Soft white with very subtle primary tint (#03045e) for on-brand feel
const SCENE_BACKGROUND = "#edf1f2";

function usePrefersReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(true);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(m.matches);
    const fn = () => setReduceMotion(m.matches);
    m.addEventListener("change", fn);
    return () => m.removeEventListener("change", fn);
  }, []);
  return reduceMotion;
}

export function ParcelGridScene() {
  const reduceMotion = usePrefersReducedMotion();
  return (
    <>
      <color attach="background" args={[SCENE_BACKGROUND]} />
      <fog attach="fog" args={[SCENE_BACKGROUND, 12, 28]} />
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[8, 14, 6]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0003}
      />
      <directionalLight position={[-5, 8, -5]} intensity={0.35} />
      <pointLight position={[0, 10, 0]} intensity={0.4} color="#e8f0e8" />
      <LandLayer />
      <GridGroup reduceMotion={reduceMotion} />
    </>
  );
}
