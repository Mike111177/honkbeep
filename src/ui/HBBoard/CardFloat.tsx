import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { animated, Controller } from "react-spring"

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

  useBoundCard(index: number, setState: any) {
    return this.cards[index].useBind(setState);
  }
}

type CardState = {
  x: any;
  y: any;
  claimed: boolean;
  wrap?: any;
}

class CardManager {
  bound: boolean = false;
  home: Vec2D = { x: 0, y: 0 };
  offset: Vec2D = { x: 0, y: 0 };
  deckManager: DeckManager;
  spring?: Controller<Vec2D>;
  state: CardState;
  setState?: any;

  constructor(manager: DeckManager) {
    this.deckManager = manager;
    this.state = {
      x: 0, y: 0,
      claimed: false
    }
  }

  //For targets to claim card
  claim(claimer: HTMLDivElement, wrap: any) {
    this.home = targetVec(claimer);
    this.state.claimed = true;
    this.state.wrap = wrap;
    this.update();
  }

  //For cards to provide handlers
  useBind(setState: any) {
    this.bound = true;
    this.setState = setState;
    this.update();
  }
  unbind() {
    if (this.bound) {
      this.spring?.stop()
      this.spring = undefined;
    }
    this.bound = false;
  }
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

export function CardFloatArea({ children }: any) {
  const deckSize = useContext(GameUIContext).getDeckSize();
  const deckHandles = new DeckManager(deckSize);
  return (
    <CardFloatContext.Provider value={deckHandles}>
      {children}
    </CardFloatContext.Provider>
  );
}

export function CardFloatTarget({ wrap, index, style }: any) {
  const element = useRef(null);
  const deckHandles = useContext(CardFloatContext);
  useEffect(() => { deckHandles!.claimCard(index, element.current!, wrap) });
  return <div ref={element} style={style} />;
}

function FloatingCard({ index }: { index: number }) {
  const deckMan = useContext(CardFloatContext);
  const [{ x, y, claimed, wrap }, setState] = useState<CardState>({
    x: 0, y: 0,
    claimed: false
  });
  useEffect(() => {
    deckMan!.useBoundCard(index, setState);
  }, [x, y, claimed, setState, deckMan, index]);

  if (claimed) {
    if (wrap === undefined) {
      return (
        <animated.div style={{ x, y, position: "absolute" }}>
          <HBDeckCard index={index} />
        </animated.div>
      );
    } else {
      return (
        <animated.div style={{ x, y, position: "absolute" }}>
          {wrap(<HBDeckCard index={index} />)}
        </animated.div>
      )
    }
  } else {
    return <></>;
  }
}

export function CardFloatLayer() {
  const deckHandles = useContext(CardFloatContext);
  return (
    <div className="CardFloatLayer" style={{ position: "absolute" }}>
      {deckHandles!.cards.map((_, n) => <FloatingCard index={n} key={n} />)}
    </div>
  )
}

