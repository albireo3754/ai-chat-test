import { bedrock } from '@ai-sdk/amazon-bedrock';
import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // const messages = [messages.at(messages.length - 1)!]

  console.log('Received messages:', messages.map(m => ({ role: m.role, parts: m.parts.map(p => p.type === 'text' ? p.text : p.type) })));

  const result = streamText({
    model: bedrock('apac.anthropic.claude-3-sonnet-20240229-v1:0'),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}