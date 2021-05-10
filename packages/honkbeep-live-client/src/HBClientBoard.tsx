import { useEffect, useState } from "react";
import HBBoardLayout from "honkbeep-react/HBBoard/HBBoardLayout";
import ClientBoard from "./ClientBoard";
import Backend from "honkbeep-protocol/types/Backend";

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
