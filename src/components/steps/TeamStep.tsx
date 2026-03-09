"use client";

import { TeamData, TeamMember, Seniority, RoleType } from "@/lib/types";

interface Props {
  data: TeamData;
  onChange: (d: TeamData) => void;
}

const SENIORITIES: Seniority[] = ["Lead", "Senior", "Middle"];
const ROLE_TYPES: RoleType[] = ["Designer", "Engineer", "Project Manager"];

function newMember(): TeamMember {
  return {
    id: crypto.randomUUID(),
    seniority: "Senior",
    roleType: "Engineer",
    count: 1,
  };
}

export default function TeamStep({ data, onChange }: Props) {
  const members = data.members;

  const update = (idx: number, field: keyof TeamMember, val: string | number) => {
    const next = [...members];
    next[idx] = { ...next[idx], [field]: val };
    onChange({ members: next });
  };

  const add = () => {
    onChange({ members: [...members, newMember()] });
  };

  const remove = (idx: number) => {
    onChange({ members: members.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">Team Composition</h2>
      <p className="text-sm text-gray-500">
        Define the team members involved in the project.
      </p>

      <div className="space-y-3">
        {members.map((m, i) => (
          <div
            key={m.id}
            className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 p-3 bg-white"
          >
            <label className="flex-1 min-w-[120px]">
              <span className="text-xs text-gray-500">Role</span>
              <select
                value={m.roleType}
                onChange={(e) => update(i, "roleType", e.target.value)}
                className="mt-0.5 block w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              >
                {ROLE_TYPES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </label>

            <label className="flex-1 min-w-[100px]">
              <span className="text-xs text-gray-500">Seniority</span>
              <select
                value={m.seniority}
                onChange={(e) => update(i, "seniority", e.target.value)}
                className="mt-0.5 block w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              >
                {m.roleType === "Project Manager" ? (
                  <option value="">—</option>
                ) : (
                  SENIORITIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))
                )}
              </select>
            </label>

            <label className="w-20">
              <span className="text-xs text-gray-500">Count</span>
              <input
                type="number"
                min={1}
                max={10}
                value={m.count}
                onChange={(e) =>
                  update(i, "count", Math.max(1, parseInt(e.target.value) || 1))
                }
                className="mt-0.5 block w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </label>

            <button
              type="button"
              onClick={() => remove(i)}
              className="mb-1 text-sm text-red-400 hover:text-red-600"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="text-sm font-medium text-teal-600 hover:text-teal-800"
      >
        + Add team member
      </button>
    </div>
  );
}
