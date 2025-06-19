export interface BaseUseCase<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>;
}
