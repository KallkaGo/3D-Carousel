import { useTexture } from "@react-three/drei";
import { FC, useMemo } from "react";
import vertexShader from "@/three/components/shaders/art/vertex.glsl";
import fragmentShader from "@/three/components/shaders/art/fragment.glsl";
import {
  DoubleSide,
  MathUtils,
  SRGBColorSpace,
  Uniform,
  Vector2,
  Vector3,
} from "three";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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
  const { contextSafe } = useGSAP();
  const diffuseTex = useTexture(src);
  diffuseTex.colorSpace = SRGBColorSpace;
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

  const handlePointerAction = contextSafe((flag: boolean) => {
    gsap.killTweensOf(uniforms.uHoverState);
    if (flag) {
      gsap.to(uniforms.uHoverState, {
        value: 1,
        duration: 0.34,
        ease: "power1.inOut",
      });
    } else {
      gsap.to(uniforms.uHoverState, {
        value: 0,
        duration: 0.34,
        ease: "power1.inOut",
      });
    }
  });

  return (
    <mesh
      position={position}
      scale={meshScale}
      rotation-y={-MathUtils.degToRad(15)}
      rotation-z={MathUtils.degToRad(6)}
      onPointerEnter={() => handlePointerAction(true)}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => handlePointerAction(false)}
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
