'use client';

import { useChat } from "@ai-sdk/react";
import Image from "next/image";
import { useState } from "react";


export default function Home() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat({
    onToolCall: (toolCall) => {
      console.log('Tool called:', toolCall);
    },
    onFinish: (message) => {
      console.log('Chat finished:', message);
    },
    onData: (message) => {
      console.log('New message data:', message);
    }
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
