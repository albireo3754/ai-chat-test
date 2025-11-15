import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { WebSocketClientTransport } from '@modelcontextprotocol/sdk/client/websocket.js';

type MCPClientResult =
  | { ok: true; value: { client: Client } }
  | { ok: false; error: unknown };

export async function createMCPClient(url: URL): Promise<MCPClientResult> {
  try {
    const transport = new WebSocketClientTransport(url);
    const client = new Client(
      { name: 'my-app', version: '0.0.1' },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    transport.onerror = (error) => {
      console.error('MCP transport error', error);
    };

    await client.connect(transport);

    return { ok: true, value: { client } };
  } catch (error) {
    return { ok: false, error };
  }
}
