import * as vscode from "vscode";
import { WebSocket, WebSocketServer } from "ws";
import * as fs from "fs/promises";

let wss: WebSocketServer;
let wsClient: WebSocket | undefined;

export function activate(context: vscode.ExtensionContext) {
  startWebSocketServer();

  const copyTextCommand = vscode.commands.registerCommand(
    "vscode-chatgpt-easy-copy.copyText",
    () => runCopyTextCommand({ type: "copy" })
  );

  const copyTextAndSendCommand = vscode.commands.registerCommand(
    "vscode-chatgpt-easy-copy.copyTextAndSend",
    () => runCopyTextCommand({ type: "copyAndSend" })
  );

  const copyFileCommand = vscode.commands.registerCommand(
    "vscode-chatgpt-easy-copy.copyFile",
    async (...args: any[]) => {
      const selectedFileUris = (args[1] ?? []) as vscode.Uri[];

      if (!selectedFileUris.length) {
        return;
      }

      runCopyFileCommand({ type: "copy", selectedFileUris });
    }
  );

  const copyFileAndSendCommand = vscode.commands.registerCommand(
    "vscode-chatgpt-easy-copy.copyFileAndSend",
    async (...args: any[]) => {
      const selectedFileUris = (args[1] ?? []) as vscode.Uri[];

      if (!selectedFileUris.length) {
        return;
      }

      runCopyFileCommand({ type: "copyAndSend", selectedFileUris });
    }
  );

  context.subscriptions.push(
    ...[
      copyTextCommand,
      copyTextAndSendCommand,
      copyFileCommand,
      copyFileAndSendCommand,
    ]
  );
}

export function deactivate() {
  wsClient?.close();
  wss.close();
}

function startWebSocketServer() {
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

function runCopyTextCommand({ type }: Pick<Command, "type">) {
  const content = getSelectedTextFromEditor();
  if (content) {
    runCommand({
      type,
      content,
    });
  }
}

async function runCopyFileCommand({
  type,
  selectedFileUris,
}: Pick<Command, "type"> & { selectedFileUris: vscode.Uri[] }) {
  const fileContents = await getFileContents(
    selectedFileUris.map((uri) => uri.fsPath)
  );

  const content = fileContents.reduce(
    (acc, cur, idx) =>
      `${acc}${cur.path}\n${cur.content}${
        idx === fileContents.length - 1 ? "" : "\n"
      }`,
    ""
  );

  runCommand({
    type,
    content,
  });
}

function getSelectedTextFromEditor() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    return editor.document.getText(editor.selection);
  }
}

interface Command {
  type: "copy" | "copyAndSend";
  content: string;
}

function runCommand(command: Command) {
  if (!wsClient) {
    return;
  }

  wsClient.send(JSON.stringify(command));
}

async function getFileContents(
  paths: string[]
): Promise<{ path: string; content: string }[]> {
  const fileContents = await Promise.all(
    paths.map((path) => getFileContent(path))
  );
  return fileContents.flat();
}

async function getFileContent(path: string) {
  try {
    const content = await fs.readFile(path, "utf-8");
    return {
      path,
      content,
    };
  } catch (e) {
    const dirEntries = await fs.readdir(path, {
      recursive: true,
      withFileTypes: true,
    });

    const filePaths = dirEntries
      .filter((de) => de.isFile())
      .map((de) => de.path + "\\" + de.name);

    return getFileContents(filePaths);
  }
}
