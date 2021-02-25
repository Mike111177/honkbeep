import { cloneElement, ComponentPropsWithoutRef, RefObject, useContext, useEffect, useRef, useState } from "react";
import { animated, Controller, SpringConfig, SpringValue } from "react-spring/web.cjs";
import { DragRecognizer, DragStatus } from "./InputHandling";
import { Vec2D, vecAdd } from "./Vector";
import { DragContext, DragManager} from "./Dragging";


// TODO: Implement some kind of sequencer, to give more control of the animation
// TODO: Give control over z-index somehow, to prevent bugs where items

type FloatVectorDriver = {
  x: SpringValue<number> | number;
  y: SpringValue<number> | number;
}

type FloatInjectedProps = any;

export type FloatState = {
  claimed: boolean;
  listeners?: any;
}

//Everything a FloatElement needs to give a FloatContoller to give it control
type FloatBindRef = {
  ref: RefObject<HTMLElement>;
  setVectorDriver: React.Dispatch<React.SetStateAction<FloatVectorDriver>>;
  setState: React.Dispatch<React.SetStateAction<FloatState>>;
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

  onDrop?: (e:string)=>Promise<boolean>; 
  // Properties to inject into the floating element
  injectProps?: any;
}

function targetVec(el: HTMLElement): Vec2D {
  const rect = el.getBoundingClientRect();
  return { x: rect.x, y: rect.y };
}

const DEFAULT_SPRING: SpringConfig = {};
const DRAG_SPRING: SpringConfig = {friction: 50, tension:1500};

//Manages the shared state between a bound float and a claiming target
export class FloatController {
  //TODO: add scaling transforms
  //TODO: add relative coordinate support to handle non-full screen zones
  private bound: boolean = false;
  private home: Vec2D = { x: 0, y: 0 };
  private offset: Vec2D = { x: 0, y: 0 };
  private springCfg: SpringConfig = DEFAULT_SPRING;
  private state: FloatState;
  private fvDriver: FloatVectorDriver = {x:0,y:0};
  private options?: FloatTargetOptions;
  private spring?: Controller<Vec2D>;
  private drag?: DragRecognizer;
  private floatRef?: FloatBindRef;

  constructor() {
    this.state = {
      claimed: false
    };
  }

  //For targets to claim card, this may be called
  //multiple times by the claimer to update the bound card
  claim(claimer: HTMLDivElement, options?: FloatTargetOptions) {
    this.home = targetVec(claimer);
    this.state.claimed = true; //We be claimed now bois
    this.options = options;
    if (this.floatRef !== undefined){
      this.initSpring();
      this.floatRef.setVectorDriver(this.fvDriver);
      this.options = options;
      this.floatRef.setProps(this.options?.injectProps);
    }
    this.update();
  }

  //Floating cards use this to attach then selfs to the context
  useBind(bindref: FloatBindRef) {
    this.bound = true;
    this.floatRef = bindref;
    if (this.state.claimed){
      this.initSpring();
      this.floatRef.setVectorDriver(this.fvDriver);
      this.floatRef.setProps(this.options?.injectProps);
    }
    this.update();
  }

  //In theory this should be called when a floating object no longer needs to be bound
  //In practice, i don't actually know what the ramifications of that are
  //Currently nothing actually uses this function (at the time of writing)
  //As this system gets more generalized and bugs are found, we'll find out what this needs to be
  //Here is a guess for the meantime:
  unbind() {
    if (this.bound) {
      this.spring?.stop();
      this.spring = undefined;
    }
    this.bound = false;
  }


  private isActive() { return this.bound && this.state.claimed }

  //Internal helper function for whenever a bound floating card needs to know of a state change
  private update() {
    if (this.bound) {
      this.updateDrag();
      this.updateLocation();
      this.floatRef!.setState(this.state);
    }
  }

  private initSpring() {
    if (this.spring === undefined) {
      this.spring = new Controller<Vec2D>({ x: 0, y: 0 });
      this.spring.start(this.home);
      const { x, y } = this.spring.springs;
      this.fvDriver = {x,y};
    }
  }

  private updateDrag() {
    if (this.options?.draggable && this.isActive()) {
      if (this.drag === undefined) {
        this.drag = new DragRecognizer(this.floatRef!.ref, event=>this.onDragEvent(event));
      }
      this.state.listeners = this.drag.listeners;
    } else {
      this.drag = undefined;
      this.state.listeners = undefined;
      this.offset = {x: 0, y: 0};
    }
  }

  private updateLocation() {
    if (this.spring !== undefined){
      const {x,y} = vecAdd(this.home, this.offset);
      this.spring.start({x, y, config: this.springCfg});
    }
  }

  //TODO: this works okay but it probably could be made more robust
  private async onDragEvent({ down, offset }: DragStatus) {
    if (down){
      this.offset = offset;
      this.springCfg = DRAG_SPRING;
      if (this.floatRef !== undefined){
        this.floatRef.dragcontext.dragging = true;
      }
    } else {
      if (this.floatRef?.dragcontext.zone !== undefined && 
          this.options?.onDrop !== undefined && 
          await this.options.onDrop(this.floatRef.dragcontext.zone)){
            this.springCfg = DEFAULT_SPRING;   
      } else {
        this.offset = {x:0, y:0};
      }
    }
    this.update();
  }
}

type FloatElementID = number | string | undefined;

type FloatTargetProps<T extends FloatElementID> = {
  floatID?: T;
  options?: FloatTargetOptions;
  controller: (id: T) => FloatController;
} & ComponentPropsWithoutRef<"div">;

export function FloatTarget<T extends FloatElementID>({ floatID, options, controller, ...props }: FloatTargetProps<T>) {
  //Div element to grab target coordinates
  const element = useRef(null);

  //Claim the card. Anytime this component updates, the CardManager will 
  //update the bound floating card
  useEffect(() => {
    if (floatID !== undefined) {
      controller(floatID).claim(element.current!, options);
    }
  }, [floatID, controller, options]);

  return <div ref={element} {...props} />;
}

export type FloatElementProps<T extends FloatElementID> = {
  floatID: T;
  children?: React.ReactElement;
  controller: (id: T) => FloatController;
}

//Wrapper for any element meant to float
export function FloatElement<T extends FloatElementID>({ floatID, children, controller }: FloatElementProps<T>) {
  const [{x,y}, setVectorDriver] = useState<FloatVectorDriver>({
    x:0, y:0
  });
  const [props, setProps] = useState<FloatInjectedProps>(undefined);
  const [{ claimed, listeners }, setState] = useState<FloatState>({
    claimed: false
  });

  const ref = useRef(null);
  const dragcontext = useContext(DragContext);
  //Make sure this element stays bound to its manager
  useEffect(() => {
    controller(floatID).useBind({ setState, ref, dragcontext, setVectorDriver, setProps});
  }, [x, y, claimed, setState, controller, floatID, props, dragcontext, setVectorDriver]);

  return claimed ? //If we are not claimed by a target we should be invisible dont render anything
    <animated.div ref={ref} {...listeners} style={{ x, y, position: "absolute" }}>
      {children !== undefined ? cloneElement(children, props) : undefined}
    </animated.div>
    : <></>;
}

//TODO: add context provider to give children knowlege of their spacial limits
export function FloatLayer({ children, style, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div {...props} style={{ position: "absolute", ...style }}>
      {children}
    </div>
  );
}
