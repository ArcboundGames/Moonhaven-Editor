export type DiagnosticSeverity = 'error' | 'warning';

export interface ContentDiagnostic {
  severity: DiagnosticSeverity;
  code: string;
  file: string;
  section?: string;
  entity?: string;
  message: string;
}

export interface AssetRequirement {
  sourcePath: string;
  entityKey: string;
  kind: 'runtime' | 'wiki';
  width?: number;
  height?: number;
  required: boolean;
  status: 'current' | 'missing' | 'wrong-size' | 'manual';
}

export interface ValidatedContentGraph {
  dataDir: string;
  assetsDir: string;
  files: Record<string, unknown>;
  diagnostics: ContentDiagnostic[];
  assets: AssetRequirement[];
}

export interface WikiPage {
  id: string;
  title: string;
  content: string;
  sourceKeys: string[];
}

export interface PublishPlan {
  apiUrl: string;
  pages: WikiPage[];
  assets: AssetRequirement[];
}
