import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { configDotenv } from 'dotenv';
import {
  convertToModelMessages,
  jsonSchema,
  streamText,
  type JSONSchema7,
  type UIMessage,
} from 'ai';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

configDotenv();

const bedrock = createAmazonBedrock({
  region: 'ap-northeast-2',
  credentialProvider: fromNodeProviderChain(),
});

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

  const toolEntries = (tools ?? []).flatMap((tool) => {
    const { name, inputSchema, description } = tool ?? {};

    if (!name || !inputSchema) {
      console.warn(`Skipping invalid tool definition`, tool);
      return [];
    }

    try {
      return [
        [
          name,
          {
            description: description || name,
            inputSchema: jsonSchema(inputSchema as JSONSchema7),
          },
        ] as const,
      ];
    } catch (error) {
      console.warn(`Failed to convert tool schema for ${name}:`, error);
      return [];
    }
  });

  const aiTools =
    toolEntries.length > 0 ? Object.fromEntries(toolEntries) : undefined;

  const selectedModel =
    model ?? 'apac.anthropic.claude-3-sonnet-20240229-v1:0';

  const result = streamText({
    model: bedrock(selectedModel),
    tools: aiTools,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
