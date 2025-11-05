import { browser } from '$app/environment';
import { Chat } from '@ai-sdk/svelte';

const createChatStore = () => new Chat({});

let browserSingleton: ReturnType<typeof createChatStore> | undefined;

export function getChatStore() {
  if (!browser) {
    return createChatStore();
  }

  if (!browserSingleton) {
    browserSingleton = createChatStore();
  }

  return browserSingleton;
}
