import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { fetch } from 'bun';
import { jsonrepair } from 'jsonrepair';
import { LLMService } from '@/domain/boundaries';
import { Role } from '@/types';
import { ChatCompletionResponse } from '@/interfaces';
import { transformToTools } from '@/utils';

export class GemmaLLMService implements LLMService {
  private readonly url: string;
  private modelName: string;
  private static systemPrompt: string;

  constructor() {
    const url = process.env.GEMMA_LLM_ENGINE_CHAT_URL;
    const modelName = process.env.GEMMA_LLM_ENGINE_MODEL_NAME;

    if (!url || !modelName) {
      throw new Error('Missing environment variables for Gemma LLM service');
    }

    this.url = url;
    this.modelName = modelName;
  }

  public async generate(prompt: string): Promise<ChatCompletionResponse> {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            {
              role: Role.system,
              content: this.getSystemPrompt(),
            },
            {
              role: Role.user,
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const choice = data.choices[0];
      const messageFromModel = choice?.message?.content;

      return {
        result: this.parseResult(messageFromModel),
        message_from_model: messageFromModel,
      };
    } catch (error) {
      throw new Error(
        `Failed to generate response from Gemma LLM: ${error instanceof Error ? error.message : ''}`,
      );
    }
  }

  /**
   * Parses a string message from an AI, which may contain extraneous characters
   * like markdown fences and newlines, to extract and return a valid JSON object.
   *
   * @param message The raw string message from the AI response.
   * @returns A parsed JavaScript object, or null if no valid JSON can be found.
   */
  private parseResult(message?: string) {
    if (!message) {
      return null;
    }
    const jsonMatch = message.match(/{.*}/s);

    if (!jsonMatch) {
      return null;
    }
    const potentialJsonString = jsonrepair(jsonMatch[0]);

    try {
      const rawData = JSON.parse(potentialJsonString) as Record<
        string,
        unknown
      >;

      return transformToTools(rawData);
    } catch {
      console.error('String that failed parsing:', potentialJsonString);
      return null;
    }
  }

  private getSystemPrompt(): string {
    if (GemmaLLMService.systemPrompt) {
      return GemmaLLMService.systemPrompt;
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const promptPath = join(__dirname, '../prompts/system-prompt.txt');

    if (!existsSync(promptPath)) {
      throw new Error(`System prompt file not found: ${promptPath}`);
    }

    const systemPrompt = readFileSync(promptPath, 'utf-8').trim();

    if (!systemPrompt) {
      throw new Error('System prompt file is empty');
    }

    return (GemmaLLMService.systemPrompt = systemPrompt);
  }
}
