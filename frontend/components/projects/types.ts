export type Project = {
  project_code: string;
  project_name?: string | null;
  project_prog_id?: number | null;
  total_area?: number | null;
  project_cost?: number | null;
  region_code?: string | null;
  province_code?: string | null;
  municipal_code?: string | null;
  barangay_code?: string | null;
  district_code?: string | null;
  inp_date?: string | null;
  created_at?: string | null;
  downpayment?: number | null;
  monthly_amortization?: number | null;
  interest_rate?: number | null;
  selling_price?: number | null;
  terms_yr?: number | null;
  lot_type?: string | null;
  approval_status?: string | null;
  approved_at?: string | null;
  approved_by?: string | null;
  rejection_reason?: string | null;
};

export const emptyProject: Project = {
  project_code: "",
  project_name: "",
  project_prog_id: null,
  total_area: null,
  project_cost: null,
  region_code: "",
  province_code: "",
  municipal_code: "",
  barangay_code: "",
  district_code: "",
  inp_date: "",
  downpayment: null,
  monthly_amortization: null,
  interest_rate: null,
  selling_price: null,
  terms_yr: null,
  lot_type: "",
};
