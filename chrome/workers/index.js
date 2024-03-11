chrome.runtime.onMessage.addListener(() => {});

class Command {
  /**
   * @param {Object} command
   * @param {"copy" | "copyAndSend"} command.type
   * @param {string} command.content
   */
  constructor({ type, content }) {
    (this.type = type), (this.content = content);
  }
}

let websocket;

connect();

function connect() {
  websocket = new WebSocket("ws://localhost:8765");

  websocket.onerror = (event) => {
    console.log("Retrying...");
    setTimeout(() => {
      connect();
    }, 1000);
  };

  websocket.onopen = (event) => {
    console.log("websocket open");

    keepAlive();

    websocket.onmessage = async (event) => {
      console.log(`websocket received message: ${event.data}`);

      const tab = await getChatgptTab();

      if (!tab) {
        console.log("Please open or refresh chatgpt and try again");
        return;
      }

      const command = parseCommand(event);

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: runCommand,
        args: [command],
      });
    };

    websocket.onclose = (event) => {
      console.log("websocket connection closed");
      websocket = null;
      connect();
    };
  };
}

function keepAlive() {
  setTimeout(() => {
    if (websocket) {
      websocket.send("keepalive");
      keepAlive();
    }
  }, 20_000);
}

async function getChatgptTab() {
  const [tab] = await chrome.tabs.query({
    url: "https://chat.openai.com/*",
  });

  return tab;
}

/**
 * @returns {Command}
 */
function parseCommand(event) {
  return JSON.parse(event.data);
}

/**
 *
 * @param {Command} command
 */
function runCommand({ type, content }) {
  const textarea = document.getElementById("prompt-textarea");

  if (textarea.value) {
    textarea.value += "\n";
  }

  textarea.value += content;

  const inputEvent = new CustomEvent("input", { bubbles: true });
  textarea.dispatchEvent(inputEvent);

  if (type === "copyAndSend") {
    const sendBtn = document.querySelector('[data-testid="send-button"]');
    sendBtn.click();
  }
}
