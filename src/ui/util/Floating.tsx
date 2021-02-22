import { ComponentPropsWithoutRef, useEffect, useRef, useState } from "react";
import { animated, Controller, SpringValue } from "react-spring/web.cjs"


// TODO: Implement some kind of sequencer, to give more control of the animation
// TODO: Give control over z-index somehow, to prevent bugs where items

export type FloatState = {
  x: SpringValue<number> | number;
  y: SpringValue<number> | number;
  claimed: boolean;
  props?: any;
}

export type Vec2D = {
  x: number;
  y: number;
}

function targetVec(el: HTMLElement): Vec2D {
  const rect = el.getBoundingClientRect();
  return { x: rect.x, y: rect.y };
}


//Manages the shared state between a bound float and a claiming target
export class FloatController {
  //TODO: add scaling transforms
  //TODO: add relative coordinate support to handle non-full screen zones
  bound: boolean = false;
  home: Vec2D = { x: 0, y: 0 };
  offset: Vec2D = { x: 0, y: 0 }; //TODO: use this to implement draggability
  spring?: Controller<Vec2D>;
  state: FloatState;
  setState?: any;

  constructor() {
    this.state = {
      x: 0, y: 0, //x and y will soon be replaced by Spring Values
      claimed: false
    }
  }

  //For targets to claim card, this may be called
  //multiple times by the claimer to update the bound card
  claim(claimer: HTMLDivElement, props: any) {
    this.home = targetVec(claimer);
    this.state.claimed = true; //We be claimed now bois
    this.state.props = props;
    this.update();
  }

  //Floating cards use this to attach then selfs to the context
  useBind(setState: any) {
    this.bound = true;
    this.setState = setState;
    this.update();
  }

  //In theory this should be called when a floating object no longer needs to be bound
  //In practice, i don't actually know what the ramifications of that are
  //Currently nothing actually uses this function (at the time of writing)
  //As this system gets more generalized and bugs are found, we'll find out what this needs to be
  //Here is a guess for the meantime:
  unbind() {
    if (this.bound) {
      this.spring?.stop()
      this.spring = undefined;
    }
    this.bound = false;
  }

  //Internal helper function for whenever a bound floating card needs to know of a state change
  update() {
    if (this.bound) {
      if (this.state.claimed) {
        if (this.spring === undefined) {
          this.spring = new Controller<Vec2D>({ x: 0, y: 0 });
        }
        this.spring.start(this.home);
        this.state = {
          ...this.state,
          ...this.spring.springs
        };
      }
      this.setState(this.state);
    }
  }
}

type FloatElementID = number | string | undefined;

type FloatTargetProps<T extends FloatElementID> = {
  floatID?: T;
  injectProps?: any;
  controller: (id: T) => FloatController;
} & ComponentPropsWithoutRef<"div">;

export function FloatTarget<T extends FloatElementID>({ floatID, injectProps, controller, ...props }: FloatTargetProps<T>) {
  //Div element to grab target coordinates
  const element = useRef(null);

  //Claim the card. Anytime this component updates, the CardManager will 
  //update the bound floating card
  useEffect(() => {
    if (floatID !== undefined) {
      controller(floatID).claim(element.current!, injectProps);
    }
  }, [floatID, controller, injectProps]);

  return <div ref={element} {...props} />;
}

export type FloatElementProps<T extends FloatElementID> = {
  floatID: T;
  children: (props: any) => React.ReactNode;
  controller: (id: T) => FloatController;
}

//Wrapper for any element meant to float
export function FloatElement<T extends FloatElementID>({ floatID, children, controller }: FloatElementProps<T>) {
  const [{ x, y, claimed, props }, setState] = useState<FloatState>({
    x: 0, y: 0,
    claimed: false
  });

  //Make sure this element stays bound to its manager
  useEffect(() => {
    controller(floatID).useBind(setState)
  }, [x, y, claimed, setState, controller, floatID, props]);

  return claimed ? //If we are not claimed by a target we should be invisible dont render anything
    <animated.div style={{ x, y, position: "absolute" }}>
      {children(props)}
    </animated.div>
    : <></>;
}

//TODO: add context provider to give children knowlege of their spacial limits
export function FloatLayer({children, style, ...props}: ComponentPropsWithoutRef<"div">){
  return (
    <div {...props} style={{ position: "absolute", ...style }}>
      {children}
    </div>
  );
}
