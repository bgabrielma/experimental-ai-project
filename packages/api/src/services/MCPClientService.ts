import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { ToolModel } from '@/domain/models';

export class MCPClientService {
  private static client: Client;
  private readonly mcpServerUrl: string;

  constructor() {
    const mcpServerUrl = process.env.MCP_SERVER_URL;

    if (!mcpServerUrl) {
      throw new Error('Missing MCP_SERVER_URL environment variable');
    }

    this.mcpServerUrl = mcpServerUrl;

    if (!MCPClientService.client) {
      MCPClientService.client = new Client({
        name: 'api-mcp-client',
        version: '1.0.0',
      });
    }
  }

  public async retrieveMetadata() {
    const client = MCPClientService.client;

    const transport = new StreamableHTTPClientTransport(
      new URL(this.mcpServerUrl),
    );
    await client.connect(transport);

    const toolsList = await client.listTools();
    const tools = toolsList.tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
      outputSchema: tool.outputSchema,
    }));

    const resourcesList = await client.listResources();
    const resources = await this.getResourcesInfo(resourcesList.resources);

    return {
      tools,
      resources,
    };
  }

  public async callTool(tool: ToolModel) {
    const result = await MCPClientService.client.callTool({
      name: tool.name,
      arguments: tool.arguments,
    });

    if (result.isError) {
      return undefined;
    }

    const resultContent = result.content;
    const resultValue = Array.isArray(resultContent)
      ? resultContent[0].text
      : null;

    return {
      name: tool.name,
      result: resultValue,
    };
  }

  private async getResourcesInfo(resourcesList: Resource[]) {
    const resourceDetails = [];

    for (const resource of resourcesList) {
      const details = await MCPClientService.client.readResource({
        uri: resource.uri,
      });

      resourceDetails.push({ ...details.contents[0] });
    }

    return resourceDetails;
  }
}
