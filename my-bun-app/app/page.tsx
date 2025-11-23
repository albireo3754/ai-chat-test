'use client';

import { Chat, useChat } from "@ai-sdk/react";
import { AbstractChat, ChatInit, ChatState, ChatStatus, DefaultChatTransport, UIMessage } from "ai";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { MyChat, MyChatState, useMyChat } from "./chat";


export default function Home() {
  const [input, setInput] = useState('');
  const chatRef = useRef<MyChat<UIMessage>>(
    new MyChat<UIMessage>({
      id: 'my-chat',
    }),
  );
  const { messages, sendMessage } = useMyChat({
    chat: chatRef.current
  });
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
          {messages.map(message => (
            <div key={message.id} className="whitespace-pre-wrap">
              {message.role === 'user' ? 'User: ' : 'AI: '}
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return <div key={`${message.id}-${i}`}>{part.text}</div>;
                }
              })}
            </div>
          ))}

          <form
            onSubmit={e => {
              e.preventDefault();
              sendMessage({ text: input });
              setInput('');
            }}
          >
            <input
              className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
              value={input}
              placeholder="Say something..."
              onChange={e => setInput(e.currentTarget.value)}
            />
      </form>
    </div>
      </main>
    </div>
  );
}
