export interface ApiResponse<T> {
   data: T;
   message?: string;
   success: boolean;
}

export interface PaginationParams {
   page: number;
   limit: number;
   sortBy?: string;
   sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
   data: T[];
   total: number;
   page: number;
   limit: number;
   totalPages: number;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';