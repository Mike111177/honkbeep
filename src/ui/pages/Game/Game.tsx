import { useState } from "react";
import SocketBackend from "../../../backend/SocketBackend";
import HBClientBoard from "../../HBBoard/HBClientBoard";
import { ErrorBoundary } from "../../util";

export default function Game() {
  const [backend] = useState(() => new SocketBackend());
  return (
    <ErrorBoundary>
      <HBClientBoard backend={backend} />
    </ErrorBoundary>
  );
}
