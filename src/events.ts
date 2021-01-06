export const EVENT_MUTE_STATE_CHANGED = "EVENT_MUTE_STATE_CHANGED" as const;

export const EVENT_TAB_FOUND = "EVENT_TAB_FOUND" as const;

export type Message =
  | {
      event: "EVENT_MUTE_STATE_CHANGED";
      isMuted: boolean;
    }
  | {
      event: "EVENT_TAB_FOUND";
      isFound: boolean;
    };
