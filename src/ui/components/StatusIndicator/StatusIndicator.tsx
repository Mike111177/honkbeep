import { Pip } from "../Pip";
import { useCallback, useEffect, useState } from "react";
import * as Api from "../../../client/Api";

import { StatusIndicatorStyles as styles } from ".";

async function isServerUp() {
  try {
    return (await Api.status()).status === "UP";
  } catch {
    return false;
  }
}

export type StatusIndicatorProps = {};
export default function StatusIndicator(props: StatusIndicatorProps) {
  const [serverUp, setServerUp] = useState(false);
  const checkServerStatus = useCallback(async () => {
    setServerUp(await isServerUp());
  }, []);
  useEffect(() => {
    checkServerStatus();
    const timer = setInterval(checkServerStatus, 100000);
    return () => clearInterval(timer);
  }, [checkServerStatus]);
  return (
    <div className={styles.StatusIndicator} {...props}>
      <Pip shape={"Circle"} fill={serverUp ? "green" : "red"} size="100%" />
    </div>
  );
}
