export interface ParticipantLookupResponse {
  id: number;
  first_name: string;
  last_name: string;
  phone_number_one?: string;
  phone_number_two?: string;
  program: string;
  location: number;
}

export interface PaginatedResponse<T> {
  total_pages: number;
  total: number;
  data: T[];
}
