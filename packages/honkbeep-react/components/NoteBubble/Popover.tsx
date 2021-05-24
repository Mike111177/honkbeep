import React, {
  forwardRef,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
  MutableRefObject,
} from "react";
import {
  PopoverPosition,
  ContentLocation,
  ContentLocationGetter,
  PopoverState,
  usePopover,
  ContentRenderer,
  PopoverAlign,
} from "react-tiny-popover";
import { compareDOMRects } from "honkbeep-util";
import { useMemoizedArray } from "../../util";
import { useRefHook } from "../../util/hooks/useRefRouter";
import { Constants } from "./Constants";
import { createPortal } from "react-dom";

interface PopoverPortalProps {
  container: Element;
  element: Element;
}

const PopoverPortal: React.FC<PopoverPortalProps> = ({
  container,
  element,
  children,
}) => {
  useLayoutEffect(() => {
    container.appendChild(element);
    return () => {
      container.removeChild(element);
    };
  }, [container, element]);

  return createPortal(children, element);
};

export { PopoverPortal };

export interface PopoverProps {
  isOpen: boolean;
  children: ContentRenderer | JSX.Element;
  positions?: Exclude<PopoverPosition, "custom">[];
  align?: Exclude<PopoverAlign, "custom">;
  padding?: number;
  reposition?: boolean;
  ref?: React.Ref<HTMLElement>;
  containerClassName?: string;
  containerParent?: HTMLElement;
  contentLocation?: ContentLocationGetter | ContentLocation;
  boundaryInset?: number;
  boundaryTolerance?: number;
  onClickOutside?: (e: MouseEvent) => void;
  refHook: any;
}
export const Popover = forwardRef<HTMLElement, PopoverProps>(
  (
    {
      isOpen,
      children,
      positions: externalPositions = Constants.DEFAULT_POSITIONS,
      align = Constants.DEFAULT_ALIGN,
      padding = 0,
      reposition = true,
      containerParent = window.document.body,
      containerClassName = "react-tiny-popover-container",
      contentLocation,
      boundaryInset = 0,
      onClickOutside,
      refHook,
    },
    externalRef
  ) => {
    const positions = useMemoizedArray(externalPositions);

    // TODO: factor prevs out into a custom prevs hook
    const prevIsOpen = useRef(false);
    const prevPositions = useRef<PopoverPosition[] | undefined>();
    const prevContentLocation =
      useRef<ContentLocation | ContentLocationGetter | undefined>();
    const prevReposition = useRef(reposition);

    const childRef = useRef<HTMLElement>();

    const [popoverState, setPopoverState] = useState<PopoverState>({
      align,
      nudgedLeft: 0,
      nudgedTop: 0,
      position: positions[0],
      padding,
      childRect: Constants.EMPTY_CLIENT_RECT,
      popoverRect: Constants.EMPTY_CLIENT_RECT,
      parentRect: Constants.EMPTY_CLIENT_RECT,
      boundaryInset,
    });

    const onPositionPopover = useCallback(
      (popoverState: PopoverState) => setPopoverState(popoverState),
      []
    );

    const [positionPopover, popoverRef] = usePopover({
      childRef: childRef as MutableRefObject<HTMLElement>,
      containerClassName,
      containerParent,
      contentLocation,
      positions,
      align,
      padding,
      boundaryInset,
      reposition,
      onPositionPopover,
    });

    useLayoutEffect(() => {
      let shouldUpdate = true;
      const updatePopover = () => {
        if (isOpen && shouldUpdate && childRef.current && popoverRef.current) {
          const childRect = childRef.current?.getBoundingClientRect();
          const popoverRect = popoverRef.current?.getBoundingClientRect();
          if (
            !compareDOMRects(childRect, {
              top: popoverState.childRect.top,
              left: popoverState.childRect.left,
              width: popoverState.childRect.width,
              height: popoverState.childRect.height,
              bottom:
                popoverState.childRect.top + popoverState.childRect.height,
              right: popoverState.childRect.left + popoverState.childRect.width,
            }) ||
            popoverRect.width !== popoverState.popoverRect.width ||
            popoverRect.height !== popoverState.popoverRect.height ||
            popoverState.padding !== padding ||
            popoverState.align !== align ||
            positions !== prevPositions.current ||
            contentLocation !== prevContentLocation.current ||
            reposition !== prevReposition.current
          ) {
            positionPopover();
          }

          // TODO: factor prev checks out into the custom prevs hook
          if (positions !== prevPositions.current) {
            prevPositions.current = positions;
          }
          if (contentLocation !== prevContentLocation.current) {
            prevContentLocation.current = contentLocation;
          }
          if (reposition !== prevReposition.current) {
            prevReposition.current = reposition;
          }

          if (shouldUpdate) {
            window.requestAnimationFrame(updatePopover);
          }
        }

        prevIsOpen.current = isOpen;
      };

      window.requestAnimationFrame(updatePopover);

      return () => {
        shouldUpdate = false;
      };
    }, [
      align,
      contentLocation,
      isOpen,
      padding,
      popoverRef,
      popoverState.align,
      popoverState.childRect.height,
      popoverState.childRect.left,
      popoverState.childRect.top,
      popoverState.childRect.width,
      popoverState.padding,
      popoverState.popoverRect.height,
      popoverState.popoverRect.width,
      positionPopover,
      positions,
      reposition,
    ]);

    const handleOnClickOutside = useCallback(
      (e: MouseEvent) => {
        if (
          isOpen &&
          !popoverRef?.current?.contains(e.target as Node) &&
          !childRef?.current?.contains(e.target as Node)
        ) {
          onClickOutside?.(e);
        }
      },
      [isOpen, onClickOutside, popoverRef]
    );

    const handleWindowResize = useCallback(() => {
      window.requestAnimationFrame(() => positionPopover());
    }, [positionPopover]);

    useEffect(() => {
      window.addEventListener("click", handleOnClickOutside);
      window.addEventListener("resize", handleWindowResize);
      return () => {
        window.removeEventListener("click", handleOnClickOutside);
        window.removeEventListener("resize", handleWindowResize);
      };
    }, [handleOnClickOutside, handleWindowResize]);

    useRefHook(
      refHook,
      useCallback(
        (node: HTMLElement) => {
          childRef.current = node;
          if (externalRef != null) {
            if (typeof externalRef === "object") {
              (externalRef as React.MutableRefObject<HTMLElement>).current =
                node;
            } else if (typeof externalRef === "function") {
              (externalRef as (instance: HTMLElement) => void)(node);
            }
          }
        },
        [externalRef]
      )
    );

    const renderPopover = () => {
      if (!isOpen) return null;
      return (
        <PopoverPortal element={popoverRef.current} container={containerParent}>
          {typeof children === "function" ? children(popoverState) : children}
        </PopoverPortal>
      );
    };

    return <>{renderPopover()}</>;
  }
);
