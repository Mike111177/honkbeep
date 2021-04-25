import { useCallback, useEffect, useMemo, useState } from "react";
import { animated, useSpring } from "@react-spring/web";

import HBDeckCard from "./DeckCard";
import { useFacility, ZoneEventType, ZonePath } from "../../Zone";
import { useGesture } from "../../input";
import { UserActionType } from "../../../client/types/UserAction";
import { GameEventType } from "../../../game";
import { compareRects, vecAdd, vecInRectangle } from "../../../util/Geometry";
import { useBoardReducer } from "../../BoardContext";
import { RectReadOnly } from "react-use-measure";

import styles from "./AnimatedDeck.css";
import { useSledCardState } from "./useSledCardState";
import { constrainCardRect } from "./constrainCardRect";
import { NoteBubble } from "../../components/NoteBubble";
import { useRefRouter, useRefHook } from "../../util/hooks/useRefRouter";

export type CardSledProps = {
  index: number;
  area: RectReadOnly;
};
//TODO: Generalize this code, a lot of elements from it would be nice to be able to use in other places
export function CardSled({ index, area }: CardSledProps) {
  //Get contexts
  const boardDispatch = useBoardReducer();
  const facility = useFacility();

  const [draggable, topStack, visible, ...home] = useSledCardState(index);
  const [dragging, setDragging] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [dropPath, setDropPath] = useState<ZonePath | null>(null);
  const [spring, springApi] = useSpring(() => ({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }));
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
        return springApi.start({ ...p, ...newHomeRect });
      }
    },
    [area, springApi, spring]
  );

  useEffect(() => {
    setHomeRect(facility.getRect(home));
    return facility.subscribeToArea(home, ({ type, area }) => {
      if (visible) {
        //No need to animate if we aren't visible
        const immediate = type === ZoneEventType.Resize;
        setHomeRect({ immediate, ...area.getRect() });
      }
    });
  }, [home, facility, setHomeRect, visible]);

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
      setNotesOpen(false);
      const homeRect = facility.getRect(home);
      if (homeRect !== undefined) {
        if (down) {
          const { x, y } = homeRect;
          const dragTarget = { ...homeRect, ...vecAdd({ x, y }, offset) };
          setHomeRect({ ...dragTarget, immediate: true });
          setDragging(true);
          const dropZone = facility.dropZones.find((zone) =>
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
    [dropPath, facility, home, onDrop, setHomeRect]
  );

  const { ref: dragRef, ...dragBinder } = useGesture(
    {
      onDrag,
      onRightClick: () => {
        setNotesOpen(!notesOpen);
      },
    },
    { drag: { enable: draggable } }
  );

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

  const [ref, refHook] = useRefRouter<HTMLDivElement>();
  useRefHook(refHook, dragRef);

  if (visible) {
    return (
      <>
        <animated.div
          className={styles.AnimatedCard}
          ref={ref}
          {...dragBinder}
          {...props}
        >
          <HBDeckCard index={index} />
        </animated.div>
        {notesOpen ? (
          <NoteBubble open={notesOpen} index={index} refHook={refHook} />
        ) : undefined}
      </>
    );
  } else {
    return <></>;
  }
}
