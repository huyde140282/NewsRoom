import { ApiResponse as IApiResponse, PaginatedResponse as IPaginatedResponse, ErrorResponse as IErrorResponse } from '../types/api-response.types';

// API Response classes
export class ApiResponse<T> implements IApiResponse<T> {
  success: boolean = true;
  message?: string;
  data?: T;
  meta?: ApiMeta;
  links?: ApiLinks;

  constructor(data?: T, meta?: ApiMeta, links?: ApiLinks, message?: string) {
    this.data = data;
    this.meta = meta;
    this.links = links;
    this.message = message;
  }
}

export class ApiMeta {
  total?: number;
  count?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;

  constructor(partial: Partial<ApiMeta>) {
    Object.assign(this, partial);
  }
}

export class ApiLinks {
  self?: string;
  first?: string;
  last?: string;
  next?: string;
  prev?: string;

  constructor(partial: Partial<ApiLinks>) {
    Object.assign(this, partial);
  }
}

export class PaginatedResponse<T> extends ApiResponse<T[]> {
  constructor(
    data: T[],
    total: number,
    page: number = 1,
    limit: number = 10,
    baseUrl: string = '',
    message?: string
  ) {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    const meta = new ApiMeta({
      total,
      count: data.length,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev,
    });

    const links = new ApiLinks({
      self: `${baseUrl}?page=${page}&limit=${limit}`,
      first: `${baseUrl}?page=1&limit=${limit}`,
      last: `${baseUrl}?page=${totalPages}&limit=${limit}`,
      ...(hasNext && { next: `${baseUrl}?page=${page + 1}&limit=${limit}` }),
      ...(hasPrev && { prev: `${baseUrl}?page=${page - 1}&limit=${limit}` }),
    });

    super(data, meta, links, message);
  }
}

export class ErrorResponse implements IErrorResponse {
  success: false = false;
  message: string;
  error: string;
  statusCode: number;
  timestamp: string;
  path?: string;
  details?: any;

  constructor(
    statusCode: number,
    message: string, 
    error: string,
    path?: string,
    details?: any
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
    this.timestamp = new Date().toISOString();
    this.path = path;
    this.details = details;
  }
}
