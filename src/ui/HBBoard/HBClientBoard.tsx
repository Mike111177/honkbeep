import { useEffect, useState } from "react";
import HBBoardLayout from "./HBBoardLayout";
import LocalServer from "../../backend/LocalServer";
import LocalBackend from "../../backend/LocalBackend";
import ClientBoard from "../../client/ClientBoard";
import { genericDefinition } from "../../game";

export default function HBClientBoard() {
  //Create virtual local Server
  const [server] = useState(() => new LocalServer(genericDefinition()));
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
