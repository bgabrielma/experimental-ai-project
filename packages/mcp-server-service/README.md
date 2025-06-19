# MCP Server Service

Model Context Protocol (MCP) server for the experimental AI project. This service implements a stateless HTTP server that provides tools and resources for AI-powered operations.

## Features

- MCP-compliant server implementation
- Stateless HTTP transport layer
- Built-in tools for basic operations
- Resource documentation for AI guidance
- JSON-RPC 2.0 compatible API
- Built with Express.js and MCP SDK

## Available Tools

### 1. Addition Tool
- **Name:** `add`
- **Description:** Performs addition of two numbers
- **Parameters:**
  ```typescript
  {
    a: number;
    b: number;
  }
  ```
- **Returns:** Text content with the sum result

### 2. Weather Tool
- **Name:** `weather`
- **Description:** Get the current weather for a given city
- **Parameters:**
  ```typescript
  {
    city: string;
  }
  ```
- **Returns:** Text content with weather information including temperature and wind conditions

## Available Resources

### 1. Addition Info
- **URI:** `resource://add-info`
- **Purpose:** Provides guidance on using the addition tool
- **Content:** Documentation and examples for the add tool

### 2. Weather Info
- **URI:** `resource://weather-info`
- **Purpose:** Provides guidance on using the weather tool
- **Content:** Documentation and examples for the weather tool

## Installation

Run the following command to install dependencies:
```bash
bun install
```

## Environment Variables

- `MCP_SERVER_PORT` - Port number for the MCP server (default: 3000)

## Scripts

- `bun run dev` - Start development server
- `bun run start` - Start production server

## API Endpoint

### MCP Request Handler
- **URL:** `/mcp`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Protocol:** JSON-RPC 2.0
- **Error Response:**
  - **Code:** 500
  - **Content:**
    ```json
    {
      "jsonrpc": "2.0",
      "error": {
        "code": -32603,
        "message": "Internal server error"
      },
      "id": null
    }
    ```

## Usage

1. Start the server:
```bash
bun run dev
```

2. The server will be available at `http://localhost:3000/mcp` (or your configured port)

3. Send MCP-compliant JSON-RPC 2.0 requests to interact with the available tools and resources

## Implementation Details

The server is built using:
- Express.js for HTTP handling
- `@modelcontextprotocol/sdk` for MCP implementation
- Zod for runtime type validation
- StreamableHTTPServerTransport for stateless HTTP communication

The server maintains no state between requests and uses the MCP SDK's built-in session management capabilities.
