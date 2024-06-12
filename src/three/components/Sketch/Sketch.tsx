import { useFrame, useThree } from "@react-three/fiber";
import { useGameStore, useInteractStore, useLoadedStore } from "@utils/Store";
import { useEffect, useMemo, useRef } from "react";
import { MathUtils, Mesh, PerspectiveCamera, Uniform, Vector3 } from "three";
import Art from "./cpns/Art";
import { useShallow } from "zustand/react/shallow";
import vertexShader from "@/three/components/shaders/sphere/vertex.glsl";
import fragmentShader from "@/three/components/shaders/sphere/fragment.glsl";

interface IBase {
  isDone: boolean;
  timer: NodeJS.Timeout | null;
}

const Sketch = () => {
  const { camera, event } = useThree(
    useShallow((state) => ({ camera: state.camera, event: state.events }))
  );
  const controlDom = useInteractStore((state) => state.controlDom);
  const { scrollY, scrollSpeed } = useGameStore(
    useShallow((state) => ({
      scrollY: state.scrollY,
      scrollSpeed: state.scrollSpeed,
    }))
  );
  const baseRef = useRef<IBase>({ isDone: true, timer: null });
  const sphereRef = useRef<Mesh>(null);
  const followPosition = useRef<Vector3>(new Vector3(0, 0, 0));
  const loaded = useLoadedStore((state) => state.loaded);
  const radiansToDegrees = (radians: number) => {
    return radians * (180 / Math.PI);
  };

  const handleMove = (event: MouseEvent) => {
    const vector = new Vector3(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
      0
    );
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    followPosition.current.copy(pos);

    baseRef.current.isDone = false;
    baseRef.current.timer && clearTimeout(baseRef.current.timer);
    baseRef.current.timer = setTimeout(() => {
      baseRef.current.isDone = true;
    }, 100);
  };
  const imgData = useMemo(() => {
    const imgList = [...document.querySelectorAll("img")];
    const arr = Array(imgList.length).fill(0);
    const data = imgList.map((img, index) => {
      const { width, height, top, left } = img.getBoundingClientRect();
      const x = left + width / 2 - window.innerWidth / 2;
      const y = -(top + height / 2 - window.innerHeight / 2);
      /* 计算滚动到第几项了 */
      const h = img.height;
      const d1 = Math.min(Math.abs(scrollY - index * (h + 100)) / h, 1);
      const d2 = 1 - d1 ** 2;
      arr[index] = d2;
      const active = arr.findIndex((item) => item === Math.max(...arr));
      return { width, height, position: [x, y, 0], url: img.src, center: d2 };
    });
    return data;
  }, [loaded, scrollY]);

  const uniforms = useMemo(
    () => ({
      uOpacity: new Uniform(0),
    }),
    []
  );

  useEffect(() => {
    const fov = radiansToDegrees(
      2 * Math.atan(window.innerHeight / 2 / camera.position.z)
    );
    (camera as PerspectiveCamera).fov = fov;
    console.log("fov", fov);
    camera.updateProjectionMatrix();
    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  useEffect(() => {
    loaded && useLoadedStore.setState({ ready: true });
  }, [loaded]);

  useEffect(() => {
    console.log(event);
    event.connect!(controlDom);
  }, [controlDom]);

  useFrame((state, delta) => {
    delta %= 1;
    if (sphereRef.current) {
      sphereRef.current.position.lerp(followPosition.current, delta * 12);
      sphereRef.current.rotation.z += delta * 5;
      if (baseRef.current.isDone) {
        uniforms.uOpacity.value = MathUtils.lerp(
          uniforms.uOpacity.value,
          0,
          delta * 3
        );
      } else {
        uniforms.uOpacity.value = MathUtils.lerp(
          uniforms.uOpacity.value,
          1,
          delta * 3
        );
      }
    }
  });

  return (
    <>
      {/* <OrbitControls domElement={controlDom} /> */}
      <color attach={"background"} args={["black"]} />
      <group position={[0, 0, -150]}>
        {imgData.map((item, index) => {
          return (
            <Art
              key={index}
              position={item.position as [number, number, number]}
              width={item.width}
              height={item.height}
              src={item.url}
              center={item.center}
            />
          );
        })}
      </group>

      <mesh ref={sphereRef} scale={[80, 80, 1]}>
        <planeGeometry args={[1, 1, 32, 32]}></planeGeometry>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        ></shaderMaterial>
      </mesh>
    </>
  );
};

export default Sketch;
