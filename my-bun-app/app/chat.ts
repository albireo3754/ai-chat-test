import { Chat, UseChatHelpers, UseChatOptions } from "@ai-sdk/react";
import { AbstractChat, ChatInit, ChatState, ChatStatus, UIMessage } from "ai";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

export class MyChatState<UI_MESSAGE extends UIMessage>
  implements ChatState<UI_MESSAGE>
{
  #messages: UI_MESSAGE[];
  #status: ChatStatus = 'ready';
  #error: Error | undefined = undefined;

  #messagesCallbacks = new Set<() => void>();
  #statusCallbacks = new Set<() => void>();
  #errorCallbacks = new Set<() => void>();

  constructor(initialMessages: UI_MESSAGE[] = []) {
    this.#messages = initialMessages;
  }

  get status(): ChatStatus {
    return this.#status;
  }

  set status(newStatus: ChatStatus) {
    this.#status = newStatus;
    this.#callStatusCallbacks();
  }

  get error(): Error | undefined {
    return this.#error;
  }

  set error(newError: Error | undefined) {
    this.#error = newError;
    this.#callErrorCallbacks();
  }

  get messages(): UI_MESSAGE[] {
    return this.#messages;
  }

  set messages(newMessages: UI_MESSAGE[]) {
    this.#messages = [...newMessages];
    this.#callMessagesCallbacks();
  }

  pushMessage = (message: UI_MESSAGE) => {
    this.#messages = this.#messages.concat(message);
    this.#callMessagesCallbacks();
  };

  popMessage = () => {
    this.#messages = this.#messages.slice(0, -1);
    this.#callMessagesCallbacks();
  };

  replaceMessage = (index: number, message: UI_MESSAGE) => {
    this.#messages = [
      ...this.#messages.slice(0, index),
      // We deep clone the message here to ensure the new React Compiler (currently in RC) detects deeply nested parts/metadata changes:
      this.snapshot(message),
      ...this.#messages.slice(index + 1),
    ];
    this.#callMessagesCallbacks();
  };

  snapshot = <T>(value: T): T => structuredClone(value);

  '~registerMessagesCallback' = (
    onChange: () => void,
    throttleWaitMs?: number,
  ): (() => void) => {
    const callback = throttleWaitMs
      ? throttle(onChange, throttleWaitMs)
      : onChange;
    this.#messagesCallbacks.add(callback);
    return () => {
      this.#messagesCallbacks.delete(callback);
    };
  };

  '~registerStatusCallback' = (onChange: () => void): (() => void) => {
    this.#statusCallbacks.add(onChange);
    return () => {
      this.#statusCallbacks.delete(onChange);
    };
  };

  '~registerErrorCallback' = (onChange: () => void): (() => void) => {
    this.#errorCallbacks.add(onChange);
    return () => {
      this.#errorCallbacks.delete(onChange);
    };
  };

  #callMessagesCallbacks = () => {
    this.#messagesCallbacks.forEach(callback => callback());
  };

  #callStatusCallbacks = () => {
    this.#statusCallbacks.forEach(callback => callback());
  };

  #callErrorCallbacks = () => {
    this.#errorCallbacks.forEach(callback => callback());
  };
}

function throttle(onChange: () => void, throttleWaitMs: number): () => void {
  let lastCall = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return () => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;
    
    if (timeSinceLastCall >= throttleWaitMs) {
      lastCall = now;
      onChange();
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastCall = Date.now();
        timeout = null;
        onChange();
      }, throttleWaitMs - timeSinceLastCall);
    }
  }
}

export class MyChat<UI_MESSAGE extends UIMessage> extends AbstractChat<UI_MESSAGE> {
  #state: MyChatState<UI_MESSAGE>;

  constructor({ messages, ...init }: ChatInit<UI_MESSAGE>) {
    const state = new MyChatState<UI_MESSAGE>(messages);
    super({...init,state});
    this.#state = state;
  }


  '~registerMessagesCallback' = (
    onChange: () => void,
    throttleWaitMs?: number,
  ): (() => void) =>
    this.#state['~registerMessagesCallback'](onChange, throttleWaitMs);

  '~registerStatusCallback' = (onChange: () => void): (() => void) =>
    this.#state['~registerStatusCallback'](onChange);

  '~registerErrorCallback' = (onChange: () => void): (() => void) =>
    this.#state['~registerErrorCallback'](onChange);
  
}

export function useMyChat<UI_MESSAGE extends UIMessage = UIMessage>({
  experimental_throttle: throttleWaitMs,
  resume = false,
  ...options
}: ({chat: MyChat<UI_MESSAGE>} | ChatInit<UI_MESSAGE>) & {
  experimental_throttle?: number;
  resume?: boolean;
} = {}): UseChatHelpers<UI_MESSAGE> {
  const chatRef = useRef<MyChat<UI_MESSAGE>>(
    'chat' in options ? options.chat : new MyChat<UI_MESSAGE>(options),
  );

  const shouldRecreateChat =
    ('chat' in options && options.chat !== chatRef.current) ||
    ('id' in options && chatRef.current.id !== options.id);

  if (shouldRecreateChat) {
    chatRef.current = 'chat' in options ? options.chat : new MyChat<UI_MESSAGE>(options);
  }

  const optionsId = 'id' in options ? options.id : null;

  const subscribeToMessages = useCallback(
    (update: () => void) =>
      chatRef.current['~registerMessagesCallback'](update, throttleWaitMs),
    // optionsId is required to trigger re-subscription when the chat ID changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [throttleWaitMs, optionsId],
  );

  const messages = useSyncExternalStore(
    subscribeToMessages,
    () => chatRef.current.messages,
    () => chatRef.current.messages,
  );

  const status = useSyncExternalStore(
    chatRef.current['~registerStatusCallback'],
    () => chatRef.current.status,
    () => chatRef.current.status,
  );

  const error = useSyncExternalStore(
    chatRef.current['~registerErrorCallback'],
    () => chatRef.current.error,
    () => chatRef.current.error,
  );

  const setMessages = useCallback(
    (
      messagesParam: UI_MESSAGE[] | ((messages: UI_MESSAGE[]) => UI_MESSAGE[]),
    ) => {
      if (typeof messagesParam === 'function') {
        messagesParam = messagesParam(chatRef.current.messages);
      }
      chatRef.current.messages = messagesParam;
    },
    [chatRef],
  );

  useEffect(() => {
    if (resume) {
      chatRef.current.resumeStream();
    }
  }, [resume, chatRef]);

  return {
    id: chatRef.current.id,
    messages,
    setMessages,
    sendMessage: chatRef.current.sendMessage,
    regenerate: chatRef.current.regenerate,
    clearError: chatRef.current.clearError,
    stop: chatRef.current.stop,
    error,
    resumeStream: chatRef.current.resumeStream,
    status,
    /**
     * @deprecated Use `addToolOutput` instead.
     */
    addToolResult: chatRef.current.addToolOutput,
    addToolOutput: chatRef.current.addToolOutput,
    addToolApprovalResponse: chatRef.current.addToolApprovalResponse,
  };
}
