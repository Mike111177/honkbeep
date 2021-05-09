import { createContext } from "react";
import { Facility } from ".";

export const FacilityContext = createContext<Facility>(new Facility());
