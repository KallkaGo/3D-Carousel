import { useTexture } from "@react-three/drei";
import { FC, useMemo } from "react";
import vertexShader from "@/three/components/shaders/vertex.glsl";
import fragmentShader from "@/three/components/shaders/fragment.glsl";
import { DoubleSide, MathUtils, Uniform } from "three";
import { useFrame } from "@react-three/fiber";

interface IProp {
  position: [number, number, number];
  width: number;
  height: number;
  src: string;
}

const Art: FC<IProp> = ({
  position = [0, 0, 0],
  width = 800,
  height = 450,
  src,
}) => {
  const diffuseTex = useTexture(src);
  const uniforms = useMemo(
    () => ({
      uDiffuse: new Uniform(diffuseTex),
      uTime: new Uniform(0),
      uDisCenter: new Uniform(0),
    }),
    []
  );

  useFrame((state, delta) => {
    uniforms.uTime.value += delta;
  });

  return (
    <mesh
      position={position}
      scale={[width, height, 1]}
      rotation-y={-MathUtils.degToRad(30)}
      rotation-z={MathUtils.degToRad(6)}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        side={DoubleSide}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      ></shaderMaterial>
    </mesh>
  );
};

export default Art;
