export type TraceStep<TState = unknown> = {
  id: string;
  title: string;
  description: string;
  state: TState;
  highlights?: Record<string, unknown>;
  pseudoCodeLine?: number;
  codeLineHighlights?: Record<string, number[]>;
};
