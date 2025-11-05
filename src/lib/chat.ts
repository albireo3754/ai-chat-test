import { Chat } from '@ai-sdk/svelte';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
  type ChatOnToolCallCallback,
} from 'ai';

type ChatStoreOptions = {
  api?: string;
  onToolCall?: ChatOnToolCallCallback;
};

export function createChatStore(options: ChatStoreOptions = {}) {
  const { api = '/api/chat', onToolCall } = options;

  return new Chat({
    transport: new DefaultChatTransport({ api }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall,
  });
}
