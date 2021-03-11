import { ComponentPropsWithoutRef, useContext, useEffect, useState } from "react";

import HBDeckCard from "./HBDeckCard";
import { FloatArea, FloatAreaEventType, FloatAreaPath, FloatContext, Rectangle } from "../util/Floating";
import { CardSVG } from "./CardUtil";
import { GameUIContext } from "../ReactFrontendInterface";
import ArrayUtil from "../../util/ArrayUtil";
import { animated, useSpring } from "react-spring/web.cjs";

//Helper to make card targets
type CardTargetProps = {
  areaPath: FloatAreaPath;
} & ComponentPropsWithoutRef<"svg">;
export function CardTarget({ areaPath, children, ...props }: CardTargetProps) {
  return (
    <FloatArea areaPath={areaPath}>
      <CardSVG {...props}>
        {children}
      </CardSVG>
    </FloatArea>
  );
}

function comparePaths(a: FloatAreaPath, b: FloatAreaPath) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

type FloatCardProps = {
  index: number;
}
export function FloatCard({ index }: FloatCardProps) {
  //Get contexts
  const gameContext = useContext(GameUIContext);
  const floatContext = useContext(FloatContext);

  const [home, setHome] = useState(() => gameContext.getCardHome(index));
  const [spring, setSpring] = useSpring<Rectangle>(() => (floatContext.getRect(home) ?? { x: 0, y: 0, width: 0, height: 0 }));

  useEffect(() => {
    setSpring(floatContext.getRect(home));
    return gameContext.subscribeToStateChange(() => {
      const newPath = gameContext.getCardHome(index);
      if (!comparePaths(home, newPath)) {
        setHome(newPath);
      }
    });
  }, [floatContext, gameContext, home, index, setSpring]);

  useEffect(() => floatContext.subscribeToArea(home, ({ type, area }) => {
    const immediate = type === FloatAreaEventType.Resize;
    setSpring({ immediate, ...area.getRect() });
  }), [home, floatContext, setSpring]);

  if (home[0] === "deck") return <>{undefined}</>;
  return (
    <animated.div style={{ position: "absolute", pointerEvents: "auto", ...spring }}>
      <HBDeckCard index={index} />
    </animated.div>
  );

}

//Create layer for all cards
export function CardFloatLayer() {
  const context = useContext(GameUIContext);
  return (
    <div className="CardFloatLayer" style={{ position: "absolute", overflow: "hidden", pointerEvents: "none", width: "100%", height: "100%" }}>
      {ArrayUtil.iota(context.getDeckSize()).map(i => <FloatCard key={i} index={i} />)}
    </div >
  );
}

