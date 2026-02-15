export type Project = {
  project_code: string;
  project_name: string;
  total_area: number | null;
  project_cost: number | null;
  region_code: string;
  province_code: string;
  inp_date: string;
  downpayment: number | null;
  monthly_amortization: number | null;
  interest_rate: number | null;
  selling_price: number | null;
  terms_yr: number | null;
  lot_type: string;
};

export const emptyProject: Project = {
  project_code: "",
  project_name: "",
  total_area: null,
  project_cost: null,
  region_code: "",
  province_code: "",
  inp_date: "",
  downpayment: null,
  monthly_amortization: null,
  interest_rate: null,
  selling_price: null,
  terms_yr: null,
  lot_type: "",
};
