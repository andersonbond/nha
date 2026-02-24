export type Application = {
  app_id: string;
  prequalification_no?: string | null;
  origin?: string | null;
  indicator?: string | null;
  tenurial_code?: string | null;
  application_type?: string | null;
  current_addr?: string | null;
  last_name?: string | null;
  first_name?: string | null;
  middle_name?: string | null;
  birth_date?: string | null;
  sex?: string | null;
  civil_status?: string | null;
  address?: string | null;
  region_code?: string | null;
  province_code?: string | null;
  municipal_code?: string | null;
  barangay_code?: string | null;
  district_code?: string | null;
  valid_id_image?: string | null;
  valid_id_type?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export const emptyApplication: Omit<Application, "app_id"> & { app_id?: string } = {
  prequalification_no: "",
  origin: "",
  indicator: "",
  tenurial_code: "",
  application_type: "",
  current_addr: "",
  last_name: "",
  first_name: "",
  middle_name: "",
  birth_date: null,
  sex: "",
  civil_status: "",
  address: "",
  region_code: "",
  province_code: "",
  municipal_code: "",
  barangay_code: "",
  district_code: "",
  valid_id_image: "",
  valid_id_type: "",
  created_at: null,
  updated_at: null,
};
