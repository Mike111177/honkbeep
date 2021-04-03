import {
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
} from "../../util/Floating";
import { useDrag } from "../../util/InputHandling";
import { Rectangle, vecAdd, vecInRectangle } from "../../../util/Vector";
import { GameEventType } from "../../../game/types/GameEvent";
import { GameState } from "../../../game/states/GameState";
import { useBoardReducer, useBoardState } from "../../BoardContext";
import { UserActionType } from "../../../client/types/UserAction";

import styles from "./AnimatedDeck.module.css";
import ArrayUtil from "../../../util/ArrayUtil";

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

function compareRects(a: Rectangle, b: Rectangle) {
  return (
    a.height === b.height && a.width === b.width && a.x === b.x && a.y === b.y
  );
}

type FloatCardProps = {
  index: number;
};
//TODO: Generalize this code, a lot of elements from it would be nice to be able to use in other places
export default function FloatingCard({ index }: FloatCardProps) {
  //Get contexts
  const boardDispatch = useBoardReducer();
  const floatContext = useContext(FloatContext);

  const [
    draggable,
    cardOnTopOfStack,
    cardOnBottomOfStack,
    ...home
  ] = useBoardState((s) => {
    const home = getCardHome(index, s.viewTurn);
    const cardInCurrentPlayerHand =
      home[0] === "hands" &&
      home[1] === (s.viewTurn.turn - 1) % s.definition.variant.numPlayers;
    let cardOnTopOfStack = false;
    let cardOnBottomOfStack = false;
    if (home[0] === "stacks") {
      const stack = s.viewTurn.stacks[home[1] as number];
      if (stack[stack.length - 1] === index) {
        cardOnTopOfStack = true;
      } else if (stack[stack.length - 2] !== index) {
        cardOnBottomOfStack = true;
      }
    }
    return [
      cardInCurrentPlayerHand && !s.paused,
      cardOnTopOfStack,
      cardOnBottomOfStack,
      ...home,
    ];
  }, ArrayUtil.shallowCompare);
  const visible = !(home[0] === "deck" || cardOnBottomOfStack);

  const [dragging, setDragging] = useState(false);
  const [dropPath, setDropPath] = useState<FloatAreaPath | null>(null);
  const [spring, sprRef] = useSpring({ x: 0, y: 0, width: 0, height: 0 }, []);
  const setHomeRect = useCallback(
    function setHomeRect(p) {
      if (
        !compareRects(
          {
            height: spring.height.goal,
            width: spring.width.goal,
            x: spring.x.goal,
            y: spring.y.goal,
          },
          p
        )
      ) {
        return sprRef.current[0].start(p);
      }
    },
    [
      sprRef,
      spring.height.goal,
      spring.width.goal,
      spring.x.goal,
      spring.y.goal,
    ]
  );
  const ref = useRef(null);

  useEffect(() => {
    setHomeRect(floatContext.getRect(home));
    return floatContext.subscribeToArea(home, ({ type, area }) => {
      if (visible) {
        //No need to animate if we aren't visible
        const immediate = type === FloatAreaEventType.Resize;
        setHomeRect({ immediate, ...area.getRect() });
      }
    });
  }, [home, floatContext, setHomeRect, visible]);

  const onDrop = useCallback(
    async (loc: string) => {
      const type =
        loc === "stackArea"
          ? GameEventType.Play
          : loc === "discardPile"
          ? GameEventType.Discard
          : undefined;
      if (type !== undefined) {
        return await boardDispatch({
          type: UserActionType.GameAttempt,
          attempt: {
            type,
            card: index,
          },
        });
      } else {
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
          setHomeRect({ ...dragTarget, immediate: true });
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
            setHomeRect(homeRect);
          } else {
            onDrop(dropPath[0]).then((success) => {
              if (!success) {
                setHomeRect(homeRect);
              }
            });
            setDropPath(null);
          }
        }
      }
    },
    [dropPath, floatContext, home, onDrop, setHomeRect]
  );

  const dragListeners = useDrag(ref, onDrag);

  //Detach listeners if not in current persons hand
  const props = useMemo(() => {
    //Set correct zIndex
    let zIndex = 0;
    if (dragging) {
      zIndex = 100;
    } else if (home[0] === "discard") {
      zIndex = home[1] as number;
    } else if (cardOnTopOfStack) {
      zIndex = 1;
    }
    let listeners = draggable ? dragListeners : undefined;
    return {
      className: styles.AnimatedCard,
      ref,
      ...listeners,
      style: { zIndex, ...spring },
    };
  }, [cardOnTopOfStack, dragListeners, draggable, dragging, home, spring]);

  if (visible) {
    return (
      <animated.div {...props}>
        <HBDeckCard index={index} />
      </animated.div>
    );
  } else {
    return <></>;
  }
}
