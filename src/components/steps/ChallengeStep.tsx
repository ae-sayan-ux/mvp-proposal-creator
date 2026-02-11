"use client";

import { ChallengeData, ChallengeItem } from "@/lib/types";

interface Props {
  data: ChallengeData;
  onChange: (d: ChallengeData) => void;
}

function newItem(): ChallengeItem {
  return { id: crypto.randomUUID(), title: "", description: "" };
}

export default function ChallengeStep({ data, onChange }: Props) {
  const items = data.items;

  const update = (idx: number, field: keyof ChallengeItem, val: string) => {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: val };
    onChange({ ...data, items: next });
  };

  const add = () => {
    if (items.length >= 4) return;
    onChange({ ...data, items: [...items, newItem()] });
  };

  const remove = (idx: number) => {
    onChange({ ...data, items: items.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">Challenge Overview</h2>
      <p className="text-sm text-gray-500">
        Describe the key challenges the client faces (max 4).
      </p>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="rounded-lg border border-gray-200 p-4 space-y-2 bg-white"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-600">
                Challenge {i + 1}
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
              value={item.title}
              onChange={(e) => update(i, "title", e.target.value)}
              placeholder="Challenge title"
              className="block w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
            <textarea
              value={item.description}
              onChange={(e) => update(i, "description", e.target.value)}
              rows={2}
              placeholder="Describe the challenge..."
              className="block w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>
        ))}
      </div>

      {items.length < 4 && (
        <button
          type="button"
          onClick={add}
          className="text-sm font-medium text-teal-600 hover:text-teal-800"
        >
          + Add challenge
        </button>
      )}

      <label className="block mt-4">
        <span className="text-sm font-medium text-gray-700">
          Additional Statement (bottom of slide)
        </span>
        <input
          type="text"
          value={data.additionalStatement}
          onChange={(e) =>
            onChange({ ...data, additionalStatement: e.target.value })
          }
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          placeholder="To ensure engagement success, we propose to run a Discovery phase."
        />
      </label>
    </div>
  );
}
