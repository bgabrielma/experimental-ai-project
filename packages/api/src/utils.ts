import { ToolModel } from './domain/models';

/**
 * Transforms raw data into an array of ToolModel objects
 * @param rawData - The raw data object containing tool information
 * @returns An array of ToolModel objects or null if validation fails
 */
export const transformToTools = (
  rawData: Record<string, unknown>,
): ToolModel[] | null => {
  const order = rawData?.order;

  if (!order || typeof order !== 'object') {
    return null;
  }

  if (!('tools' in order) || !Array.isArray(order.tools)) {
    return null;
  }

  const availableTools = order.tools;

  const invalidArgumentsPerTool = availableTools.some(
    (tool: unknown) => !validateTool(tool),
  );

  if (invalidArgumentsPerTool) {
    return null;
  }

  return availableTools as ToolModel[];
};

/**
 * Validates if a tool object has the required properties and types
 * @param tool - The tool object to validate
 * @returns boolean indicating if the tool is valid
 */
const validateTool = (tool: unknown): boolean => {
  if (!tool || typeof tool !== 'object') {
    return false;
  }

  if (!('name' in tool) || typeof tool.name !== 'string') {
    return false;
  }

  if (!('arguments' in tool) || typeof tool.arguments !== 'object') {
    return false;
  }

  return true;
};
