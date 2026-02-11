/* ─── Cover Slide ─────────────────────────────────────────── */
export interface CoverData {
  title: string;
  description: string;
  clientName: string;
  clientLogoBase64?: string; // data-url from upload
}

/* ─── Challenge Overview (max 4 items) ────────────────────── */
export interface ChallengeItem {
  id: string;
  title: string;
  description: string;
}

export interface ChallengeData {
  items: ChallengeItem[]; // max 4
  additionalStatement: string;
}

/* ─── Solution Overview (up to 10 points) ─────────────────── */
export interface SolutionData {
  points: string[]; // up to 10
}

/* ─── Scope Features (can span multiple slides) ──────────── */
export interface ScopeFeature {
  id: string;
  header: string;
  description: string;
}

export interface ScopeData {
  features: ScopeFeature[];
}

/* ─── Team Composition ────────────────────────────────────── */
export type Seniority = "Lead" | "Senior" | "Middle";
export type RoleType = "Designer" | "Engineer" | "Project Manager";

export interface TeamMember {
  id: string;
  seniority: Seniority | "";
  roleType: RoleType;
  count: number;
}

export interface TeamData {
  members: TeamMember[];
}

/* ─── Gantt / Timeline ────────────────────────────────────── */
export type PresetPhase =
  | "Discovery"
  | "MVP"
  | "Post-MVP"
  | "Maintenance";

export interface GanttPhase {
  id: string;
  name: string; // preset or custom
  startWeek: number; // 1-based
  endWeek: number;
  color: string;
}

export interface GanttData {
  totalWeeks: number; // e.g. 24
  phases: GanttPhase[];
}

/* ─── Risk / Escalation Matrix ────────────────────────────── */
export interface EscalationNode {
  id: string;
  role: string;
  name: string;
}

export interface EscalationLink {
  fromId: string;
  toId: string;
  label: string; // e.g. "Reports to", "Escalates to"
}

export interface RiskData {
  nodes: EscalationNode[];
  links: EscalationLink[];
}

/* ─── Full Proposal ───────────────────────────────────────── */
export interface ProposalData {
  cover: CoverData;
  challenge: ChallengeData;
  solution: SolutionData;
  scope: ScopeData;
  team: TeamData;
  gantt: GanttData;
  risk: RiskData;
}

export type OutputFormat = "pptx" | "pdf";
