import { BaseUseCase } from '@experimental-ai-project/shared';
import { Primitive } from 'zod';
import { MCPClientService } from '@/services';
import { LLMService } from '../boundaries';

interface Input {
  prompt: string;
}

interface Output {
  tools: Array<{ name: string; result: Primitive }> | null;
}

export class GenerateAnswerUseCase implements BaseUseCase<Input, Output> {
  constructor(
    private readonly mcpClient: MCPClientService,
    private readonly llmService: LLMService,
  ) {}

  async execute(request: Input): Promise<Output> {
    const { prompt } = request;

    try {
      const data = await this.mcpClient.retrieveMetadata();
      const { result: toolsToBeExecuted } = await this.llmService.generate(
        this.getUserPrompt(prompt, data),
      );

      if (!toolsToBeExecuted) {
        return { tools: null };
      }

      const results = await Promise.all(
        toolsToBeExecuted.map((tool) => this.mcpClient.callTool(tool)),
      );

      const showResults = results.every((result) => !!result);

      if (showResults) {
        return { tools: results };
      }
    } catch (e) {
      console.error(e);
    }

    return { tools: null };
  }

  private getUserPrompt(prompt: string, data: Record<string, unknown>) {
    return `Your only task is to return a single valid, minified JSON object based on the following user request. Do not include any markdown, backticks, or explanation.

Metadata: ${JSON.stringify(data)}
User request: ${prompt}`;
  }
}
