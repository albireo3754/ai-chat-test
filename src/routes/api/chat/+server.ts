import { createOpenAI } from '@ai-sdk/openai';
import { streamText, type UIMessage, convertToModelMessages } from 'ai';

import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { configDotenv } from 'dotenv';

configDotenv();

const bedrock = createAmazonBedrock({
  region: 'ap-northeast-2',
  credentialProvider: fromNodeProviderChain(),
});

// const openai = createOpenAI({
//   apiKey: OPENAI_API_KEY,
// })'

export async function POST({ request }) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model:bedrock('apac.anthropic.claude-3-sonnet-20240229-v1:0'),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}