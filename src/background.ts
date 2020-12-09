chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostEquals: "meet.google.com",
            },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

chrome.runtime.onMessage.addListener((msg, sender, _sendResponse) => {
  const tabId = sender.tab?.id;
  if (tabId)
    chrome.pageAction.setIcon({
      tabId,
      path: msg.isMuted
        ? "assets/icons/mic_off.png"
        : "assets/icons/mic_on.png",
    });
});

chrome.pageAction.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, {
      _test: true,
    });
  }
});
