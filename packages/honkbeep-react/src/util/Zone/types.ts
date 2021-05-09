import { Zone } from "./Zone";

export type ZoneConfig = {
  attributes?: string[];
  meta?: any;
};

export type ZoneListener = (event: ZoneEvent) => any;
export type LegacyZonePath = [string, ...(number | string)[]];
export type ZonePath = string | LegacyZonePath;
export const enum ZoneEventType {
  Register = 1,
  Resize,
  DragEnter,
  DragLeave,
}

export type ZoneEvent = {
  area: Zone;
  type: ZoneEventType;
};
