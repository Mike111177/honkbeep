import { useState } from "react";
import { createGenericSolitaireBoard } from "../../client/SolitaireBoard";
import HBBoardLayout from "./HBBoardLayout";

export default function HBSolitaireBoard() {
  const [board] = useState(createGenericSolitaireBoard);
  return <HBBoardLayout board={board} />;
}
