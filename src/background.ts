chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostEquals: 'meet.google.com',
            },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

chrome.runtime.onMessage.addListener((msg, sender, _sendResponse) => {
  console.log(msg);
  if (msg.isMuted) {
    chrome.pageAction.setIcon({
      tabId: sender.tab!.id!,
      path: 'icons/baseline_mic_off_black_48dp.png',
    });
  } else {
    chrome.pageAction.setIcon({
      tabId: sender.tab!.id!,
      path: 'icons/baseline_mic_black_48dp.png',
    });
  }
});

chrome.pageAction.onClicked.addListener(tab => {
  chrome.tabs.sendMessage(tab.id!, {
    _test: true,
  });
});
