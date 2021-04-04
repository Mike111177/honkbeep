import { useContext } from "react";
import BoardContext from "../BoardContext";

/**
 * Shorthand for useContext(BoardContext);
 * @returns Current board context
 */
export default function useBoard() {
  return useContext(BoardContext);
}
