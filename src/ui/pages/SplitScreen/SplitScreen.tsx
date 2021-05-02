import { useState } from "react";
import { SplitScreenStyles as styles } from ".";
import LocalBackend from "../../../backend/LocalBackend";
import ServerBoard from "../../../server/ServerBoard";
import { genericPlayers, genericVariant } from "../../../game";
import HBClientBoard from "../../HBBoard/HBClientBoard";
import { ErrorBoundary } from "../../util/ErrorBoundry";

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
