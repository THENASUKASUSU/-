export type AssetType = 'image' | 'video' | 'audio' | 'pdf' | 'other';

export interface AssetVersion {
  id: string;
  version: number;
  url: string;
  createdAt: string;
  size: number;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  size: number;
  url: string;
  thumbnail?: string;
  tags: string[];
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
  versions: AssetVersion[];
  metadata: {
    width?: number;
    height?: number;
    duration?: number;
    pages?: number;
    mimeType: string;
  };
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface AnalyticsData {
  views: number;
  downloads: number;
  lastAccessed: string;
}
