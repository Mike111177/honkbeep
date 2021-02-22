import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { animated, Controller, SpringValue } from "react-spring/web.cjs"

import HBDeckCard from "./HBDeckCard";
import { GameUIContext } from "../ReactFrontendInterface";

// TODO: Generalize so more elements can be animated
// TODO: Create a specialized draggable object that is also animated to smooth out the current work-around
// TODO: Implement some kind of sequencer, to give more control of the animation
// TODO: Give control over z-index somehow, to prevent bugs where cards overlap

type Vec2D = {
  x: number;
  y: number;
}

function targetVec(el: HTMLElement): Vec2D {
  const rect = el.getBoundingClientRect();
  return { x: rect.x, y: rect.y };
}

//class to manage a bunch of CardManagers
//this is what is delivered from useContext(CardFloatContext)
//TODO: Depending on the direction this goes it might be a good idea to 
//  just merge CardManager class into this one as an array for simplicity
//  However CardManager might also be generalized to more types of items than just cards
//  If that is the case this would have to remain a shallow array of that generalization
class DeckManager {
  defaultTarget?: HTMLDivElement;
  cards: CardManager[];

  constructor(deckSize: number) {
    this.cards = [...Array(deckSize)].map(_ => new CardManager(this));
  }

  defaultHome() {
    if (this.defaultTarget !== undefined) {
      return targetVec(this.defaultTarget);
    } else {
      return { x: 0, y: 0 };
    }
  }

  claimCard(index: number | undefined, claimer: HTMLDivElement, wrap: any) {
    if (index !== undefined) {
      return this.cards[index].claim(claimer, wrap);
    }
  }

  //Shortcut to useBind an element of an array
  useBoundCard(index: number, setState: any) {
    return this.cards[index].useBind(setState);
  }
}

type CardState = {
  x: SpringValue<number> | number;
  y: SpringValue<number> | number;
  claimed: boolean;
  wrap?: any;
}

class CardManager {
  bound: boolean = false;
  home: Vec2D = { x: 0, y: 0 };
  offset: Vec2D = { x: 0, y: 0 }; //TODO: use this to implement draggability
  deckManager: DeckManager;
  spring?: Controller<Vec2D>;
  state: CardState;
  setState?: any;

  constructor(manager: DeckManager) {
    this.deckManager = manager;
    this.state = {
      x: 0, y: 0, //x and y will soon be replaced by Spring Values
      claimed: false
    }
  }

  //For targets to claim card, this may be called,
  //multiple times by the claimer to update the bound card
  claim(claimer: HTMLDivElement, wrap: any) {
    this.home = targetVec(claimer);
    this.state.claimed = true; //We be claimed now bois
    this.state.wrap = wrap;
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
          this.spring = new Controller<Vec2D>(this.deckManager.defaultHome());
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

const CardFloatContext = createContext<DeckManager | undefined>(undefined);

//Wrap this around anything you want to be able to place Floatables or Float targets
//In the future this might be genrrialized to support spawning multiple context for different float/target groups
export function CardFloatArea({ children }: any) {
  const deckSize = useContext(GameUIContext).getDeckSize();
  const deckHandles = new DeckManager(deckSize);
  return (
    // We are just providing the context we use in literally everything else here
    <CardFloatContext.Provider value={deckHandles}>
      {children}
    </CardFloatContext.Provider>
  );
}

//Element to create target, binds a reference to a card by index
//TODO: I would like to make the wrapping functionality a little more elegent
export function CardFloatTarget({ wrap, index, style }: any) {
  const deckHandles = useContext(CardFloatContext);

  //Div element to grab target coordinates
  const element = useRef(null);

  //Claim the card. Anytime this component updates, the CardManager will 
  //update the target coordinates of the bound floating card
  useEffect(() => {
    deckHandles!.claimCard(index, element.current!, wrap)
  });

  return <div ref={element} style={style} />;
}

function FloatingCard({ index }: { index: number }) {
  const deckMan = useContext(CardFloatContext);
  const [{ x, y, claimed, wrap }, setState] = useState<CardState>({
    x: 0, y: 0,
    claimed: false
  });
  //Make sure this card stays bound to its manager
  useEffect(() => {
    deckMan!.useBoundCard(index, setState); 
  }, [x, y, claimed, setState, deckMan, index]);

  //TODO: Make a seperate visibility api point for the target to control
  return claimed ? //If we are not claimed by a target we should be invisible dont render anything
    <animated.div style={{ x, y, position: "absolute" }}>
      { //If our claimer gave use a wrapper function... wrap with that function.... 
        wrap === undefined ? <HBDeckCard index={index} /> : wrap(<HBDeckCard index={index} />)
      }
    </animated.div> 
    : <></>;
}

export function CardFloatLayer() {
  const deckHandles = useContext(CardFloatContext);
  return ( //For each card, make a floating component for it, let it be free!
    <div className="CardFloatLayer" style={{ position: "absolute" }}>
      {deckHandles!.cards.map((_, n) => <FloatingCard index={n} key={n} />)}
    </div>
  )
}

