"use client";

import { ScopeData, ScopeFeature } from "@/lib/types";

interface Props {
  data: ScopeData;
  onChange: (d: ScopeData) => void;
}

function newFeature(): ScopeFeature {
  return { id: crypto.randomUUID(), header: "", description: "" };
}

export default function ScopeStep({ data, onChange }: Props) {
  const features = data.features;

  const update = (idx: number, field: keyof ScopeFeature, val: string) => {
    const next = [...features];
    next[idx] = { ...next[idx], [field]: val };
    onChange({ features: next });
  };

  const add = () => {
    onChange({ features: [...features, newFeature()] });
  };

  const remove = (idx: number) => {
    onChange({ features: features.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">Scope &amp; Features</h2>
      <p className="text-sm text-gray-500">
        Define each feature with a short header and description. Multiple slides
        will be generated if needed (4 features per slide).
      </p>

      <div className="space-y-3">
        {features.map((feat, i) => (
          <div
            key={feat.id}
            className="rounded-lg border border-gray-200 p-4 space-y-2 bg-white"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-600">
                Feature {i + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-xs text-red-400 hover:text-red-600"
              >
                Remove
              </button>
            </div>
            <input
              type="text"
              value={feat.header}
              onChange={(e) => update(i, "header", e.target.value)}
              placeholder="Feature header"
              className="block w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
            <textarea
              value={feat.description}
              onChange={(e) => update(i, "description", e.target.value)}
              rows={2}
              placeholder="Short description..."
              className="block w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="text-sm font-medium text-teal-600 hover:text-teal-800"
      >
        + Add feature
      </button>
    </div>
  );
}
