export interface WikiImageRef {
  sourcePath: string;
  entityKey: string;
  destinationFile: string;
  transform: 'copy' | 'rename' | 'manual';
  pages: string[];
  required: boolean;
  width?: number;
  height?: number;
}

export interface WikiPage {
  id: string;
  title: string;
  content: string;
  sourceKeys: string[];
  images: WikiImageRef[];
}

export interface WikiManifest {
  version: 1;
  generatedAt: string;
  dataDir: string;
  assetsDir: string;
  pages: WikiPage[];
  images: WikiImageRef[];
}

export interface PublishPlan {
  apiUrl: string;
  pages: { title: string; action: 'create' | 'update' | 'unchanged' }[];
  images: WikiImageRef[];
  missing: WikiImageRef[];
}
