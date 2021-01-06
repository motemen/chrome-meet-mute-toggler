import { EVENT_MUTE_STATE_CHANGED, EVENT_TAB_FOUND } from "./events";
import { Message } from "./events";

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
      event: EVENT_MUTE_STATE_CHANGED,
      isMuted: muteButton.dataset.isMuted === "true",
    } as Message);
};

const notifyTabFound = () => {
  chrome.runtime.sendMessage({
    event: EVENT_TAB_FOUND,
    isFound: !!muteButton,
  } as Message);
};

(async () => {
  chrome.runtime.onMessage.addListener((_msg, _sender, _sendResponse) => {
    const ev = new MouseEvent("click", { bubbles: true });
    muteButton?.dispatchEvent(ev);
  });

  for (;;) {
    muteButton = queryMuteButton();
    notifyTabFound();
    if (muteButton) {
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

    await new Promise<void>((resolve) => {
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
