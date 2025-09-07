// API Response types cho backend
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: ApiMeta;
  links?: ApiLinks;
}

export interface ApiMeta {
  total?: number;
  count?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface ApiLinks {
  self?: string;
  first?: string;
  last?: string;
  next?: string;
  prev?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  meta: ApiMeta;
  links: ApiLinks;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  statusCode: number;
  timestamp: string;
  path?: string;
  details?: any;
}
