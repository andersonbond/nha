export type Program = {
  project_prog_id?: number;
  mc_ref: string | null;
  interest_rate: number;
  delinquency_rate: number;
  max_term_yrs: number | null;
};

export const emptyProgram: Program = {
  mc_ref: "",
  interest_rate: 0,
  delinquency_rate: 0,
  max_term_yrs: null,
};
