import { useState } from "react";
import { createGenericSolitaireBoard } from "../../../client/SolitaireBoard";
import HBBoardLayout from "../../HBBoard/HBBoardLayout";

export default function Solitaire() {
  return <HBBoardLayout board={useState(createGenericSolitaireBoard)[0]} />;
}
