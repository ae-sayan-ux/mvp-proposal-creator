import { ProposalData } from "./types";

const STORAGE_KEY = "proposal-drafts";
const AUTOSAVE_KEY = "proposal-autosave";

export interface Draft {
  id: string;
  name: string;
  data: ProposalData;
  updatedAt: string; // ISO string
}

/* ─── Auto-save (single slot) ─────────────────────────────── */

export function autoSave(data: ProposalData): void {
  try {
    localStorage.setItem(
      AUTOSAVE_KEY,
      JSON.stringify({ data, updatedAt: new Date().toISOString() })
    );
  } catch {
    // quota exceeded or private mode — silently fail
  }
}

export function loadAutoSave(): { data: ProposalData; updatedAt: string } | null {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAutoSave(): void {
  try {
    localStorage.removeItem(AUTOSAVE_KEY);
  } catch {
    // ignore
  }
}

/* ─── Named drafts ────────────────────────────────────────── */

export function listDrafts(): Draft[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const drafts: Draft[] = JSON.parse(raw);
    return drafts.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch {
    return [];
  }
}

export function saveDraft(name: string, data: ProposalData): Draft {
  const drafts = listDrafts();
  const draft: Draft = {
    id: crypto.randomUUID(),
    name,
    data,
    updatedAt: new Date().toISOString(),
  };
  drafts.push(draft);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  return draft;
}

export function updateDraft(id: string, data: ProposalData): void {
  const drafts = listDrafts();
  const idx = drafts.findIndex((d) => d.id === id);
  if (idx === -1) return;
  drafts[idx] = { ...drafts[idx], data, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export function deleteDraft(id: string): void {
  const drafts = listDrafts().filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export function loadDraft(id: string): Draft | null {
  return listDrafts().find((d) => d.id === id) ?? null;
}
