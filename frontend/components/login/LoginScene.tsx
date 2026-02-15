"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ParcelGridScene } from "./ParcelGridScene";

export function LoginScene() {
  const [ready, setReady] = useState(false);
  return (
    <div
      className="absolute inset-0 transition-opacity duration-300"
      style={{ opacity: ready ? 1 : 0 }}
    >
      <Canvas
        camera={{ position: [0, 5, 14], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        onCreated={() => setReady(true)}
      >
        <ParcelGridScene />
      </Canvas>
    </div>
  );
}
