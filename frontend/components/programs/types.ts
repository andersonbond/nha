export type Program = {
  project_prog_id?: number;
  mc_ref: string | null;
  interest_rate: number;
  delinquency_rate: number;
  max_term_yrs: number | null;
  approval_status?: string | null;
  approved_at?: string | null;
  approved_by?: string | null;
  rejection_reason?: string | null;
};

export const emptyProgram: Program = {
  mc_ref: "",
  interest_rate: 0,
  delinquency_rate: 0,
  max_term_yrs: null,
};
