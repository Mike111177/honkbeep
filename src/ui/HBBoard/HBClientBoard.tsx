import { useEffect, useState } from "react";
import HBBoardLayout from "./HBBoardLayout";
import LocalServer from "../../game/LocalServer";
import LocalBackend from "../../game/LocalBackend";
import ClientBoard from "../../client/ClientBoard";

export default function HBClientBoard() {
  const gamedef = {
    variant: {
      suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
      numPlayers: 4,
      handSize: 4,
    },
    playerNames: ["Alice", "Bob", "Cathy", "Donald"],
  };

  //Create virtual local Server
  const [server] = useState(() => new LocalServer(gamedef));
  //Connect to local server as player 0
  const [backend] = useState(() => new LocalBackend(0, server));

  const [manager, setManager] = useState<undefined | ClientBoard>(undefined);

  useEffect(() => {
    backend.onReady(() => setManager(new ClientBoard(backend)));
  }, [backend]);

  if (manager !== undefined) {
    return <HBBoardLayout board={manager} />;
  } else {
    return <span>Waiting for initialization.</span>;
  }
}
