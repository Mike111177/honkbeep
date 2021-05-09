import { Zone, ZoneConfig, ZoneEventType, ZoneListener, ZonePath } from ".";
import { LegacyZonePath } from "./types";
import * as ArrayUtil from "../../util/ArrayUtil";

function legacyZonePathToString(path: LegacyZonePath): string {
  return path.join("-");
}

export class Facility {
  zones: Map<string, Zone> = new Map();
  attributedZones: Map<string, Array<Zone>> = new Map();
  private initialized: boolean = false;
  private getOrCreateZone(path: ZonePath): Zone {
    if (Array.isArray(path)) {
      path = legacyZonePathToString(path);
    }
    let zone = this.zones.get(path);
    if (zone === undefined) {
      const newZone = new Zone(path);
      this.zones.set(path, newZone);
      zone = newZone;
    }
    return zone;
  }

  private allAreas() {
    return this.zones.values();
  }

  getZone(path: ZonePath) {
    return this.getOrCreateZone(path);
  }

  getRect(path: ZonePath) {
    return this.getOrCreateZone(path).getRect();
  }

  private onWindowResize() {
    for (let area of this.allAreas()) {
      if (area.ref !== undefined) {
        area.update(ZoneEventType.Resize);
      }
    }
  }

  init() {
    if (!this.initialized) {
      window.addEventListener("resize", this.onWindowResize.bind(this));
      this.initialized = true;
    }
  }

  subscribeToArea(path: ZonePath, callback: ZoneListener) {
    const area = this.getOrCreateZone(path);
    area.listeners.push(callback);
    return () => {
      area.listeners.splice(
        area.listeners.findIndex((e: ZoneListener) => e === callback),
        1
      );
    };
  }

  zonesWithAttribute(attribute: string) {
    return this.attributedZones.get(attribute)!;
  }

  registerZone(
    path: ZonePath,
    ref: React.MutableRefObject<null>,
    config?: ZoneConfig
  ) {
    const zone = this.getOrCreateZone(path);
    if (
      config?.attributes !== undefined &&
      (zone.config?.attributes === undefined ||
        !ArrayUtil.shallowCompare(config.attributes, zone.config?.attributes))
    ) {
      for (const attribute of config.attributes) {
        const attributed = (this.attributedZones.get(attribute) ??
          this.attributedZones.set(attribute, []).get(attribute))!;
        if (!attributed.includes(zone)) {
          attributed.push(zone);
        }
      }
    }
    zone.ref = ref;
    zone.config = config;
    zone.update(ZoneEventType.Register);
  }
}
