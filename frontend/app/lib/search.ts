import type { Application } from "@/components/applications/types";
import type { Beneficiary } from "@/components/beneficiaries/types";
import type { Program } from "@/components/programs/types";
import type { Project } from "@/components/projects/types";

export type SearchResponse = {
  projects: Project[];
  programs: Program[];
  applications: Application[];
  beneficiaries: Beneficiary[];
};
