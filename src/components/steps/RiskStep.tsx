"use client";

import { RiskData, EscalationNode, EscalationLink } from "@/lib/types";

interface Props {
  data: RiskData;
  onChange: (d: RiskData) => void;
}

function newNode(): EscalationNode {
  return { id: crypto.randomUUID(), role: "", name: "" };
}

export default function RiskStep({ data, onChange }: Props) {
  const { nodes, links } = data;

  /* ── Node helpers ───────────────────────────────────────── */
  const updateNode = (idx: number, field: keyof EscalationNode, val: string) => {
    const next = [...nodes];
    next[idx] = { ...next[idx], [field]: val };
    onChange({ ...data, nodes: next });
  };

  const addNode = () => {
    onChange({ ...data, nodes: [...nodes, newNode()] });
  };

  const removeNode = (idx: number) => {
    const id = nodes[idx].id;
    onChange({
      nodes: nodes.filter((_, i) => i !== idx),
      links: links.filter((l) => l.fromId !== id && l.toId !== id),
    });
  };

  /* ── Link helpers ───────────────────────────────────────── */
  const addLink = () => {
    if (nodes.length < 2) return;
    const link: EscalationLink = {
      fromId: nodes[nodes.length - 1]?.id || "",
      toId: nodes[0]?.id || "",
      label: "Reports to",
    };
    onChange({ ...data, links: [...links, link] });
  };

  const updateLink = (
    idx: number,
    field: keyof EscalationLink,
    val: string
  ) => {
    const next = [...links];
    next[idx] = { ...next[idx], [field]: val };
    onChange({ ...data, links: next });
  };

  const removeLink = (idx: number) => {
    onChange({ ...data, links: links.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">
        Risk Escalation &amp; Management
      </h2>
      <p className="text-sm text-gray-500">
        Define the reporting matrix. Add team roles (nodes) and then connect
        them with escalation/reporting links. The top of the chain (nodes with
        no incoming &quot;reports to&quot;) will appear at the top of the
        diagram.
      </p>

      {/* Nodes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Team Roles
        </h3>
        <div className="space-y-2">
          {nodes.map((node, i) => (
            <div
              key={node.id}
              className="flex gap-2 items-end rounded-lg border border-gray-200 p-2 bg-white"
            >
              <label className="flex-1">
                <span className="text-xs text-gray-500">Role</span>
                <input
                  type="text"
                  value={node.role}
                  onChange={(e) => updateNode(i, "role", e.target.value)}
                  placeholder="e.g. Project Manager"
                  className="mt-0.5 block w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </label>
              <label className="flex-1">
                <span className="text-xs text-gray-500">Name (optional)</span>
                <input
                  type="text"
                  value={node.name}
                  onChange={(e) => updateNode(i, "name", e.target.value)}
                  placeholder="John Doe"
                  className="mt-0.5 block w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </label>
              <button
                type="button"
                onClick={() => removeNode(i)}
                className="mb-1 text-sm text-red-400 hover:text-red-600"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addNode}
          className="mt-2 text-sm font-medium text-teal-600 hover:text-teal-800"
        >
          + Add role
        </button>
      </div>

      {/* Links */}
      {nodes.length >= 2 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Reporting Links
          </h3>
          <div className="space-y-2">
            {links.map((link, i) => (
              <div
                key={i}
                className="flex gap-2 items-end rounded-lg border border-gray-200 p-2 bg-white"
              >
                <label className="flex-1">
                  <span className="text-xs text-gray-500">From</span>
                  <select
                    value={link.fromId}
                    onChange={(e) => updateLink(i, "fromId", e.target.value)}
                    className="mt-0.5 block w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  >
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.role || "(unnamed)"}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="w-32">
                  <span className="text-xs text-gray-500">Relationship</span>
                  <select
                    value={link.label}
                    onChange={(e) => updateLink(i, "label", e.target.value)}
                    className="mt-0.5 block w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="Reports to">Reports to</option>
                    <option value="Escalates to">Escalates to</option>
                    <option value="Collaborates with">Collaborates with</option>
                  </select>
                </label>

                <label className="flex-1">
                  <span className="text-xs text-gray-500">To</span>
                  <select
                    value={link.toId}
                    onChange={(e) => updateLink(i, "toId", e.target.value)}
                    className="mt-0.5 block w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  >
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.role || "(unnamed)"}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={() => removeLink(i)}
                  className="mb-1 text-sm text-red-400 hover:text-red-600"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addLink}
            className="mt-2 text-sm font-medium text-teal-600 hover:text-teal-800"
          >
            + Add link
          </button>
        </div>
      )}
    </div>
  );
}
