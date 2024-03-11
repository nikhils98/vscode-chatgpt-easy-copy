//Keep the service worker active as long as chatgpt is opened in a tab
async function pingServiceWorker() {
  await chrome.runtime.sendMessage({ msg: "ping" });
  setTimeout(async () => {
    await pingServiceWorker();
  }, 20_000);
}

pingServiceWorker();
