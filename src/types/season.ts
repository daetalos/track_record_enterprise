// Season-related types for API requests and responses

export interface Season {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    disciplines: number;
  };
}

export interface SeasonCreateRequest {
  name: string;
  description?: string | null;
}

export interface SeasonUpdateRequest {
  name?: string;
  description?: string | null;
}

export interface SeasonResponse {
  success: boolean;
  data: Season;
  message?: string;
}

export interface SeasonsListResponse {
  success: boolean;
  data: Season[];
}

export interface SeasonErrorResponse {
  error: string;
  details?: unknown;
}
