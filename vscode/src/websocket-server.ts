import { WebSocket, WebSocketServer } from "ws";

let wss: WebSocketServer | undefined;
let wsClient: WebSocket | undefined;

export function startServer() {
  if (wss) {
    return;
  }

  wss = new WebSocketServer({
    port: 8765,
  });

  wss.on("connection", (client) => {
    wsClient = client;

    client.on("close", () => {
      wsClient = undefined;
    });
  });
}

export function stopServer() {
  wsClient?.close();
  wss?.close();
}

export function getClient() {
  return wsClient;
}
