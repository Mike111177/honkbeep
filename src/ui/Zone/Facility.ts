import { Zone, ZoneConfig, ZoneEventType, ZoneListener, ZonePath } from ".";

export class Facility {
  areas: any = {};
  dropZones: Zone[] = [];
  private initialized: boolean = false;
  private getOrCreateArea(path: ZonePath): Zone {
    let area = this.areas;
    let i = 0;
    //Search recursively along path
    for (i; i < path.length - 1; i++) {
      //If the next link in the path is undefined
      //Create it based on the next path item
      if (area[path[i]] === undefined) {
        switch (typeof path[i + 1]) {
          //If the next path item is a string, we create an object
          case "string":
            area[path[i]] = {};
            break;
          //However if it is a number we prefer to use an array for better lookup perf
          case "number":
            area[path[i]] = [];
            break;
          default:
            throw new Error("Unsupported path variable");
        }
      } else if (area[path[i]] instanceof Zone) {
        //Do not recurse through a Zone, this request was malformed
        throw new Error("Area found in middle of path.");
      }
      area = area[path[i]];
    }

    if (area[path[i]] === undefined) {
      //If the last item in the path is undef, we create it now and return it
      const newArea = new Zone(path);
      area[path[i]] = newArea;
      return newArea;
    } else if (area[path[i]] instanceof Zone) {
      //else if the last item in the path is a Zone, we found it! return it
      return area[path[i]] as Zone;
    } else {
      //Else the next item is not a valid area, the request was malformed
      throw new Error("Incomplete area path");
    }
  }

  private *allAreas() {
    function* helper(areas: any): Generator<Zone, void, unknown> {
      for (let child of Object.keys(areas)) {
        if (areas[child] !== undefined) {
          if (areas[child] instanceof Zone) {
            yield areas[child];
          } else {
            yield* helper(areas[child]);
          }
        }
      }
    }
    yield* helper(this.areas);
  }

  getZone(path: ZonePath) {
    return this.getOrCreateArea(path);
  }

  getRect(path: ZonePath) {
    return this.getOrCreateArea(path).getRect();
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
    const area = this.getOrCreateArea(path);
    area.listeners.push(callback);
    return () => {
      area.listeners.splice(
        area.listeners.findIndex((e: ZoneListener) => e === callback),
        1
      );
    };
  }

  registerZone(
    path: ZonePath,
    ref: React.MutableRefObject<null>,
    config?: ZoneConfig
  ) {
    const area = this.getOrCreateArea(path);
    //Cleanup old config for area
    if (area.config?.dropZone) {
      this.dropZones = this.dropZones.filter((a) => area !== a);
    }
    area.ref = ref;
    area.config = config;
    //Setup new config for area
    if (area.config?.dropZone) {
      this.dropZones.push(area);
    }
    area.update(ZoneEventType.Register);
  }
}
