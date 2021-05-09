import { useContext } from "react";
import { FacilityContext } from "./FacilityContext";

export function useFacility() {
  return useContext(FacilityContext);
}
