export type DocumentRecord = {
  id: string;
  title: string;
  content_md: string;
  version?: number;
  updated?: string;
  created?: string;
};

export type AssetRecord = {
  id: string;
  doc: string; // relation to documents
  file: string; // PB file field name
  created?: string;
};
