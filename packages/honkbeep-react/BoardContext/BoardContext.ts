import { createContext } from "react";
import { Board } from "honkbeep-play";

const BoardContext = createContext<Readonly<Board>>(null as unknown as Board);

export default BoardContext;
