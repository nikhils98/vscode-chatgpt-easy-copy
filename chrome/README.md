# Setup

This extension should ideally work in any Chromium based browser. It has been tested in Brave and Chrome

## Chrome Web Store

TBA

## Manual Installation

1. Download the latest stable source code zip from Releases and unzip it.
2. Go to the Extensions page in your browser and enable Developer mode.
3. Click the Load Unpacked button and select the **chrome** directory from the unzipped folder.
4. Activate the extension if not active by default. Thats it!

For more information check chrome's docs on [loading unpacked extensions](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).

# How it works?

## Service Worker

This is where the crux of the logic resides; a background script managing the websocket connection to the vscode extension and responsible for injecting a function to manipulate chatgpt's DOM when a command is received.

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
