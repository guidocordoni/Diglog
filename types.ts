
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface GroundingMetadata {
  groundingChunks: GroundingChunk[];
  groundingSupports?: any[];
  searchEntryPoint?: any;
}

export interface ImageAttachment {
  data: string;
  mimeType: string;
}

export interface SearchState {
  query: string;
  image: ImageAttachment | null;
  isSearching: boolean;
  resultText: string | null;
  groundingMetadata: GroundingMetadata | null;
  error: string | null;
}

export enum DatabaseFilter {
  ALL = 'All Databases',
  PAS = 'Portable Antiquities Scheme',
  UKDFD = 'UK Detector Finds Database',
  MUSEUMS = 'Museum Collections'
}

export interface SavedItem {
  id: string;
  timestamp: number;
  query: string;
  image: ImageAttachment | null;
  resultText: string;
  groundingMetadata: GroundingMetadata | null;
}
