import React from "react";
import { useMemo, useState, useEffect } from "react";
import DummyBoard from "../../client/DummyBoard";
import BoardContext from "../BoardContext";

export function DummyContext({ onAttempt, suits, players, children }: any) {
  const dummy = useMemo(
    () =>
      new DummyBoard(onAttempt, {
        variant: {
          suits: suits ?? ["Red", "Yellow", "Green", "Blue", "Purple"],
          numPlayers: players?.length || 4,
          handSize: 4,
        },
        playerNames: players ?? ["Alice", "Bob", "Cathy", "Donald"],
      }),
    [onAttempt, players, suits]
  );
  const [board, setBoard] = useState<DummyBoard>(dummy);
  //Story book thinks it is better than you
  //story book thinks complex behavior is bad
  //Story book thinks typing json is programming
  //Please just render my fucking component without having to gut it
  useEffect(() => {
    setBoard(dummy);
  }, [dummy]);
  return (
    <BoardContext.Provider value={board}>
      {React.cloneElement(children)}
    </BoardContext.Provider>
  );
}
