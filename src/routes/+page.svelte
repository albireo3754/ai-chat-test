<script lang="ts">
  import { onMount } from 'svelte';
  import { createChatStore } from '$lib/chat';
  import { createMCPClient } from '$lib/mcp/create-client';
  import { createSmitheryUrl } from '@smithery/sdk/shared/config.js';
  import type { Client } from '@modelcontextprotocol/sdk/client/index.js';
  import type { Tool as MCPTool } from '@modelcontextprotocol/sdk/types.js';

  const SMITHERY_SERVER_URL = import.meta.env.VITE_SMITHERY_SERVER_URL ?? '';
  const SMITHERY_API_KEY = import.meta.env.VITE_SMITHERY_API_KEY ?? '';
  const SMITHERY_PROFILE = import.meta.env.VITE_SMITHERY_PROFILE ?? '';

  let input = '';
  let client: Client | null = null;
  let remoteTools: MCPTool[] = [];
  let customTools: MCPTool[] = [];
  let connectionError: string | null = null;
  let isConnecting = false;
  let toolFormJson = `{
  "name": "echo",
  "description": "Echo the provided input.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "value": {
        "type": "string",
        "description": "Text to echo back"
      }
    },
    "required": ["value"]
  }
}`;
  const chat = createChatStore({
    onToolCall: async ({ toolCall }) => {
      if (toolCall.dynamic) {
        return;
      }

      if (!client) {
        await chat.addToolResult({
          tool: toolCall.toolName as never,
          toolCallId: toolCall.toolCallId,
          state: 'output-error',
          errorText: 'MCP client not connected',
        });
        return;
      }

      try {
        const toolArguments =
          (toolCall.input as Record<string, unknown> | undefined) ?? {};

        const result = await client.callTool({
          name: toolCall.toolName,
          arguments: toolArguments,
        });

        let output = 'Tool executed successfully';
        if (Array.isArray(result?.content)) {
          const textContent = result.content
            .filter((item) => item.type === 'text')
            .map((item) => item.text)
            .join('\n')
            .trim();
          if (textContent) {
            output = textContent;
          }
        }

        await chat.addToolResult({
          tool: toolCall.toolName as never,
          toolCallId: toolCall.toolCallId,
          output,
        });
      } catch (error) {
        await chat.addToolResult({
          tool: toolCall.toolName as never,
          toolCallId: toolCall.toolCallId,
          state: 'output-error',
          errorText:
            error instanceof Error ? error.message : 'Tool execution failed',
        });
      }
    },
  });

  let toolFormError: string | null = null;
  let selectedModel = 'apac.anthropic.claude-3-sonnet-20240229-v1:0';

  $: allTools = [...remoteTools, ...customTools];
  $: status = chat.status;

  onMount(() => {
    let disposed = false;

    const connect = async () => {
      if (!SMITHERY_SERVER_URL || !SMITHERY_API_KEY || !SMITHERY_PROFILE) {
        connectionError =
          'Set VITE_SMITHERY_SERVER_URL, VITE_SMITHERY_API_KEY, and VITE_SMITHERY_PROFILE to enable tool discovery.';
        return;
      }

      isConnecting = true;
      connectionError = null;

      try {
        const connectionUrl = createSmitheryUrl(SMITHERY_SERVER_URL, {
          apiKey: SMITHERY_API_KEY,
          profile: SMITHERY_PROFILE,
        });

        const result = await createMCPClient(connectionUrl);
        if (!result.ok) {
          throw result.error;
        }

        if (disposed) {
          await result.value.client.close();
          return;
        }

        client = result.value.client;

        try {
          const toolsResult = await client.listTools();
          remoteTools = toolsResult.tools ?? [];
        } catch (toolsError) {
          console.warn('Failed to list tools:', toolsError);
          remoteTools = [];
        }
      } catch (error) {
        console.error('Failed to connect to MCP server:', error);
        client = null;
        remoteTools = [];
        connectionError =
          error instanceof Error ? error.message : 'Connection failed';
      } finally {
        isConnecting = false;
      }
    };

    void connect();

    return () => {
      disposed = true;
      if (client) {
        void client.close().catch((closeError) => {
          console.error('Failed to close MCP client', closeError);
        });
      }
    };
  });

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSendMessage();
    }
  }

  async function handleSendMessage() {
    if (!input.trim() || status === 'streaming') {
      return;
    }

    await chat.sendMessage(
      { text: input },
      {
        body: {
          model: selectedModel,
          tools: allTools,
        },
      },
    );

    input = '';
  }

  function handleAddTool() {
    try {
      const parsed = JSON.parse(toolFormJson) as MCPTool;

      if (!parsed.name || typeof parsed.name !== 'string') {
        throw new Error('Tool must include a string "name"');
      }

      if (!parsed.inputSchema) {
        throw new Error('Tool must include an "inputSchema" object');
      }

      const existingIndex = customTools.findIndex(
        (tool) => tool.name === parsed.name,
      );

      if (existingIndex >= 0) {
        customTools = [
          ...customTools.slice(0, existingIndex),
          parsed,
          ...customTools.slice(existingIndex + 1),
        ];
      } else {
        customTools = [...customTools, parsed];
      }

      toolFormError = null;
    } catch (error) {
      toolFormError =
        error instanceof Error ? error.message : 'Invalid tool definition';
    }
  }

  function removeCustomTool(name: string) {
    customTools = customTools.filter((tool) => tool.name !== name);
  }

  function isToolUIPart(part: unknown): part is {
    type: string;
    toolCallId: string;
    state?: string;
    output?: unknown;
    errorText?: string;
  } {
    if (!part || typeof part !== 'object') {
      return false;
    }

    const candidate = part as Record<string, unknown>;
    return (
      typeof candidate.type === 'string' &&
      candidate.type.startsWith('tool-') &&
      typeof candidate.toolCallId === 'string'
    );
  }
</script>

<main class="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 p-6">
  <section class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <header class="mb-3 flex items-center justify-between">
      <h2 class="text-lg font-semibold">Available Tools</h2>
      {#if isConnecting}
        <span class="text-sm text-gray-500">Connecting…</span>
      {/if}
    </header>

    {#if connectionError}
      <p class="text-sm text-red-600">{connectionError}</p>
    {:else if allTools.length === 0}
      <p class="text-sm text-gray-500">
        No tools detected. Add one manually or verify the server connection.
      </p>
    {:else}
      <ul class="flex flex-col gap-2">
        {#each allTools as tool (tool.name)}
          <li class="rounded border border-gray-100 bg-gray-50 p-3">
            <div class="flex items-center justify-between">
              <span class="font-medium">{tool.name}</span>
              {#if customTools.some(({ name }) => name === tool.name)}
                <button
                  class="text-sm text-red-500 hover:underline"
                  type="button"
                  on:click={() => removeCustomTool(tool.name)}
                >
                  Remove
                </button>
              {/if}
            </div>
            {#if tool.description}
              <p class="mt-1 text-sm text-gray-600">{tool.description}</p>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}

    <details class="mt-4 rounded border border-dashed border-gray-300 p-3">
      <summary class="cursor-pointer font-medium">Add or update tool</summary>
      <p class="mt-2 text-sm text-gray-600">
        Provide an MCP tool JSON definition. Existing tools with the same name
        will be replaced.
      </p>
      <textarea
        class="mt-2 w-full rounded border border-gray-200 p-2 font-mono text-sm"
        rows="10"
        bind:value={toolFormJson}
      ></textarea>
      {#if toolFormError}
        <p class="mt-2 text-sm text-red-600">{toolFormError}</p>
      {/if}
      <div class="mt-2 flex justify-end">
        <button
          class="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-500"
          type="button"
          on:click={handleAddTool}
        >
          Save tool
        </button>
      </div>
    </details>
  </section>

  <section class="flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
    <header class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
      <h2 class="text-lg font-semibold">Conversation</h2>
      <label class="flex items-center gap-2 text-sm text-gray-600">
        <span>Model</span>
        <input
          class="w-96 rounded border border-gray-300 px-2 py-1 text-sm"
          bind:value={selectedModel}
          placeholder="Enter model identifier"
        />
      </label>
    </header>

    <div class="flex h-full flex-col justify-between">
      <div class="flex-1 overflow-y-auto px-4 py-3">
        <ul class="flex flex-col gap-3">
          {#each chat.messages as message, messageIndex (messageIndex)}
            <li class="rounded border border-gray-100 bg-gray-50 p-3">
              <div class="text-sm font-semibold text-gray-700">
                {message.role === 'user' ? 'You' : 'Assistant'}
              </div>
              <div class="mt-2 space-y-2">
                {#each message.parts as part, partIndex (partIndex)}
                  {#if part.type === 'text'}
                    <p class="whitespace-pre-wrap text-sm leading-relaxed">
                      {part.text}
                    </p>
                  {:else if isToolUIPart(part)}
                    {#if part.state === 'input-streaming'}
                      <div class="rounded border border-blue-200 bg-blue-50 p-2 text-sm text-blue-700">
                        Preparing {part.type.replace('tool-', '')}…
                      </div>
                    {:else if part.state === 'input-available'}
                      <div class="rounded border border-blue-200 bg-blue-50 p-2 text-sm text-blue-700">
                        Executing {part.type.replace('tool-', '')}…
                      </div>
                    {:else if part.state === 'output-available'}
                      <div class="rounded border border-green-200 bg-green-50 p-2 text-sm text-green-700">
                        <strong>
                          {part.type.replace('tool-', '')} result:
                        </strong>
                        {' '}
                        {String(part.output)}
                      </div>
                    {:else if part.state === 'output-error'}
                      <div class="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                        Error in {part.type.replace('tool-', '')}: {part.errorText}
                      </div>
                    {/if}
                  {/if}
                {/each}
              </div>
            </li>
          {/each}

          {#if status === 'streaming'}
            <li class="rounded border border-gray-100 bg-gray-50 p-3">
              <div class="text-sm font-semibold text-gray-700">Assistant</div>
              <div class="mt-2 animate-pulse text-sm text-gray-600">
                Thinking…
              </div>
            </li>
          {/if}
        </ul>
      </div>
    </div>
  </section>

  <form
    class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    on:submit|preventDefault={handleSendMessage}
  >
    <label class="sr-only" for="chat-input">Message</label>
    <textarea
      id="chat-input"
      class="h-28 w-full resize-none rounded border border-gray-300 p-3 text-sm"
      placeholder="Ask anything…"
      bind:value={input}
      on:keydown={handleKeyDown}
      disabled={status === 'streaming'}
    ></textarea>
    <div class="mt-3 flex items-center justify-end gap-2">
      <span class="text-sm text-gray-500">
        Press Enter to send, Shift + Enter for a new line.
      </span>
      <button
        class="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        type="submit"
        disabled={!input.trim() || status === 'streaming'}
      >
        Send
      </button>
    </div>
  </form>
</main>
