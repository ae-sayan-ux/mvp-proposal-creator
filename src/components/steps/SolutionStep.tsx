"use client";

import { SolutionData } from "@/lib/types";

interface Props {
  data: SolutionData;
  onChange: (d: SolutionData) => void;
}

export default function SolutionStep({ data, onChange }: Props) {
  const points = data.points;

  const update = (idx: number, val: string) => {
    const next = [...points];
    next[idx] = val;
    onChange({ points: next });
  };

  const add = () => {
    if (points.length >= 10) return;
    onChange({ points: [...points, ""] });
  };

  const remove = (idx: number) => {
    onChange({ points: points.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">Solution Overview</h2>
      <p className="text-sm text-gray-500">
        List up to 10 concise solution points. Keep them short so they fit on
        one slide.
      </p>

      <div className="space-y-2">
        {points.map((point, i) => (
          <div key={i} className="flex gap-2 items-start">
            <span className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-[10px] font-bold text-teal-700">
              {i + 1}
            </span>
            <input
              type="text"
              value={point}
              onChange={(e) => update(i, e.target.value)}
              placeholder={`Solution point ${i + 1}`}
              className="flex-1 rounded border border-gray-200 px-3 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="mt-1 text-xs text-red-400 hover:text-red-600"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {points.length < 10 && (
        <button
          type="button"
          onClick={add}
          className="text-sm font-medium text-teal-600 hover:text-teal-800"
        >
          + Add point ({points.length}/10)
        </button>
      )}
    </div>
  );
}
