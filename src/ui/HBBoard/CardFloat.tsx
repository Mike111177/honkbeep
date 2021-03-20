import {
  ComponentPropsWithoutRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import HBDeckCard from "./HBDeckCard";
import {
  FloatAreaEventType,
  FloatAreaPath,
  FloatContext,
  useFloatArea,
} from "../util/Floating";
import { CardSVG } from "./CardUtil";
import { GameUIContext } from "./ClientState";
import ArrayUtil from "../../util/ArrayUtil";
import { animated, useSpring } from "react-spring/web.cjs";
import { useDrag } from "../util/InputHandling";
import { vecAdd, vecInRectangle } from "../util/Vector";

import "./CardFloat.scss";
import { GameEventType } from "../../game/GameTypes";
import { GameState } from "../../game/states/GameState";

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

function getCardHome(index: number, game: GameState): FloatAreaPath {
  //Search hands
  for (let h = 0; h < game.hands.length; h++) {
    const hand = game.hands[h];
    for (let c = 0; c < hand.length; c++) {
      if (index === hand[c]) {
        return ["hands", h, c];
      }
    }
  }
  //Search Stacks
  for (let s = 0; s < game.stacks.length; s++) {
    const stack = game.stacks[s];
    for (let c = 0; c < stack.length; c++) {
      if (index === stack[c]) {
        return ["stacks", s];
      }
    }
  }
  //Search discard
  for (let c = 0; c < game.discardPile.length; c++) {
    if (index === game.discardPile[c]) {
      return ["discard", index];
    }
  }

  return ["deck"];
}

type FloatCardProps = {
  index: number;
};
//TODO: Generalize this code, a lot of elements from it would be nice to be able to use in other places
export function FloatCard({ index }: FloatCardProps) {
  //Get contexts
  const gameContext = useContext(GameUIContext);
  const floatContext = useContext(FloatContext);

  const viewTurn = gameContext.useViewTurn();
  const home = useMemo(() => getCardHome(index, viewTurn.game), [
    viewTurn.game,
    index,
  ]);

  const [dragging, setDragging] = useState(false);
  const [dropPath, setDropPath] = useState<FloatAreaPath | null>(null);
  const [spring, setSpring] = useSpring(
    () => floatContext.getRect(home) ?? { x: 0, y: 0, width: 0, height: 0 }
  );
  const ref = useRef(null);

  useEffect(() => {
    setSpring(floatContext.getRect(home));
  }, [floatContext, home, setSpring]);
  useEffect(
    () =>
      floatContext.subscribeToArea(home, ({ type, area }) => {
        const immediate = type === FloatAreaEventType.Resize;
        setSpring({ immediate, ...area.getRect() });
      }),
    [home, floatContext, setSpring]
  );

  const onDrop = useCallback(
    async (loc: string) => {
      switch (loc) {
        case "stackArea":
          return await gameContext.attemptPlayerAction({
            type: GameEventType.Play,
            card: index,
          });
        case "discardPile":
          return await gameContext.attemptPlayerAction({
            type: GameEventType.Discard,
            card: index,
          });
        default:
          return false;
      }
    },
    [gameContext, index]
  );

  const onDrag = useCallback(
    ({ down, offset, origin }) => {
      const homeRect = floatContext.getRect(home);
      if (homeRect !== undefined) {
        if (down) {
          const { x, y } = homeRect;
          const dragTarget = vecAdd({ x, y }, offset);
          setSpring({ ...dragTarget, immediate: true });
          setDragging(true);
          const dropZone = floatContext.dropZones.find((zone) =>
            vecInRectangle(vecAdd(origin, offset), zone.getRect()!)
          );
          if (dropZone !== undefined) {
            if (dropPath === null) {
              setDropPath(dropZone.path);
            }
          } else {
            if (dropPath !== null) {
              setDropPath(null);
            }
          }
        } else {
          //Relaxed parameters to make bounce back pretty
          if (dropPath === null) {
            setSpring({ ...homeRect, config: { friction: 25, tension: 750 } });
            setDragging(false);
          } else {
            onDrop(dropPath[0]).then((success) => {
              if (!success) {
                setSpring({
                  ...homeRect,
                  config: { friction: 25, tension: 750 },
                });
              }
            });
            setDropPath(null);
          }
        }
      }
    },
    [dropPath, floatContext, home, onDrop, setSpring]
  );

  const dragListeners = useDrag(ref, onDrag);

  //Detach listeners if not in hands
  const attachedListeners = useMemo(
    () => (home[0] === "hands" ? dragListeners : undefined),
    [dragListeners, home]
  );

  //Set correct zIndex
  let zIndex = 0;
  if (dragging) {
    zIndex = 100;
  } else if (home[0] === "discard") {
    zIndex = home[1] as number;
  }

  const style = useMemo(() => {
    //Workaround for typebug in react-spring https://github.com/pmndrs/react-spring/issues/1215
    //The project does seem like its been abandoned might have to switch it out for framer-motion
    //But i really dont want to because framer-motion would double the size of this bundle lol
    const useZIndex = (zIndex as unknown) as "auto";
    return { zIndex: useZIndex, ...spring };
  }, [spring, zIndex]);

  if (home[0] === "deck") {
    return <>{undefined}</>;
  }
  return (
    <animated.div
      className={`FloatingCard`}
      ref={ref}
      {...attachedListeners}
      style={style}
    >
      <HBDeckCard index={index} />
    </animated.div>
  );
}

//Create layer for all cards
export function CardFloatLayer() {
  const context = useContext(GameUIContext);
  return (
    <div className="CardFloatLayer">
      {ArrayUtil.iota(context.boardState.latestTurn.game.deck.length).map(
        (i) => (
          <FloatCard key={i} index={i} />
        )
      )}
    </div>
  );
}
