VSCode Chatgpt Easy Copy is a simple utility to make it slightly convenient to copy code/text and files from vscode into chatgpt's textarea using commands. There are two components in the utility - this chrome extension and a vscode extension. Both must be installed and running for it to work. The vscode counterpart can be installed from the extension marketplace or manually following the instructions [here](https://github.com/nikhils98/vscode-chatgpt-easy-copy/tree/main)

# How it works?

The vscode extension initializes a websocket server at port 8765 on startup which the chrome extension connects to. On execution of a command, the selected text or contents of file(s) are sent to the chrome extension, via websocket, which manipulates chatgpt's DOM to input in the prompt textarea and send.

More information about the vscode extension can be found [here](https://github.com/nikhils98/vscode-chatgpt-easy-copy/tree/main/vscode).

## Service Worker

This is where the crux of the logic resides for the chrome extension. It's a background script managing the websocket connection to the vscode extension and responsible for injecting a function to manipulate chatgpt's DOM when a command is received.

It uses [chrome's scripting api](https://developer.chrome.com/docs/extensions/reference/api/scripting#description) to inject the function in runtime and requires host permissions for chatgpt to do so.

A service worker can become inactive after 30s of idle time so to prevent that a keepalive message is sent to the websocket server every 20s. There's also a [content script](#content-script-ping-server-worker) to prevent the same if socket is not connected. For more information, check the official docs on [service worker lifecycle](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle)

In most circumstances, the service worker should be active as long as chatgpt or vscode is running but if it gets inactive at some point, you can try one of the following:

1. Refresh chatgpt tab.
2. Reload the extension from Extensions page. After reload, chatgpt tab must be refreshed as well.

## Content Script: Ping Server Worker

This runs only when chatgpt is open. It sends a ping message to the service worker every 20s to keep it active when vscode isn't open. Essentially if you open vscode after the service worker had become inactive, opening a tab of chatgpt will make it active again.

# Note

1. At least one tab of chatgpt must be open. If multiple tabs are open, command is sent to only one.
2. You may see an error related to Websocket connection failure in extension console especially if installed manually. This will be the case when vscode is not running. It can be ignored as the service worker retries connection every second so when you run vscode it should connect.
