import { useState } from "react";
import { createGenericSolitaireBoard } from "honkbeep-play/SolitaireBoard";
import HBBoardLayout from "honkbeep-react/HBBoard/HBBoardLayout";

export default function Solitaire() {
  return <HBBoardLayout board={useState(createGenericSolitaireBoard)[0]} />;
}
