import { serve } from 'bun';
import { generateAnswer } from './routes';

const port = process.env.API_PORT ?? 3000;

serve({
  port,
  routes: {
    '/api/generate': {
      POST: generateAnswer,
    },
  },
  error() {
    return new Response('Internal Server Error', { status: 500 });
  },
});

console.info(`MCP Client API server listening at http://localhost:${port}`);
