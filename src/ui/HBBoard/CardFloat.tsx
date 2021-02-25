import React, { ComponentPropsWithoutRef, createContext, useContext } from "react";

import HBDeckCard from "./HBDeckCard";
import { GameUIContext } from "../ReactFrontendInterface";
import { FloatController, FloatElement, FloatLayer, FloatTarget, FloatTargetOptions } from "../util/Floating";

// TODO: Generalize so more elements can be animated
// TODO: Create a specialized draggable object that is also animated to smooth out the current work-around

//class to manage a bunch of CardManagers
//this is what is delivered from useContext(CardFloatContext)
//This class may be generalized over to Floating.tsx
class DeckManager {
  defaultTarget?: HTMLDivElement;
  cards: FloatController[];
  readonly getCardCallback = (id:number)=>this.getCard(id)

  constructor(deckSize: number) {
    this.cards = [...Array(deckSize)].map(_ => new FloatController());
  }

  getCard(index: number) {
    return this.cards[index];
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

//Helper to make card targets
type CardFloatTargetProps = {
  index?: number;
  options?: FloatTargetOptions;
} & ComponentPropsWithoutRef<"div">;
export function CardFloatTarget({ index, children, options, ...props }: CardFloatTargetProps) {
  const deckHandles = useContext(CardFloatContext);
  return (
  <FloatTarget
    floatID={index}
     /*this lets us insert the wrapper function as children in the target component*/
    options={options}
    controller={deckHandles!.getCardCallback} {...props} />
  );
}

function FloatingCard({ index }: { index: number }) {
  const deckMan = useContext(CardFloatContext);
  return (
    <FloatElement floatID={index} controller={deckMan!.getCardCallback}>
      <HBDeckCard index={index}/>
    </FloatElement>
  );
}

//Create layer for all cards
export function CardFloatLayer() {
  const deckHandles = useContext(CardFloatContext);
  return ( //For each card, make a floating component for it, let it be free!
    <FloatLayer className="CardFloatLayer">
      {deckHandles!.cards.map((_, n) => <FloatingCard index={n} key={n} />)}
    </FloatLayer >
  );
}

