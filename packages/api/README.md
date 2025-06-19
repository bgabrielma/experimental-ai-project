# API Package

This package provides the REST API server for the experimental AI project. It serves as an interface for generating AI-powered answers using the Gemma LLM service and MCP Client service.

## Features

- AI-powered answer generation using Gemma LLM
- Integration with Model Context Protocol (MCP) Client
- Built with Bun for high performance
- Type-safe API endpoints

## Installation

```bash
bun install
```

## Environment Variables

- `API_PORT` - Port number for the API server (default: 3000)

## Scripts

- `bun run dev` - Start the development server
- `bun run start` - Start the production server

## API Endpoints

### Generate Answer
- **URL:** `/api/generate`
- **Method:** `POST`
- **Request Body:**
  ```typescript
  {
    prompt: string;  // The prompt to generate an answer for
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:** 
    ```typescript
    {
      tools: Array<{
        name: string;     // Name of the tool that was executed
        result: Primitive // The result from the tool execution (string, number, boolean, etc.)
      }> | null          // null if no tools were executed or if there was an error
    }
    ```
- **Error Response:**
  - **Code:** 400
  - **Content:** `{ "error": "Missing prompt on payload" }`
  - **Code:** 500
  - **Content:** `"Internal Server Error"`

**Note:** The API processes the prompt through a Gemma LLM service to determine which tools to execute. It then executes these tools in parallel using the MCP Client service. If all tools execute successfully, their results are returned in the `tools` array. If any tool fails or no tools are identified for execution, `tools` will be `null`.

## Architecture

The API is built using a clean architecture approach with:
- Domain-driven design principles
- Use case based business logic
- Service layer abstraction for external dependencies (Gemma LLM and MCP Client)

## Usage Example

```typescript
// Using fetch
const response = await fetch('http://localhost:3000/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'Your prompt here',
  }),
});

const result = await response.json();
```