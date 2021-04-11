import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { animated, useSpring } from "@react-spring/web";

import HBDeckCard from "./DeckCard";
import {
  FloatAreaEventType,
  FloatAreaPath,
  FloatContext,
} from "../../util/Floating";
import { useDrag } from "../../input";
import { UserActionType } from "../../../client/types/UserAction";
import { GameState, GameEventType } from "../../../game";
import * as ArrayUtil from "../../../util/ArrayUtil";
import { Rectangle, vecAdd, vecInRectangle } from "../../../util/Vector";
import { useBoardReducer, useBoardState } from "../../BoardContext";

import styles from "./AnimatedDeck.css";

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

  const [draggable, cardOnTopOfStack, visible, ...home] = useBoardState(
    ({ paused, viewTurn, definition: { variant } }) => {
      const home = getCardHome(index, viewTurn);
      const cardInCurrentPlayerHand =
        home[0] === "hands" &&
        home[1] === (viewTurn.turn - 1) % variant.numPlayers;
      const stack =
        home[0] === "stacks" ? viewTurn.stacks[home[1] as number] : undefined;
      const cardOnTopOfStack =
        stack !== undefined && stack[stack.length - 1] === index;
      const visible =
        cardOnTopOfStack ||
        !(
          home[0] === "deck" ||
          (stack !== undefined && stack[stack.length - 2] !== index)
        );
      return [
        cardInCurrentPlayerHand && !paused,
        cardOnTopOfStack,
        visible,
        ...home,
      ];
    },
    [index],
    ArrayUtil.shallowCompare
  );

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

  const dragBinder = useDrag<HTMLDivElement>(onDrag, draggable);

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
    return {
      style: { zIndex, ...spring },
    };
  }, [cardOnTopOfStack, dragging, home, spring]);

  if (visible) {
    return (
      <animated.div className={styles.AnimatedCard} {...dragBinder} {...props}>
        <HBDeckCard index={index} />
      </animated.div>
    );
  } else {
    return <></>;
  }
}
