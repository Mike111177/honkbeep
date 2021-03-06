import { cloneElement, ComponentPropsWithoutRef, RefObject, useContext, useEffect, useRef, useState } from "react";
import { animated, Controller, SpringConfig, SpringValue } from "react-spring/web.cjs";
import { DragRecognizer, DragStatus } from "./InputHandling";
import { Vec2D, vecAdd } from "./Vector";
import { DragContext, DragManager } from "./Dragging";


// TODO: Implement some kind of sequencer, to give more control of the animation
// TODO: Give control over z-index somehow, to prevent bugs where items

type FloatDriver = {
  x?: SpringValue<number> | number;
  y?: SpringValue<number> | number;
  width?: SpringValue<number> | number;
  height?: SpringValue<number> | number;
}

type Rect = {
  width: number;
  height: number;
} & Vec2D;

type FloatInjectedProps = any;

//Everything a FloatElement needs to give a FloatContoller to give it control
type FloatBindRef = {
  ref: RefObject<HTMLElement>;
  setFloatDriver: React.Dispatch<React.SetStateAction<FloatDriver>>;
  setClaimed: React.Dispatch<React.SetStateAction<boolean>>;
  setListeners: React.Dispatch<React.SetStateAction<any>>;
  setProps: React.Dispatch<React.SetStateAction<FloatInjectedProps>>;
  dragcontext: DragManager;
}

//Everything A FloatTarget Wants to communicate to the floating element
export type FloatTargetOptions = {
  //Whether or not to allow user to drag element

  draggable?: boolean;
  // onDrop Event Handler for when user drops element on dropzone
  // The if supplied, FloatElement will not return to its origin 
  // until the promise is resolved true

  onDrop?: (e: string) => Promise<boolean>;
  // Properties to inject into the floating element
  injectProps?: any;
}

function targetRect(el: HTMLElement): Rect {
  const rect = el.getBoundingClientRect();
  return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
}

const DEFAULT_SPRING: SpringConfig = { friction: 20, tension: 100 };
const DRAG_SPRING: SpringConfig = { friction: 50, tension: 1500 };

//Manages the shared state between a bound float and a claiming target
export class FloatController {
  //TODO: add scaling transforms
  //TODO: add relative coordinate support to handle non-full screen zones
  private bound: boolean = false;
  private targetBox: Rect = { x: 0, y: 0, width: 0, height: 0 };
  private offset: Vec2D = { x: 0, y: 0 };
  private springCfg: SpringConfig = DEFAULT_SPRING;
  private listeners: any;
  private fvDriver: FloatDriver = { x: 0, y: 0 };
  private claimer?: HTMLDivElement;
  private detachTarget: () => void = () => { };
  private options?: FloatTargetOptions;
  private spring?: Controller<Rect>;
  private drag?: DragRecognizer;
  private floatRef?: FloatBindRef;

  buildTargetCallback(claimer: HTMLDivElement) {

  }

  //For targets to claim card, this may be called
  //multiple times by the claimer to update the bound card
  claim(claimer: HTMLDivElement, options?: FloatTargetOptions) {
    this.targetBox = targetRect(claimer);

    //Listen to target dom element resizes
    if (claimer !== this.claimer) {
      this.detachTarget();
      const callback = ((controller: FloatController) =>
        (event: UIEvent) => {
          controller.updateTargetRect();
        }
      )(this);
      this.detachTarget = ((target: HTMLDivElement, callback: (e: UIEvent) => void) => (() => {
        target.removeEventListener("resize", callback);
        window.removeEventListener("resize", callback);
      }))(claimer, callback);
      claimer.addEventListener("resize", callback);
      window.addEventListener("resize", callback);
    }
    
    this.claimer = claimer;
    this.options = options;
    this.link();
  }

  //Floating cards use this to attach then selfs to the context
  bind(bindref: FloatBindRef) {
    this.bound = true;
    this.floatRef = bindref;
    this.link();
  }

  //Refresh everything linking bound element and target
  private link() {
    if (this.floatRef !== undefined && this.claimer !== undefined) {
      this.initSpring();
      this.floatRef.setFloatDriver(this.fvDriver);
      this.floatRef.setProps(this.options?.injectProps);
      this.updateDrag();
      this.updateTargetRect();
      this.updateLocation();
      this.floatRef.setClaimed(this.claimer !== undefined);
      this.floatRef.setListeners(this.listeners);
    }
  }

  unbind() {
    if (this.bound) {
      this.spring?.stop();
      this.spring = undefined;
    }
    this.floatRef = undefined;
  }

  isActive() { return this.floatRef !== undefined && this.claimer !== undefined }
  private initSpring() {
    if (this.spring === undefined) {
      this.spring = new Controller<Rect>({ x: 0, y: 0, width: 0, height: 0 });
      this.spring.start(this.targetBox);
      this.fvDriver = this.spring.springs;
    }
  }

  private updateDrag() {
    if (this.options?.draggable && this.isActive()) {
      if (this.drag === undefined) {
        this.drag = new DragRecognizer(this.floatRef!.ref, event => this.onDragEvent(event));
      }
      this.listeners = this.drag.listeners;
    } else {
      this.drag = undefined;
      this.listeners = undefined;
      this.offset = { x: 0, y: 0 };
    }
  }

  private updateLocation() {
    if (this.spring !== undefined) {
      const { x, y } = vecAdd(this.targetBox, this.offset);
      const { width, height } = this.targetBox;
      this.spring.start({ x, y, width, height, config: this.springCfg });
    }
  }

  private updateTargetRect() {
    if (this.claimer !== undefined) {
      this.targetBox = targetRect(this.claimer);
      this.updateLocation();
    }
  }

  //TODO: this works okay but it probably could be made more robust
  private async onDragEvent({ down, offset }: DragStatus) {
    if (down) {
      this.offset = offset;
      this.springCfg = DRAG_SPRING;
      if (this.floatRef !== undefined) {
        this.floatRef.dragcontext.dragging = true;
      }
    } else {
      this.springCfg = DEFAULT_SPRING;
      if (this.floatRef?.dragcontext.zone !== undefined &&
        this.options?.onDrop !== undefined &&
        await this.options.onDrop(this.floatRef.dragcontext.zone)) {
        return;
      } else {
        this.offset = { x: 0, y: 0 };
      }
    }
    this.updateLocation();
  }
}

type FloatElementID = number | string | undefined;

type FloatTargetProps<T extends FloatElementID> = {
  floatID?: T;
  options?: FloatTargetOptions;
  children?: React.ReactElement;
  controller: (id: T) => FloatController;
} & ComponentPropsWithoutRef<"div">;

export function FloatTarget<T extends FloatElementID>({ floatID, options, children, controller, ...props }: FloatTargetProps<T>) {
  //Div element to grab target coordinates
  const element = useRef(null);

  //Claim the card. Anytime this component updates, the CardManager will 
  //update the bound floating card
  useEffect(() => {
    if (floatID !== undefined) {
      controller(floatID).claim(element.current!, options);
    }
  }, [floatID, controller, options]);

  if (children === undefined) {
    return <div ref={element} {...props} />;
  } else {
    return cloneElement(children, { ref: element });
  }
}

export type FloatElementProps<T extends FloatElementID> = {
  floatID: T;
  children?: React.ReactElement;
  controller: (id: T) => FloatController;
}

//Wrapper for any element meant to float
export function FloatElement<T extends FloatElementID>({ floatID, children, controller }: FloatElementProps<T>) {
  const [driver, setFloatDriver] = useState<FloatDriver>({});
  const [props, setProps] = useState<FloatInjectedProps>(undefined);
  const [listeners, setListeners] = useState<FloatInjectedProps>(undefined);
  const [claimed, setClaimed] = useState<boolean>(false);

  const ref = useRef(null);
  const dragcontext = useContext(DragContext);
  //Make sure this element stays bound to its manager
  useEffect(() => {
    controller(floatID).bind({ setClaimed, setListeners, ref, dragcontext, setFloatDriver, setProps });
  }, [driver, claimed, setClaimed, setListeners, controller, floatID, props, dragcontext, setFloatDriver]);

  return claimed ? //If we are not claimed by a target we should be invisible dont render anything
    <animated.div ref={ref} {...listeners} style={{ ...driver, position: "absolute", pointerEvents: "auto" }}>
      {children !== undefined ? cloneElement(children, props) : undefined}
    </animated.div>
    : <></>;
}

//TODO: add context provider to give children knowlege of their spacial limits
export function FloatLayer({ children, style, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div {...props} style={{ position: "absolute", overflow: "hidden", height:"100%", width:"100%", pointerEvents: "none", ...style }}>
      {children}
    </div>
  );
}
