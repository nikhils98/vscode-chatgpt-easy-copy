import * as vscode from "vscode";
import { vscodeCommands } from "./vscode-command";
import { startServer, stopServer } from "./websocket-server";

export function activate(context: vscode.ExtensionContext) {
  startServer();

  context.subscriptions.push(
    ...vscodeCommands.map(({ name, callback }) =>
      vscode.commands.registerCommand(`vscodeChatgptEasyCopy.${name}`, callback)
    )
  );
}

export function deactivate() {
  stopServer();
}
