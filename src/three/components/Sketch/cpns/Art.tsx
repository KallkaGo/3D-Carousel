import { useTexture } from "@react-three/drei";
import { FC, useMemo } from "react";
import vertexShader from "@/three/components/shaders/vertex.glsl";
import fragmentShader from "@/three/components/shaders/fragment.glsl";
import { DoubleSide, MathUtils, Uniform, Vector2, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useInteractStore } from "@utils/Store";

interface IProp {
  position: [number, number, number];
  width: number;
  height: number;
  src: string;
  center: number;
}

const Art: FC<IProp> = ({
  position = [0, 0, 0],
  width = 800,
  height = 450,
  src,
  center = 0,
}) => {
  const diffuseTex = useTexture(src);
  const uniforms = useMemo(
    () => ({
      uDiffuse: new Uniform(diffuseTex),
      uTime: new Uniform(0),
      uDisCenter: new Uniform(center),
      uHoverUv: new Uniform(new Vector2(0, 0)),
      uHoverState: new Uniform(0),
    }),
    []
  );

  useFrame((state, delta) => {
    uniforms.uTime.value += delta;
    uniforms.uDisCenter.value = center;
  });

  const handlePointerMove = (e: any) => {
    uniforms.uHoverUv.value = e.uv;
  };

  const meshScale = useMemo(() => {
    const w = width * (1 + 0.2 * center);
    const h = height * (1 + 0.2 * center);
    return new Vector3(w, h, 1);
  }, [center]);

  return (
    <mesh
      position={position}
      scale={meshScale}
      rotation-y={-MathUtils.degToRad(15)}
      rotation-z={MathUtils.degToRad(6)}
      onPointerEnter={(e) => {
        console.log("进入了", e);
        uniforms.uHoverState.value = 1;
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={(e) => {
        console.log("离开了", e);
        uniforms.uHoverState.value = 0;
      }}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        side={DoubleSide}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      ></shaderMaterial>
    </mesh>
  );
};

export default Art;
