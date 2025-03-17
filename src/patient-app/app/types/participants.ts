export interface bloodPressureHistory {
  "data": Array<
    {
      "case_note_id": number;
      "date_of_visit": string;
      "readings": {
        "personal": {
          "diastolic": number;
          "systolic": number;
        };
        "sit": {
          "diastolic": number;
          "systolic": number;
        };
        "stand": {
          "diastolic": number;
          "systolic": number;
        }
      }
    }>;
  "total": number;
  "total_pages": number;
}

export interface ParticipantLookupResponse {
  id: number;
  first_name: string;
  last_name: string;
  phone_number_one?: string;
  phone_number_two?: string;
  program: string;
  location: number;
  bloodPressureHistory?: bloodPressureHistory;
}

export interface PaginatedResponse<T> {
  total_pages: number;
  total: number;
  data: T[];
}
