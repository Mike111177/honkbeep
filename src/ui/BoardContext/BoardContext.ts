import React from "react";
import Board, { NullBoard } from "../../client/Board";

const BoardContext = React.createContext<Readonly<Board>>(new NullBoard());
export default BoardContext;
