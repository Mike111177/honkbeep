import React from "react";
import Board from "honkbeep-play/Board";

const BoardContext = React.createContext<Readonly<Board>>(
  (null as unknown) as Board
);

export default BoardContext;
