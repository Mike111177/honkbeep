import { useState } from "react";
import SocketBackend from "../../SocketBackend";
import HBClientBoard from "../../HBClientBoard";
import { ErrorBoundary, useQuery } from "honkbeep-react/util";

export default function Game() {
  const id = useQuery().get("id")!;
  const [backend] = useState(() => new SocketBackend(id));
  return (
    <ErrorBoundary>
      <HBClientBoard backend={backend} />
    </ErrorBoundary>
  );
}
