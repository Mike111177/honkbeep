import { useState } from "react";
import { Facility } from ".";
import { FacilityContext } from "./FacilityContext";

type FacilityBoundaryProps = {
  children: JSX.Element;
};
export function FacilityBoundary({ children }: FacilityBoundaryProps) {
  const [facility] = useState(() => new Facility());
  return (
    <FacilityContext.Provider value={facility}>
      {children}
    </FacilityContext.Provider>
  );
}
