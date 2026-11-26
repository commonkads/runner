export type ValidationFinding = {
  level: 'error' | 'warning';
  message: string;
  /** File path or domain.yml key path where the finding originates. */
  path?: string;
};
