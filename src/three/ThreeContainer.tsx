import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useInteractStore } from "@utils/Store";
import { Perf } from "r3f-perf";
import { Leva } from "leva";
import Sketch from "./components/Sketch/Sketch";
import { NoToneMapping, SRGBColorSpace } from "three";
export default function ThreeContainer() {
  const demand = useInteractStore((state) => state.demand);
  return (
    <>
      <Leva collapsed hidden={location.hash !== "#debug"} />
      <Canvas
        frameloop={demand ? "never" : "always"}
        className="webgl"
        dpr={[1, 2]}
        camera={{
          fov: 50,
          near: 0.1,
          position: [0, 0, 600],
          far: 1000,
        }}
        gl={{ toneMapping: NoToneMapping }}
      >
        {location.hash.includes("debug") && <Perf position="top-left" />}
        <Suspense fallback={null}>
          <Sketch />
        </Suspense>
      </Canvas>
    </>
  );
}
