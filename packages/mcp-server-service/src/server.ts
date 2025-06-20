import { z } from 'zod';
import express, { Request, Response } from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

function getServer() {
  // Create an MCP server
  const mcpServer = new McpServer({
    name: 'Demo',
    version: '1.0.0',
  });

  // Add an addition tool
  mcpServer.tool(
    'add',
    'Performs addition of two numbers.',
    { a: z.number(), b: z.number() },
    async ({ a, b }) => ({
      content: [{ type: 'text', text: String(a + b) }],
    }),
  );

  // Add weather tool
  mcpServer.tool(
    'weather',
    'Get the current weather for a given city',
    { city: z.string() },
    async ({ city }) => ({
      content: [
        {
          type: 'text',
          text: `The weather in ${city} is currently sunny with a temperature of 72°F (22°C). Light breeze from the southwest at 5 mph.`,
        },
      ],
    }),
  );

  mcpServer.resource('add-info', 'resource://add-info', async (uri) => ({
    contents: [
      {
        uri: uri.href,
        text: `
The 'add' tool allows you to perform simple arithmetic addition. 
Use it when you need to add two numbers together. 
For example, if the user asks, 'What is 7 plus 5?', you can call the 'add' tool with inputs 7 and 5 to get the correct result.
        `.trim(),
      },
    ],
  }));

  // Add weather resource
  mcpServer.resource(
    'weather-info',
    'resource://weather-info',
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: `
The 'weather' tool provides current weather information for a given city.
Use it when users ask about weather conditions in a specific location.
For example, if the user asks "What's the weather like in New York?", call the 'weather' tool with city="New York".
The tool returns temperature, conditions, and wind information.
        `.trim(),
        },
      ],
    }),
  );

  return mcpServer;
}

const mcpServer = getServer();

const app = express();
app.use(express.json());

app.post('/mcp', async (req: Request, res: Response) => {
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    res.on('close', () => {
      console.info('Request closed');
      transport.close();
    });

    await mcpServer.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      });
    }
  }
});

const port = process.env.MCP_SERVER_PORT ?? 3001;
app.listen(port, () => {
  console.info(
    `MCP Stateless Streamable HTTP Server listening on port ${port}`,
  );
});
