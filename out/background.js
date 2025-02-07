chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "openExtension",
    title: "Open NEXT-CHROME-STARTER",
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openExtension") {
    chrome.windows.create({
      url: chrome.runtime.getURL("index.html"),
      type: "popup",
      width: 800,
      height: 600,
    });
  }
});
