import NodeWebSocket from "ws";

export class MessageSocket<
  MessageType extends {},
  SocketType extends NodeWebSocket | WebSocket = WebSocket
> {
  private ws: SocketType;
  constructor(ws: SocketType) {
    this.ws = ws;
  }

  send(msg: MessageType) {
    this.ws.send(JSON.stringify(msg));
  }

  close() {
    this.ws.close();
  }

  set onmessage(
    listener: ((data: MessageType, ev: MessageEvent) => void) | null
  ) {
    if (listener === null) {
      this.ws.onmessage = null;
    } else {
      this.ws.onmessage = (event: MessageEvent<any>) => {
        const data = JSON.parse(event.data) as MessageType;
        listener(data, event);
      };
    }
  }

  set onopen(value: SocketType["onopen"]) {
    this.ws.onopen = value;
  }
}
