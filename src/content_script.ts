let muteButton: HTMLElement | null;
let buttonObserver: MutationObserver | null = null;

const queryMuteButton = () =>
  document.querySelector<HTMLElement>(
    [
      '[role=button][aria-label*="⌘+D" i]',
      '[role=button][aria-label*="⌘ + D" i]',
      '[role=button][aria-label*="Ctrl+D" i]',
      '[role=button][aria-label*="Ctrl + D" i]',
    ].join(",")
  );

const notifyMuteStateChange = () => {
  if (muteButton)
    chrome.runtime.sendMessage({
      isMuted: muteButton.dataset.isMuted === "true",
    });
};

(async () => {
  chrome.runtime.onMessage.addListener((_msg, _sender, _sendResponse) => {
    const ev = new MouseEvent("click", { bubbles: true });
    muteButton?.dispatchEvent(ev);
  });

  for (;;) {
    if ((muteButton = queryMuteButton())) {
      notifyMuteStateChange();

      buttonObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (muteButton && muteButton.dataset.isMuted !== m.oldValue) {
            notifyMuteStateChange();
          }
        }
      });
      buttonObserver.observe(muteButton, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["data-is-muted"],
      });
    }

    await new Promise((resolve) => {
      new MutationObserver((_mutations, observer) => {
        if (queryMuteButton() !== muteButton) {
          observer.disconnect();
          resolve();
        }
      }).observe(document.body, { childList: true });
    });

    buttonObserver?.disconnect();
  }
})();
