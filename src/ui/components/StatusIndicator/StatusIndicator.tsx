import { Pip } from "../Pip";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { StatusMessage } from "../../../backend/types/ApiMessages";

import { StatusIndicatorStyles as styles } from ".";

async function isServerUp() {
  try {
    return (await axios.get<StatusMessage>("api/status")).data.status === "UP";
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
    const timer = setInterval(checkServerStatus, 10000);
    return () => clearInterval(timer);
  }, [checkServerStatus]);
  return (
    <div className={styles.StatusIndicator} {...props}>
      <Pip shape={"Circle"} fill={serverUp ? "green" : "red"} size="100%" />
    </div>
  );
}
