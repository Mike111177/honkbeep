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
import { GameEventType } from "../../../game";
import { compareRects, vecAdd, vecInRectangle } from "../../../util/Geometry";
import { useBoardReducer } from "../../BoardContext";
import { RectReadOnly } from "react-use-measure";

import styles from "./AnimatedDeck.css";
import { useSledCardState } from "./useSledCardState";
import { constrainCardRect } from "./constrainCardRect";

export type CardSledProps = {
  index: number;
  area: RectReadOnly;
};
//TODO: Generalize this code, a lot of elements from it would be nice to be able to use in other places
export function CardSled({ index, area }: CardSledProps) {
  //Get contexts
  const boardDispatch = useBoardReducer();
  const floatContext = useContext(FloatContext);

  const [draggable, topStack, visible, ...home] = useSledCardState(index);
  const [dragging, setDragging] = useState(false);
  const [dropPath, setDropPath] = useState<FloatAreaPath | null>(null);
  const [spring, sprRef] = useSpring({ x: 0, y: 0, width: 0, height: 0 }, []);
  const setHomeRect = useCallback(
    function setHomeRect(p) {
      const newHomeRect = constrainCardRect(
        { x: area.x, y: area.y, width: area.width, height: area.height },
        {
          x: p.x,
          y: p.y,
          width: p.width,
          height: p.height,
        }
      );
      if (
        !compareRects(
          {
            height: spring.height.goal,
            width: spring.width.goal,
            x: spring.x.goal,
            y: spring.y.goal,
          },
          newHomeRect
        )
      ) {
        return sprRef.current[0].start({ ...p, ...newHomeRect });
      }
    },
    [
      area.height,
      area.width,
      area.x,
      area.y,
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
          const dragTarget = { ...homeRect, ...vecAdd({ x, y }, offset) };
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
    } else if (topStack) {
      zIndex = 1;
    }
    return {
      style: { zIndex, ...spring },
    };
  }, [topStack, dragging, home, spring]);

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
