# Setup

This extension should ideally work in any Chromium based browser. It has been tested in Brave and Chrome

It's not yet published in the Chrome Web Store but it can be installed manually with the following steps:

1. Download the latest source code zip from Releases and unzip.
2. Go to the Extensions page in your browser.
3. Enable Developer mode.
4. Click the Load unpacked button and select the extension directory.
5. Activate the extension if not active by default. Thats it!

For more information check chrome's docs on [loading extensions](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).

# Extension Anatomy

## Service Worker

This is a background script managing the websocket connection to the vscode extension. It retries the connection every second if the socket server is not running i.e chat panel is not opened in vscode. So we can open the chat panel whenever we want and it'll connect to it.

If unhandled, service worker is made inactive by the browser after 30s of inactivity which in our case can happen in 2 situations:

1. Chat panel isn't open so no socket connection is possible.
2. No message has been exchanged in 30s

For more information, check the official docs on [service worker lifecycle](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle).

Since the service worker serves as the link b/w vscode and the chatgpt webapp ([Content Script](#content-script)) it must be active all the time at least while chatgpt is also running in a tab and this is ensured by:

1. A ping message is sent by the Content Script every 20s so as long as chatgpt is open in a tab, the service worker will never get inactive. If the tab is opened after the service worker had become inactive, it'll activate it.
2. A ping message is sent by the service worker to the vscode extension via websocket every 20s

In most circumstances, the service worker should be active as long as chatgpt is running but if it does get inactive at some point, it can be reloaded from the Extensions page. After reload, chatgpt tab must be refreshed as well.

## Content Script

This script runs only when a chatgpt tab is open as it uses the DOM api to input the message, press send and listen for gpt's response all programmtically.

Both service worker and content script exchange messages b/w each other via [chrome's messaging api](https://developer.chrome.com/docs/extensions/develop/concepts/messaging). The flow for a message sent from the vscode extension and response sent back from content script is:

```
User Message: vscode -> service worker -> content script
```

```
Chatgpt Response: content script -> service worker -> vscode
```

Since chatgpt's response is streamed, the latest content is read and forwarded by the content script every 200ms until the response is completed.

# Known Issues

1. Behaviour is unknown if multiple tabs of chatgpt are open or the extension is running in multiple browsers. For best experience install this extension in one browser and run chatgpt in one tab only.
2. You may see errors related to Websocket connection failure in Extensions. This will be the case when a chat panel isn't open in vscode hence no websocket server is running. It can be ignored as the service worker retries connection every second.
3. Chatgpt tab must be active and the browser window must be opened otherwise the message exchange doesn't work well.
