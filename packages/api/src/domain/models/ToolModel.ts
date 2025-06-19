import { Primitive } from 'zod';

export interface ToolModel {
  name: string;
  arguments: Record<string, Primitive>;
}
