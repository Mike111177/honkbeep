import {
  ComponentPropsWithoutRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { animated, useSpring } from "@react-spring/web";

import HBDeckCard from "./DeckCard";
import {
  FloatAreaEventType,
  FloatAreaPath,
  FloatContext,
  useFloatArea,
} from "../../util/Floating";
import { CardSVG } from "../../Card";
import ArrayUtil from "../../../util/ArrayUtil";
import { useDrag } from "../../util/InputHandling";
import { vecAdd, vecInRectangle } from "../../../util/Vector";
import { GameEventType } from "../../../game/GameTypes";
import { GameState } from "../../../game/states/GameState";
import {
  BoardContext,
  useBoardReducer,
  useBoardState,
} from "../../BoardContext";
import { UserActionType } from "../../../client/types/UserAction";

import styles from "./CardFloat.module.css";

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
  const boardDispatch = useBoardReducer();
  const floatContext = useContext(FloatContext);

  const [
    cardInCurrentPlayerHand,
    cardOnTopOfStack,
    cardOnBottomOfStack,
    ...home
  ] = useBoardState((boardState) => {
    const home = getCardHome(index, boardState.viewTurn);
    const cardInCurrentPlayerHand =
      home[0] === "hands" &&
      home[1] ===
        (boardState.viewTurn.turn - 1) %
          boardState.definition.variant.numPlayers;
    let cardOnTopOfStack = false;
    let cardOnBottomOfStack = false;
    if (home[0] === "stacks") {
      const stack = boardState.viewTurn.stacks[home[1] as number];
      if (stack[stack.length - 1] === index) {
        cardOnTopOfStack = true;
      } else if (stack[stack.length - 2] !== index) {
        cardOnBottomOfStack = true;
      }
    }
    return [
      cardInCurrentPlayerHand,
      cardOnTopOfStack,
      cardOnBottomOfStack,
      ...home,
    ];
  });

  const [dragging, setDragging] = useState(false);
  const [dropPath, setDropPath] = useState<FloatAreaPath | null>(null);
  const [spring, springRef] = useSpring(
    { x: 0, y: 0, width: 0, height: 0 },
    []
  );
  const ref = useRef(null);
  const setSpring = useCallback((props) => springRef.current[0].start(props), [
    springRef,
  ]);

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
          return await boardDispatch({
            type: UserActionType.GameAttempt,
            attempt: {
              type: GameEventType.Play,
              card: index,
            },
          });
        case "discardPile":
          return await boardDispatch({
            type: UserActionType.GameAttempt,
            attempt: {
              type: GameEventType.Discard,
              card: index,
            },
          });
        default:
          return false;
      }
    },
    [boardDispatch, index]
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
          setDragging(false);
          if (dropPath === null) {
            setSpring({ ...homeRect, config: { friction: 25, tension: 750 } });
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

  //Detach listeners if not in current persons hand
  const attachedListeners = useMemo(() => {
    if (cardInCurrentPlayerHand) {
      return dragListeners;
    } else {
      return undefined;
    }
  }, [cardInCurrentPlayerHand, dragListeners]);

  //Set correct zIndex
  let zIndex = 0;
  if (dragging) {
    zIndex = 100;
  } else if (home[0] === "discard") {
    zIndex = home[1] as number;
  } else if (cardOnTopOfStack) {
    zIndex = 1;
  }

  const style = useMemo(() => ({ zIndex, ...spring }), [spring, zIndex]);

  if (home[0] === "deck" || cardOnBottomOfStack) {
    return <>{undefined}</>;
  }
  return (
    <animated.div
      className={styles.FloatingCard}
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
  const context = useContext(BoardContext);
  return (
    <div className={styles.CardFloatLayer}>
      {ArrayUtil.iota(context.boardState.deck.length).map((i) => (
        <FloatCard key={i} index={i} />
      ))}
    </div>
  );
}
