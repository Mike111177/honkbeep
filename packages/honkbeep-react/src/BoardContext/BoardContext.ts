import React from "react";
import Board from "../../client/Board";
import { GameAttempt } from "../../game";

const BoardContext = React.createContext<Readonly<Board>>(
  (process.env.NODE_ENV === "production"
    ? null
    : new (class extends Board {
        attemptPlayerAction(_: GameAttempt): Promise<boolean> {
          throw new Error("Tried to use null board!");
        }
      })()) as Board
);

export default BoardContext;
