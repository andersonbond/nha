export type Beneficiary = {
  id?: number;
  bin?: string | null;
  app_id?: string | null;
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
  membership_code?: string | null;
  old_common_code?: string | null;
  common_code?: string | null;
  act_tag?: string | null;
  indicator?: string | null;
  inp_date?: string | null;
  ssp?: string | null;
  category?: string | null;
};

export const emptyBeneficiary: Beneficiary = {
  bin: "",
  app_id: "",
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
  membership_code: "",
  old_common_code: "",
  common_code: "",
  act_tag: "",
  indicator: "",
  inp_date: null,
  ssp: "",
  category: "",
};
