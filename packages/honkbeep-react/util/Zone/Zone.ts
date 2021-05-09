import { ZoneConfig, ZoneEventType, ZoneListener } from ".";

export class Zone {
  readonly path: string;
  ref?: React.RefObject<HTMLElement>;
  config?: ZoneConfig;
  listeners: ZoneListener[] = [];

  constructor(path: string) {
    this.path = path;
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
