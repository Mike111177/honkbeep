import { useEffect, useState } from "react";
import HBBoardLayout from "./HBBoardLayout";
import ClientBoard from "../../client/ClientBoard";
import Backend from "../../backend/types/Backend";

type HBClientBoardProps = {
  backend: Backend;
};
export default function HBClientBoard({ backend }: HBClientBoardProps) {
  const [board, setBoard] = useState<ClientBoard | null>(null);

  useEffect(() => {
    backend.connect().then(() => setBoard(new ClientBoard(backend)));
    return () => backend.close();
  }, [backend]);

  if (board !== null) {
    return <HBBoardLayout board={board} />;
  } else {
    return <span>Waiting for initialization.</span>;
  }
}
