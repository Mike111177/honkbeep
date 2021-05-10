import { genericPlayers, genericVariant } from "honkbeep-game";
import ServerBoard from "honkbeep-protocol/ServerBoard";
import HBClientBoard from "../../HBClientBoard";
import { ErrorBoundary } from "honkbeep-react/util/ErrorBoundry";
import { useState } from "react";
import { SplitScreenStyles as styles } from ".";
import LocalBackend from "../../LocalBackend";

export default function SplitScreen() {
  //Create virtual local Server
  const [server] = useState(() => {
    const variantDef = genericVariant();
    return new ServerBoard(variantDef, genericPlayers(variantDef));
  });
  //Connect to local server as player 0
  const [backends] = useState(() =>
    [0, 1, 2, 3].map((i) => (
      <ErrorBoundary key={i}>
        <HBClientBoard backend={new LocalBackend(i, server)} />
      </ErrorBoundary>
    ))
  );

  return <div className={styles.SplitScreen}>{backends}</div>;
}
