export interface bloodPressureHistory {
  data: Array<{
    case_note_id: number;
    date_of_visit: string;
    readings: {
      personal: {
        diastolic: number;
        systolic: number;
      };
      sit: {
        diastolic: number;
        systolic: number;
      };
      stand: {
        diastolic: number;
        systolic: number;
      };
    };
  }>;
  total: number;
  total_pages: number;
}

export interface healthOverviewHistory {
  allergies: null | string;
  has_blood_pressure_cuff: null | boolean;
  height: null | number;
  id: number;
  mobility_devices: string[];
  participant_id: number;
  reported_health_conditions: null | string;
  takes_more_than_5_medications: null | boolean;
}

export interface bloodGlucoseHistory {
  data: Array<{
    case_note_id: number;
    date_of_visit: string;
    fasting: boolean;
    result: number;
  }>;
  total: number;
  total_pages: number;
}

export interface weightHistory {
  data: Array<{
    bmi: number;
    case_note_id: number;
    date_of_visit: string;
    weight: number;
  }>;
  total: number;
  total_pages: number;
}

export interface goalHistory {
    "created_at": string;
    "goal": string;
    "hidden_from_red_cap": boolean;
    "id": number;
    "is_active": boolean;
    "participant_id": number;
    "red_cap_index": null;
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
  healthOverviewHistory?: healthOverviewHistory;
  bloodGlucoseHistory?: bloodGlucoseHistory;
  weightHistory?: weightHistory;
}

export interface PaginatedResponse<T> {
  total_pages: number;
  total: number;
  data: T[];
}
