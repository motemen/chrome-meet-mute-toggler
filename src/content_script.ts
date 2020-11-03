setTimeout(() => {
  // TODO: wait for muteButton
  const muteButton = document.querySelector('[role=button][aria-label*="⌘+D"]');
  console.log(muteButton);

  if (muteButton) {
    chrome.runtime.sendMessage({
      isMuted: muteButton.getAttribute('data-is-muted') === 'true',
    });

    const observer = new MutationObserver(mutations => {
      console.log(mutations);
      for (const m of mutations) {
        if (
          (m.target as HTMLElement).getAttribute('data-is-muted') !== m.oldValue
        ) {
          chrome.runtime.sendMessage({
            isMuted: muteButton.getAttribute('data-is-muted') === 'true',
          });
        }
      }
    });
    observer.observe(muteButton, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['data-is-muted'],
    });

    chrome.runtime.onMessage.addListener((msg, _sender, _sendResponse) => {
      const ev = new MouseEvent('click', {bubbles: true});
      muteButton?.dispatchEvent(ev);
    });
  }
}, 5000);
