import { useEffect, useRef } from "react";
import { ZoneConfig, ZonePath } from ".";
import { useFacility } from "./useFacility";

export function useZone(path: ZonePath, config?: ZoneConfig) {
  const facility = useFacility();
  const ref = useRef(null);
  useEffect(() => {
    return facility.registerZone(path, ref, config);
  }, [path, ref, config, facility]);
  return ref;
}
