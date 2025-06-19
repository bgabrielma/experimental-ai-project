import { ToolModel } from './domain/models';

export interface ChatCompletionResponse {
  result: Array<ToolModel> | null;
  message_from_model: string;
}
