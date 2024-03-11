# Setup

This extension is not yet published in the VS Code Marketplace but it can be installed manually with the following steps:

## Download

Download the latest version of the package (.vsix) file from Releases

## Installation

From Extensions view

1. Click Views and More Actions (3 dots on top right of the view)
2. Select Install from VSIX

OR

Run the following command in terminal

```
code --install-extension copilot-at-home-vscode-0.0.1.vsix
```

# Usage

## Prerequisites

1. Install the chromium extension.
2. Run a tab of [chatgpt](https://chat.openai.com/).

For more information check [chromium extension's readme](https://github.com/copilot-at-home/chromium-extension/blob/main/README.md) which also explains how both the extensions work to bring chatgpt like experience in vscode!

## Commands

These can be run from the command palette or assigned a keyboard shortcut from Preferences

### Start or resume chat session

This opens the chat panel and starts a websocket server which the chromium extension connects to. If a panel is already opened, it'll bring that in foreground.

Now you can start exchanging messages with chatgpt in vscode!

### Copy text into chat

This copies the selected text in the prompt textbox in the chat panel. The chat panel must be opened for this to run.

**Known issue**: The chat panel must be in foreground for copy to work. It can be opened in a different view column until the issue is resolved.
