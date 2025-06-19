import { ChatCompletionResponse } from '@/interfaces';

export interface LLMService {
  generate(prompt: string): Promise<ChatCompletionResponse>;
}
