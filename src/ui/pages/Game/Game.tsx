import { useState } from "react";
import SocketBackend from "../../../backend/SocketBackend";
import HBClientBoard from "../../HBBoard/HBClientBoard";
import { ErrorBoundary, useQuery } from "../../util";

export default function Game() {
  const id = useQuery().get("id")!;
  const [backend] = useState(() => new SocketBackend(id));
  return (
    <ErrorBoundary>
      <HBClientBoard backend={backend} />
    </ErrorBoundary>
  );
}
