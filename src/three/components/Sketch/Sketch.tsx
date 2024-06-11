import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useGameStore, useInteractStore, useLoadedStore } from "@utils/Store";
import { useEffect, useMemo, useRef, useState } from "react";
import { MathUtils, PerspectiveCamera } from "three";
import Art from "./cpns/Art";
import { useShallow } from "zustand/react/shallow";

const Sketch = () => {
  const [active, setActive] = useState(1);
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
    (camera as PerspectiveCamera).fov = fov;
    camera.updateProjectionMatrix();
  }, []);

  useEffect(() => {
    loaded && useLoadedStore.setState({ ready: true });
  }, [loaded]);

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
            center={item.center}
          />
        );
      })}
    </>
  );
};

export default Sketch;
