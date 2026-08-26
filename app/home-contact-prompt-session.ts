export const HOME_CONTACT_PROMPT_SESSION_KEY = 'matthew-roxas:home-contact-prompt:v1';

type SessionStorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export function createHomeContactPromptSessionGate() {
  let claimedWithoutStorage = false;

  return function claimHomeContactPromptSession(storage: SessionStorageLike | null) {
    if (!storage) {
      if (claimedWithoutStorage) {
        return false;
      }

      claimedWithoutStorage = true;
      return true;
    }

    try {
      if (storage.getItem(HOME_CONTACT_PROMPT_SESSION_KEY)) {
        return false;
      }

      storage.setItem(HOME_CONTACT_PROMPT_SESSION_KEY, 'shown');
      return true;
    } catch {
      if (claimedWithoutStorage) {
        return false;
      }

      claimedWithoutStorage = true;
      return true;
    }
  };
}

export const claimHomeContactPromptSession = createHomeContactPromptSessionGate();
