import { GenerateAnswerUseCase } from '@/domain/usecases';
import { GemmaLLMService, MCPClientService } from '@/services';

export async function generateAnswer(req: Request) {
  const body = (await req.json()) as { prompt: string };

  if (!body?.prompt) {
    return Response.json(
      {
        error: 'Missing prompt on payload',
      },
      {
        status: 400,
      },
    );
  }

  const mcpClient = new MCPClientService();
  const llmService = new GemmaLLMService();

  const generateAnswerUseCase = new GenerateAnswerUseCase(
    mcpClient,
    llmService,
  );

  const result = await generateAnswerUseCase.execute({
    prompt: body.prompt,
  });

  return Response.json(result);
}
