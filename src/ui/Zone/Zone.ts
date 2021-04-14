import { ZoneConfig, ZoneEventType, ZoneListener, ZonePath } from ".";

export class Zone {
  readonly path: ZonePath;
  ref?: React.RefObject<HTMLElement>;
  config?: ZoneConfig;
  listeners: ZoneListener[] = [];

  constructor(path: ZonePath) {
    this.path = [...path];
  }

  getRect() {
    const rect = this.ref?.current?.getBoundingClientRect();
    if (rect) {
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    } else {
      return undefined;
    }
  }

  update(reason: ZoneEventType) {
    this.listeners.forEach((callback: ZoneListener) =>
      callback({ type: reason, area: this })
    );
  }
}
