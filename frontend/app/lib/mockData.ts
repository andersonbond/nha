/**
 * In-memory mock API for frontend when backend is disconnected.
 * Used when NEXT_PUBLIC_USE_MOCK_DATA=true.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

type Project = {
  project_code: string;
  project_name?: string | null;
  project_prog_id?: number | null;
  total_area?: number | null;
  project_cost?: number | null;
  region_code?: string | null;
  province_code?: string | null;
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

type Program = {
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

type Application = {
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
  valid_id_image?: string | null;
  valid_id_type?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type Beneficiary = {
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
  membership_code?: string | null;
  old_common_code?: string | null;
  common_code?: string | null;
  act_tag?: string | null;
  indicator?: string | null;
  inp_date?: string | null;
  ssp?: string | null;
  category?: string | null;
};

function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const initialPrograms: Program[] = [
  { project_prog_id: 1, mc_ref: "MC-2024-001", interest_rate: 6.5, delinquency_rate: 2, max_term_yrs: 25, approval_status: "approved" },
  { project_prog_id: 2, mc_ref: "MC-2024-002", interest_rate: 5.0, delinquency_rate: 1.5, max_term_yrs: 20, approval_status: "approved" },
  { project_prog_id: 3, mc_ref: "Socialized", interest_rate: 0, delinquency_rate: 0, max_term_yrs: 30, approval_status: "approved" },
];

const initialProjects: Project[] = [
  {
    project_code: "PROJ-001",
    project_name: "Northville Resettlement",
    project_prog_id: 1,
    total_area: 50000,
    project_cost: 120000000,
    region_code: "04",
    province_code: "0401",
    lot_type: "R",
    created_at: "2024-01-15T08:00:00Z",
    approval_status: "approved",
  },
  {
    project_code: "PROJ-002",
    project_name: "Southview Housing",
    project_prog_id: 2,
    total_area: 35000,
    project_cost: 85000000,
    region_code: "04",
    province_code: "0402",
    lot_type: "B",
    created_at: "2024-02-20T08:00:00Z",
    approval_status: "approved",
  },
];

const initialApplications: Application[] = [
  {
    app_id: "a1b2c3d4-e5f6-4789-a012-345678901234",
    prequalification_no: "PQ-2024-001",
    origin: "NHA",
    application_type: "New",
    last_name: "Dela Cruz",
    first_name: "Juan",
    birth_date: "1990-05-15",
    sex: "M",
    civil_status: "Single",
    created_at: "2024-03-01T10:00:00Z",
    updated_at: "2024-03-01T10:00:00Z",
  },
  {
    app_id: "b2c3d4e5-f6a7-4890-b123-456789012345",
    prequalification_no: "PQ-2024-002",
    origin: "LGU",
    application_type: "Renewal",
    last_name: "Santos",
    first_name: "Maria",
    created_at: "2024-03-10T10:00:00Z",
    updated_at: "2024-03-10T10:00:00Z",
  },
];

const initialBeneficiaries: Beneficiary[] = [
  {
    id: 1,
    bin: "123456789",
    app_id: "APP001",
    last_name: "Reyes",
    first_name: "Pedro",
    birth_date: "1985-08-20",
    sex: "M",
    civil_status: "Married",
    category: "A",
  },
  {
    id: 2,
    bin: "987654321",
    app_id: "APP002",
    last_name: "Garcia",
    first_name: "Ana",
    category: "B",
  },
];

// Mutable in-memory stores (clone so we can reset by re-cloning if needed)
let programs: Program[] = initialPrograms.map((p) => ({ ...p }));
let projects: Project[] = initialProjects.map((p) => ({ ...p }));
let applications: Application[] = initialApplications.map((a) => ({ ...a }));
let beneficiaries: Beneficiary[] = initialBeneficiaries.map((b) => ({ ...b }));

function filterProjects(list: Project[], params: URLSearchParams): Project[] {
  let out = list;
  const project_code = params.get("project_code")?.trim().toLowerCase();
  if (project_code) {
    out = out.filter((p) => (p.project_code ?? "").toLowerCase().includes(project_code));
  }
  const project_name = params.get("project_name")?.trim().toLowerCase();
  if (project_name) {
    out = out.filter((p) => (p.project_name ?? "").toLowerCase().includes(project_name));
  }
  const region_code = params.get("region_code")?.trim();
  if (region_code) {
    out = out.filter((p) => (p.region_code ?? "").trim() === region_code);
  }
  const province_code = params.get("province_code")?.trim();
  if (province_code) {
    out = out.filter((p) => (p.province_code ?? "").trim() === province_code);
  }
  const lot_type = params.get("lot_type")?.trim();
  if (lot_type) {
    out = out.filter((p) => (p.lot_type ?? "").trim() === lot_type);
  }
  const project_prog_id = params.get("project_prog_id")?.trim();
  if (project_prog_id) {
    const id = parseInt(project_prog_id, 10);
    if (!Number.isNaN(id)) {
      out = out.filter((p) => p.project_prog_id === id);
    }
  }
  const approval_status = params.get("approval_status")?.trim();
  if (approval_status) {
    out = out.filter((p) => (p.approval_status ?? "pending_approval") === approval_status);
  }
  return out;
}

function filterPrograms(list: Program[], params: URLSearchParams): Program[] {
  const approval_status = params.get("approval_status")?.trim();
  if (!approval_status) return list;
  return list.filter((p) => (p.approval_status ?? "pending_approval") === approval_status);
}

function searchProjects(list: Project[], phrase: string, limit: number): Project[] {
  if (!phrase || phrase.length < 2) return [];
  const lower = phrase.toLowerCase();
  return list
    .filter(
      (p) =>
        (p.project_code ?? "").toLowerCase().includes(lower) ||
        (p.project_name ?? "").toLowerCase().includes(lower)
    )
    .slice(0, limit);
}

function searchPrograms(list: Program[], phrase: string, limit: number): Program[] {
  if (!phrase || phrase.length < 2) return [];
  const lower = phrase.toLowerCase();
  return list
    .filter((p) => (p.mc_ref ?? "").toLowerCase().includes(lower))
    .slice(0, limit);
}

function searchApplications(list: Application[], phrase: string, limit: number): Application[] {
  if (!phrase || phrase.length < 2) return [];
  const lower = phrase.toLowerCase();
  return list
    .filter(
      (a) =>
        (a.prequalification_no ?? "").toLowerCase().includes(lower) ||
        (a.last_name ?? "").toLowerCase().includes(lower) ||
        (a.first_name ?? "").toLowerCase().includes(lower)
    )
    .slice(0, limit);
}

function searchBeneficiaries(list: Beneficiary[], phrase: string, limit: number): Beneficiary[] {
  if (!phrase || phrase.length < 2) return [];
  const lower = phrase.toLowerCase();
  return list
    .filter(
      (b) =>
        (b.last_name ?? "").toLowerCase().includes(lower) ||
        (b.first_name ?? "").toLowerCase().includes(lower) ||
        (b.bin ?? "").toLowerCase().includes(lower) ||
        (b.common_code ?? "").toLowerCase().includes(lower)
    )
    .slice(0, limit);
}

export function mockApiHandle(
  method: string,
  pathWithQuery: string,
  body?: string
): unknown {
  const [pathname, search] = pathWithQuery.replace(/^\//, "").split("?");
  const segments = pathname.split("/").filter(Boolean);
  const params = search ? new URLSearchParams(search) : new URLSearchParams();
  const resource = segments[0];
  const idSegment = segments[1];

  const methodUpper = (method || "GET").toUpperCase();

  // GET list or GET by id
  if (methodUpper === "GET") {
    if (resource === "search") {
      const q = params.get("q") ?? "";
      const limitParam = params.get("limit");
      const limit = Math.min(20, Math.max(1, parseInt(limitParam ?? "5", 10) || 5));
      const phrase = q.trim();
      return {
        projects: searchProjects(projects, phrase, limit),
        programs: searchPrograms(programs, phrase, limit),
        applications: searchApplications(applications, phrase, limit),
        beneficiaries: searchBeneficiaries(beneficiaries, phrase, limit),
      };
    }
    if (resource === "projects") {
      if (!idSegment) {
        return filterProjects(projects, params);
      }
      const found = projects.find((p) => p.project_code === decodeURIComponent(idSegment));
      if (!found) throw new Error("Project not found");
      return found;
    }
    if (resource === "programs") {
      if (!idSegment) return filterPrograms(programs, params);
      const id = parseInt(idSegment, 10);
      const found = programs.find((p) => p.project_prog_id === id);
      if (!found) throw new Error("Program not found");
      return found;
    }
    if (resource === "applications") {
      if (!idSegment) return applications;
      const found = applications.find((a) => a.app_id === decodeURIComponent(idSegment));
      if (!found) throw new Error("Application not found");
      return found;
    }
    if (resource === "beneficiaries") {
      if (!idSegment) return beneficiaries;
      const id = parseInt(idSegment, 10);
      const found = beneficiaries.find((b) => b.id === id);
      if (!found) throw new Error("Beneficiary not found");
      return found;
    }
  }

  // POST
  if (methodUpper === "POST") {
    const data = body ? (JSON.parse(body) as Record<string, unknown>) : {};
    if (resource === "projects") {
      const project_code = (data.project_code as string) || `MOCK-${Date.now()}`;
      const newProject: Project = {
        ...data,
        project_code,
        created_at: new Date().toISOString(),
        approval_status: "pending_approval",
      } as Project;
      projects = [...projects, newProject];
      return newProject;
    }
    if (resource === "programs") {
      const nextId = programs.length ? Math.max(...programs.map((p) => p.project_prog_id ?? 0)) + 1 : 1;
      const newProgram: Program = {
        project_prog_id: nextId,
        mc_ref: (data.mc_ref as string) ?? null,
        interest_rate: Number(data.interest_rate) ?? 0,
        delinquency_rate: Number(data.delinquency_rate) ?? 0,
        max_term_yrs: data.max_term_yrs != null ? Number(data.max_term_yrs) : null,
        approval_status: "pending_approval",
      };
      programs = [...programs, newProgram];
      return newProgram;
    }
    if (resource === "applications") {
      const app_id = uuid();
      const newApp: Application = {
        ...data,
        app_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Application;
      applications = [...applications, newApp];
      return newApp;
    }
    if (resource === "beneficiaries") {
      const nextId = beneficiaries.length ? Math.max(...beneficiaries.map((b) => b.id ?? 0)) + 1 : 1;
      const newBen: Beneficiary = { ...data, id: nextId } as Beneficiary;
      beneficiaries = [...beneficiaries, newBen];
      return newBen;
    }
  }

  // PATCH (approval workflow)
  if (methodUpper === "PATCH") {
    const data = body ? (JSON.parse(body) as Record<string, unknown>) : {};
    if (resource === "projects" && idSegment) {
      const code = decodeURIComponent(idSegment);
      const idx = projects.findIndex((p) => p.project_code === code);
      if (idx === -1) throw new Error("Project not found");
      const updated: Project = {
        ...projects[idx],
        ...(data.approval_status !== undefined && { approval_status: data.approval_status as string }),
        ...(data.rejection_reason !== undefined && { rejection_reason: data.rejection_reason as string | null }),
        ...(data.approved_by !== undefined && { approved_by: data.approved_by as string | null }),
        ...(data.approval_status === "approved" && {
          approved_at: new Date().toISOString(),
        }),
        project_code: code,
      } as Project;
      projects = projects.slice(0, idx).concat(updated, projects.slice(idx + 1));
      return updated;
    }
    if (resource === "programs" && idSegment) {
      const id = parseInt(idSegment, 10);
      const idx = programs.findIndex((p) => p.project_prog_id === id);
      if (idx === -1) throw new Error("Program not found");
      const updated: Program = {
        ...programs[idx],
        ...(data.approval_status !== undefined && { approval_status: data.approval_status as string }),
        ...(data.rejection_reason !== undefined && { rejection_reason: data.rejection_reason as string | null }),
        ...(data.approved_by !== undefined && { approved_by: data.approved_by as string | null }),
        ...(data.approval_status === "approved" && {
          approved_at: new Date().toISOString(),
        }),
        project_prog_id: id,
      } as Program;
      programs = programs.slice(0, idx).concat(updated, programs.slice(idx + 1));
      return updated;
    }
  }

  // PUT
  if (methodUpper === "PUT") {
    const data = body ? (JSON.parse(body) as Record<string, unknown>) : {};
    if (resource === "projects" && idSegment) {
      const code = decodeURIComponent(idSegment);
      const idx = projects.findIndex((p) => p.project_code === code);
      if (idx === -1) throw new Error("Project not found");
      const updated: Project = { ...projects[idx], ...data, project_code: code } as Project;
      projects = projects.slice(0, idx).concat(updated, projects.slice(idx + 1));
      return updated;
    }
    if (resource === "programs" && idSegment) {
      const id = parseInt(idSegment, 10);
      const idx = programs.findIndex((p) => p.project_prog_id === id);
      if (idx === -1) throw new Error("Program not found");
      const updated: Program = { ...programs[idx], ...data, project_prog_id: id } as Program;
      programs = programs.slice(0, idx).concat(updated, programs.slice(idx + 1));
      return updated;
    }
    if (resource === "applications" && idSegment) {
      const appId = decodeURIComponent(idSegment);
      const idx = applications.findIndex((a) => a.app_id === appId);
      if (idx === -1) throw new Error("Application not found");
      const updated: Application = { ...applications[idx], ...data, app_id: appId } as Application;
      applications = applications.slice(0, idx).concat(updated, applications.slice(idx + 1));
      return updated;
    }
    if (resource === "beneficiaries" && idSegment) {
      const id = parseInt(idSegment, 10);
      const idx = beneficiaries.findIndex((b) => b.id === id);
      if (idx === -1) throw new Error("Beneficiary not found");
      const updated: Beneficiary = { ...beneficiaries[idx], ...data, id } as Beneficiary;
      beneficiaries = beneficiaries.slice(0, idx).concat(updated, beneficiaries.slice(idx + 1));
      return updated;
    }
  }

  // DELETE
  if (methodUpper === "DELETE") {
    if (resource === "projects" && idSegment) {
      const code = decodeURIComponent(idSegment);
      projects = projects.filter((p) => p.project_code !== code);
      return undefined;
    }
    if (resource === "programs" && idSegment) {
      const id = parseInt(idSegment, 10);
      programs = programs.filter((p) => p.project_prog_id !== id);
      return undefined;
    }
    if (resource === "applications" && idSegment) {
      const appId = decodeURIComponent(idSegment);
      applications = applications.filter((a) => a.app_id !== appId);
      return undefined;
    }
    if (resource === "beneficiaries" && idSegment) {
      const id = parseInt(idSegment, 10);
      beneficiaries = beneficiaries.filter((b) => b.id !== id);
      return undefined;
    }
  }

  throw new Error(`Mock API: unknown ${methodUpper} ${pathname}`);
}
