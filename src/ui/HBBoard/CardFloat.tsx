import { ComponentPropsWithoutRef, useContext, useEffect, useRef, useState } from "react";

import HBDeckCard from "./HBDeckCard";
import { FloatArea, FloatAreaEventType, FloatAreaPath, FloatContext, Rectangle, useFloatArea } from "../util/Floating";
import { CardSVG } from "./CardUtil";
import { GameUIContext } from "../ReactFrontendInterface";
import ArrayUtil from "../../util/ArrayUtil";
import { animated, useSpring } from "react-spring/web.cjs";
import { useDrag } from "../util/InputHandling";
import { vecAdd } from "../util/Vector";

//Helper to make card targets
type CardTargetProps = {
  areaPath: FloatAreaPath;
} & ComponentPropsWithoutRef<"svg">;
export function CardTarget({ areaPath, children, ...props }: CardTargetProps) {
  return (
    <CardSVG ref={useFloatArea(areaPath)} {...props}>
      {children}
    </CardSVG>
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
  const ref = useRef(null);

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

  const attach = useDrag(ref, ({ down, offset }) => {
    const homeRect = floatContext.getRect(home);
    if (homeRect !== undefined) {
      if (down) {
        const { x, y } = homeRect;
        const dragTarget = vecAdd({ x, y }, offset);
        setSpring({ ...dragTarget, immediate:true});
      } else {
        //Relaxed parameters to make bounce back pretty
        setSpring({ ...homeRect, config: { friction: 25, tension: 750 } });
      }
    }
  });

  if (home[0] === "deck") return <>{undefined}</>;
  return (
    <animated.div ref={ref} {...attach} style={{ position: "absolute", pointerEvents: "auto", ...spring }}>
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

