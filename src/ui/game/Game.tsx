import { PointerEvent, useEffect, useRef, useState } from "react";
import { useGameStore, useInteractStore, useLoadedStore } from "@utils/Store";
import { GameWrapper } from "./style";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import RES from "./RES";

let timer: NodeJS.Timeout;
const topMargin = 450;
const bottomMargin = 450;

const Game = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const aniDone = useRef(false);
  const baseParam = useRef({
    lastScrollTime: 0,
    lastScrollTop: 0,
    scrollSpeed: 0,
  });

  useGSAP(() => {
    gsap.set(gameRef.current, { opacity: 0 });
    gsap.to(gameRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        aniDone.current = true;
      },
    });
  });

  const handlePointerEvent = (e: PointerEvent, flag: boolean) => {
    console.log(e.type, flag);
    useInteractStore.setState({ touch: flag });
  };

  useEffect(() => {
    useLoadedStore.setState({ loaded: true });
    useInteractStore.setState({ controlDom: gameRef.current!});
  }, []);

  const handleScroll = () => {
    /* 计算scrollTop */
    const currentScrollTop = gameRef.current?.scrollTop || 0;
    useGameStore.setState({ scrollY: currentScrollTop });

    const currentTime = new Date().getTime();

    const { lastScrollTime, lastScrollTop } = baseParam.current;

    if (lastScrollTime) {
      const timeDiff = currentTime - lastScrollTime;
      const scrollDiff = currentScrollTop - lastScrollTop;
      useGameStore.setState({ scrollSpeed: Math.abs(scrollDiff / timeDiff) });
    }
    baseParam.current.lastScrollTop = currentScrollTop;
    baseParam.current.lastScrollTime = currentTime;
    clearTimeout(timer);
    timer = setTimeout(() => {
      useGameStore.setState({ scrollSpeed: 0 });
    }, 100);
  };

  return (
    <>
      <GameWrapper className="game" ref={gameRef} onScroll={handleScroll}>
        <div className="container">
          {RES.map((item, index) => {
            return (
              <div className="imgContainer" key={index}>
                <img src={item} alt="img" />
              </div>
            );
          })}
        </div>
      </GameWrapper>
    </>
  );
};

export default Game;
