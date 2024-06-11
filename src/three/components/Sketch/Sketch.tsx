import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useGameStore, useInteractStore, useLoadedStore } from "@utils/Store";
import { useEffect, useMemo, useRef } from "react";
import { MathUtils, PerspectiveCamera } from "three";
import Art from "./cpns/Art";
import { useShallow } from "zustand/react/shallow";

const Sketch = () => {
  const camera = useThree((state) => state.camera);
  const controlDom = useInteractStore((state) => state.controlDom);
  const { scrollY, scrollSpeed } = useGameStore(
    useShallow((state) => ({
      scrollY: state.scrollY,
      scrollSpeed: state.scrollSpeed,
    }))
  );
  const loaded = useLoadedStore((state) => state.loaded);
  const radiansToDegrees = (radians: number) => {
    return radians * (180 / Math.PI);
  };

  useEffect(() => {
    const fov = radiansToDegrees(
      2 * Math.atan(window.innerHeight / 2 / camera.position.z)
    );
    console.log("fov", window.innerHeight, camera.position.z, fov);
    (camera as PerspectiveCamera).fov = fov;
    camera.updateProjectionMatrix();
  }, []);

  useEffect(() => {
    loaded && useLoadedStore.setState({ ready: true });
  }, [loaded]);

  const imgData = useMemo(() => {
    const imgList = [...document.querySelectorAll("img")];
    const data = imgList.map((img) => {
      const { width, height, top, left } = img.getBoundingClientRect();
      const x = left + width / 2 - window.innerWidth / 2;
      const y = -(top + height / 2 - window.innerHeight / 2);
      console.log(width, height);
      return { width, height, position: [x, y, 0], url: img.src };
    });

    return data;
  }, [loaded, scrollY]);

  return (
    <>
      <OrbitControls domElement={controlDom} />
      <color attach={"background"} args={["black"]} />
      {imgData.map((item, index) => {
        return (
          <Art
            key={index}
            position={item.position as [number, number, number]}
            width={item.width}
            height={item.height}
            src={item.url}
          />
        );
      })}
    </>
  );
};

export default Sketch;
