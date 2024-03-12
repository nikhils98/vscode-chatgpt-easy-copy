import { getClient } from "./websocket-server";

export interface ChatgptCommand {
  type: "copy" | "copyAndSend";
  content: string;
}

export function runCommand(command: ChatgptCommand) {
  const wsClient = getClient();

  if (!wsClient) {
    return;
  }

  wsClient.send(JSON.stringify(command));
}
