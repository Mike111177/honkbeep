import { Zone } from "./Zone";

export type ZoneConfig = {
  dropZone?: boolean;
};

export type ZoneListener = (event: ZoneEvent) => any;
export type ZonePath = [string, ...(number | string)[]];
export enum ZoneEventType {
  Register = 1,
  Resize,
  DragEnter,
  DragLeave,
}

export type ZoneEvent = {
  area: Zone;
  type: ZoneEventType;
};
