"use client";

import { GanttData, GanttPhase } from "@/lib/types";
import { PHASE_COLORS } from "@/lib/constants";

interface Props {
  data: GanttData;
  onChange: (d: GanttData) => void;
}

const PRESET_PHASES = ["Discovery", "MVP", "Post-MVP", "Maintenance"];

function newPhase(): GanttPhase {
  return {
    id: crypto.randomUUID(),
    name: "Discovery",
    startWeek: 1,
    endWeek: 4,
    color: PHASE_COLORS["Discovery"],
  };
}

export default function GanttStep({ data, onChange }: Props) {
  const phases = data.phases;

  const updatePhase = (
    idx: number,
    field: keyof GanttPhase,
    val: string | number
  ) => {
    const next = [...phases];
    const phase = { ...next[idx], [field]: val };

    // Auto-set color when name matches a preset
    if (field === "name" && typeof val === "string") {
      phase.color =
        PHASE_COLORS[val] || PHASE_COLORS["Custom"];
    }

    next[idx] = phase;
    onChange({ ...data, phases: next });
  };

  const add = () => {
    onChange({ ...data, phases: [...phases, newPhase()] });
  };

  const remove = (idx: number) => {
    onChange({ ...data, phases: phases.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">Project Timeline</h2>
      <p className="text-sm text-gray-500">
        Define phases and their week ranges. Phases can overlap.
      </p>

      <label className="block w-40">
        <span className="text-sm font-medium text-gray-700">Total Weeks</span>
        <input
          type="number"
          min={4}
          max={52}
          value={data.totalWeeks}
          onChange={(e) =>
            onChange({
              ...data,
              totalWeeks: Math.max(4, parseInt(e.target.value) || 20),
            })
          }
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
        />
      </label>

      <div className="space-y-3">
        {phases.map((phase, i) => (
          <div
            key={phase.id}
            className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 p-3 bg-white"
          >
            <label className="flex-1 min-w-[140px]">
              <span className="text-xs text-gray-500">Phase Name</span>
              <div className="flex gap-1 mt-0.5">
                <select
                  value={
                    PRESET_PHASES.includes(phase.name) ? phase.name : "__custom__"
                  }
                  onChange={(e) => {
                    if (e.target.value === "__custom__") return;
                    updatePhase(i, "name", e.target.value);
                  }}
                  className="block flex-1 rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                >
                  {PRESET_PHASES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                  <option value="__custom__">Custom...</option>
                </select>
                {!PRESET_PHASES.includes(phase.name) && (
                  <input
                    type="text"
                    value={phase.name}
                    onChange={(e) => updatePhase(i, "name", e.target.value)}
                    placeholder="Phase name"
                    className="block flex-1 rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                )}
              </div>
            </label>

            <label className="w-24">
              <span className="text-xs text-gray-500">Start Week</span>
              <input
                type="number"
                min={1}
                max={data.totalWeeks}
                value={phase.startWeek}
                onChange={(e) =>
                  updatePhase(
                    i,
                    "startWeek",
                    Math.max(1, parseInt(e.target.value) || 1)
                  )
                }
                className="mt-0.5 block w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </label>

            <label className="w-24">
              <span className="text-xs text-gray-500">End Week</span>
              <input
                type="number"
                min={phase.startWeek}
                max={data.totalWeeks}
                value={phase.endWeek}
                onChange={(e) =>
                  updatePhase(
                    i,
                    "endWeek",
                    Math.max(
                      phase.startWeek,
                      parseInt(e.target.value) || phase.startWeek
                    )
                  )
                }
                className="mt-0.5 block w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </label>

            <div className="flex items-end gap-2 mb-1">
              <span
                className="inline-block w-5 h-5 rounded"
                style={{ backgroundColor: `#${phase.color}` }}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-sm text-red-400 hover:text-red-600"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="text-sm font-medium text-teal-600 hover:text-teal-800"
      >
        + Add phase
      </button>

      {/* Mini preview */}
      {phases.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase">
            Preview
          </h4>
          <div className="space-y-1.5">
            {phases.map((phase) => {
              const pct =
                ((phase.endWeek - phase.startWeek + 1) / data.totalWeeks) *
                100;
              const left =
                ((phase.startWeek - 1) / data.totalWeeks) * 100;
              return (
                <div key={phase.id} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-24 truncate">
                    {phase.name}
                  </span>
                  <div className="flex-1 h-5 bg-gray-200 rounded relative">
                    <div
                      className="absolute top-0 h-5 rounded text-[9px] text-white font-bold flex items-center justify-center"
                      style={{
                        left: `${left}%`,
                        width: `${pct}%`,
                        backgroundColor: `#${phase.color}`,
                      }}
                    >
                      W{phase.startWeek}-W{phase.endWeek}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
