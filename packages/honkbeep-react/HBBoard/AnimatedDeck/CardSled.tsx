import { animated, useSpring } from "@react-spring/web";
import { GameEventType } from "honkbeep-game";
import { LocationType } from "honkbeep-play/types/Location";
import { UserActionType } from "honkbeep-play/types/UserAction";
import { compareRects, vecAdd, vecInRectangle } from "honkbeep-util/Geometry";
import { useCallback, useEffect, useState } from "react";
import { RectReadOnly } from "react-use-measure";
import { useBoardReducer } from "../../BoardContext";
import { NoteBubble } from "../../components/NoteBubble";
import { useGesture } from "../../util/input";
import { useRefHook, useRefRouter } from "../../util/hooks/useRefRouter";
import { useFacility, ZoneEventType, ZoneListener } from "../../util/Zone";
import { constrainCardRect } from "./constrainCardRect";
import HBDeckCard from "./DeckCard";
import { useSledCardState } from "./useSledCardState";

import styles from "./AnimatedDeck.css";

export type CardSledProps = {
  index: number;
  area: RectReadOnly;
};
//TODO: Generalize this code, a lot of elements from it would be nice to be able to use in other places
export function CardSled({ index, area }: CardSledProps) {
  //Get contexts
  const boardDispatch = useBoardReducer();
  const facility = useFacility();

  const [draggable, topStack, visible, home, loc] = useSledCardState(index);
  const [dragging, setDragging] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [dropPath, setDropPath] = useState<string | null>(null);
  const [discardZ, setDiscardZ] = useState(0);
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
    const updateHome: ZoneListener = ({ type, area }) => {
      const immediate = type === ZoneEventType.Resize;
      setHomeRect({ immediate, ...area.getRect() });
      if (
        loc.place === LocationType.Discard &&
        area.config?.meta?.z !== undefined
      ) {
        setDiscardZ(area.config?.meta?.z);
      }
    };
    const area = facility.getZone(home);
    updateHome({ type: ZoneEventType.Register, area });
    return facility.subscribeToArea(home, updateHome);
  }, [home, facility, setHomeRect, visible, loc.place]);

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
          const dropZone = facility
            .zonesWithAttribute("dropzone")
            .find((zone) =>
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
            onDrop(dropPath).then((success) => {
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

  let zIndex = 0;
  if (dragging) {
    zIndex = 100;
  } else if (loc.place === LocationType.Discard) {
    zIndex = discardZ + 10;
  } else if (topStack) {
    zIndex = 1;
  }

  const [ref, refHook] = useRefRouter<HTMLDivElement>();
  useRefHook(refHook, dragRef);

  if (visible) {
    return (
      <>
        <animated.div
          className={styles.AnimatedCard}
          ref={ref}
          {...dragBinder}
          style={{ zIndex, ...spring }}
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
