# Experimental AI Project

A monorepo containing AI services built with Bun, implementing the Model Context Protocol (MCP) for AI task orchestration.

## Project Structure

```
experimental-ai-project/
├── packages/
│   ├── api/                # Main API service
│   ├── mcp-server-service/ # MCP server implementation
│   └── shared/            # Shared utilities and types
├── scripts/
│   └── setup-gemma3.sh    # Docker setup script for Gemma model
├── bun.lockb
├── package.json
└── README.md
```

## Prerequisites

- [Bun](https://bun.sh/) (latest version)
- [Docker](https://www.docker.com/) (for running the Gemma model)

## Initial Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd experimental-ai-project
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   MODEL_NAME=gemma3:latest
   API_PORT=3001
   MCP_SERVER_PORT=3000
   ```

4. **Set up Docker and pull the Gemma model**:
   ```bash
   # Make the setup script executable
   chmod +x scripts/setup-gemma3.sh
   
   # Run the setup script
   ./scripts/setup-gemma3.sh
   ```

## Running the Services

You'll need to run both the MCP server and the API service in separate terminal windows.

1. **Terminal 1 - Start the MCP Server**:
   ```bash
   cd packages/mcp-server-service
   bun run dev
   ```
   The MCP server will start on port 3000 (or your configured MCP_SERVER_PORT).

2. **Terminal 2 - Start the API Service**:
   ```bash
   cd packages/api
   bun run dev
   ```
   The API service will start on port 3001 (or your configured API_PORT).

## Testing the Setup

You can test the setup by sending a request to generate an answer:

```bash
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What is the sum of 5 and 7?"
  }'
```

Expected response:
```json
{
  "tools": [
    {
      "name": "add",
      "result": "12"
    }
  ]
}
```

## Available Services

### API Service (packages/api)
- Main interface for generating AI-powered answers
- Integrates with MCP server for tool execution
- Endpoint: POST `/api/generate`

### MCP Server Service (packages/mcp-server-service)
- Implements Model Context Protocol
- Provides tools for basic operations (addition, weather info)
- Endpoint: POST `/mcp`

## Development Scripts

Each package has the following scripts:
- `bun run dev` - Start development server with hot reload
- `bun run start` - Start production server

## Troubleshooting

1. **Docker Issues**:
   - Ensure Docker is running: `docker ps`
   - Check model status: `docker model status gemma3:latest`
   - Restart Docker if needed

2. **Port Conflicts**:
   - Check if ports 3000 and 3001 are available
   - Modify ports in .env file if needed

3. **Model Issues**:
   - Run `./scripts/setup-gemma3.sh` to verify model setup
   - Check Docker logs for model-related errors

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
