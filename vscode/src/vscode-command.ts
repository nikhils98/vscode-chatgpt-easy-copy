import * as vscode from "vscode";
import * as fs from "fs/promises";
import { ChatgptCommand, runCommand } from "./chatgpt-command";

interface VSCodeCommand {
  name: string;
  callback: (...args: any[]) => void;
}

export const vscodeCommands: VSCodeCommand[] = [
  {
    name: "copyText",
    callback: () => runCopyTextCommand({ type: "copy" }),
  },
  {
    name: "copyTextAndSend",
    callback: () => runCopyTextCommand({ type: "copyAndSend" }),
  },
  {
    name: "copyFile",
    callback: async (...args: any[]) => {
      const selectedFileUris = (args[1] ?? []) as vscode.Uri[];

      if (!selectedFileUris.length) {
        return;
      }

      runCopyFileCommand({ type: "copy", selectedFileUris });
    },
  },
  {
    name: "copyFileAndSend",
    callback: async (...args: any[]) => {
      const selectedFileUris = (args[1] ?? []) as vscode.Uri[];

      if (!selectedFileUris.length) {
        return;
      }

      runCopyFileCommand({ type: "copyAndSend", selectedFileUris });
    },
  },
];

function runCopyTextCommand({ type }: Pick<ChatgptCommand, "type">) {
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
}: Pick<ChatgptCommand, "type"> & {
  selectedFileUris: vscode.Uri[];
}) {
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
    if ((e as any).code === "EISDIR") {
      const dirEntries = await fs.readdir(path, {
        recursive: true,
        withFileTypes: true,
      });

      const filePaths = dirEntries
        .filter((de) => de.isFile())
        .map((de) => de.path + "\\" + de.name);

      return getFileContents(filePaths);
    }

    console.log("Something went wrong on getting file content", e);

    return [];
  }
}
