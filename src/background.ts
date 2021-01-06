import { Message } from "./events";

const meetTabIds = new Set<number>();

chrome.runtime.onMessage.addListener((msg: Message, sender, _sendResponse) => {
  const tabId = sender.tab?.id;
  if (!tabId) return;

  switch (msg.event) {
    case "EVENT_MUTE_STATE_CHANGED":
      chrome.browserAction.setIcon({
        tabId,
        path: msg.isMuted
          ? "assets/icons/mic_off.png"
          : "assets/icons/mic_on.png",
      });
      break;

    case "EVENT_TAB_FOUND":
      meetTabIds[msg.isFound ? "add" : "delete"](tabId);
      console.log(meetTabIds);
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  meetTabIds.delete(tabId);
});

chrome.browserAction.onClicked.addListener((tab) => {
  if (!tab.id) {
    return;
  }

  if (meetTabIds.has(tab.id)) {
    chrome.tabs.sendMessage(tab.id, {});
  } else {
    console.log(meetTabIds);
    const meetTabId = meetTabIds.values().next().value as number | undefined;
    if (meetTabId) {
      chrome.tabs.get(meetTabId, (meetTab) => {
        chrome.windows.update(meetTab.windowId, { focused: true });
        chrome.tabs.update(meetTabId, { active: true });
      });
    }
  }
});
