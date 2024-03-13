VSCode Chatgpt Easy Copy is a simple utility to make it slightly convenient to copy code/text and files from vscode into chatgpt's textarea using commands. It is to be used in conjunction with a chrome extension for which installation instructions can be found at https://github.com/nikhils98/vscode-chatgpt-easy-copy

# How it works?

The vscode extension initializes a websocket server at port 8765 on startup which the chrome extension connects to. On execution of a command, the selected text or contents of file(s) are sent to the chrome extension, via websocket, which manipulates chatgpt's DOM to input in the prompt textarea and send.

More information about the chrome extension can be found [here](https://github.com/nikhils98/vscode-chatgpt-easy-copy/tree/main/chrome).

# Commands

Commands can be run from the command palette or context menu (in the case of `Copy File`) and assigned a keyboard shortcut from Preferences.

Note all commands **append** to the content in the prompt textbox.

## Copy text

Copies the selected text in chatgpt. You can modify it before sending the message

## Copy text and send

Copies the selected text and triggers the send button in chatgpt

![Copy Text Demo](https://raw.githubusercontent.com/nikhils98/vscode-chatgpt-easy-copy/main/demo/copy-text.gif)

## Copy file

Copies the content of the selected file(s). Simply select a file or multiple files in the explorer and right click or open command palette. Choose one of `Copy file` or `Copy file and send` on which the file paths and their contents will be copied over to chatgpt textbox.

If you select a directory then all the files inside will be recursively copied over.

## Copy file and send

Same as `Copy file` but it also triggers send button right away.

![Copy File Demo](https://raw.githubusercontent.com/nikhils98/vscode-chatgpt-easy-copy/main/demo/copy-file.gif)
