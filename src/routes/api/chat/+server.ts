import { createOpenAI } from '@ai-sdk/openai';
import { streamText, type UIMessage, convertToModelMessages, jsonSchema, type JSONSchema7 } from 'ai';

import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { configDotenv } from 'dotenv';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

configDotenv();

const bedrock = createAmazonBedrock({
  region: 'ap-northeast-2',
  credentialProvider: fromNodeProviderChain(),
});

// const openai = createOpenAI({
//   apiKey: OPENAI_API_KEY,
// })'

export async function POST({ request }) {
    const { 
    model, 
    messages,
    tools,
  }: { 
    messages: UIMessage[]; 
    model?: string;
    tools?: Tool[];
  } = await request.json();

  // Convert MCP tools to AI SDK format
  const aiTools = Object.fromEntries( 
    (tools || []).map(tool => [ 
      tool.name, 
      { 
        description: tool.description || tool.name, 
        inputSchema: jsonSchema(tool.inputSchema as JSONSchema7), 
      }, 
    ]), 
  ); 


  const result = streamText({
    model:bedrock('apac.anthropic.claude-3-sonnet-20240229-v1:0'),
    tools: aiTools,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}