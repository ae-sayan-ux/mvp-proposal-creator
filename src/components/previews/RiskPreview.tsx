"use client";

import { RiskData } from "@/lib/types";

export default function RiskPreview({ data }: { data: RiskData }) {
  const { nodes, links } = data;

  // Build hierarchy levels
  const hasParent = new Set<string>();
  const childrenOf: Record<string, string[]> = {};
  links.forEach((link) => {
    if (!childrenOf[link.toId]) childrenOf[link.toId] = [];
    childrenOf[link.toId].push(link.fromId);
    hasParent.add(link.fromId);
  });

  const roots = nodes.filter((n) => !hasParent.has(n.id));
  if (roots.length === 0 && nodes.length > 0) roots.push(nodes[0]);

  // BFS levels
  const levels: Record<string, number> = {};
  const queue = [...roots.map((r) => r.id)];
  roots.forEach((r) => (levels[r.id] = 0));
  while (queue.length > 0) {
    const cur = queue.shift()!;
    (childrenOf[cur] || []).forEach((cid) => {
      if (levels[cid] === undefined) {
        levels[cid] = (levels[cur] || 0) + 1;
        queue.push(cid);
      }
    });
  }
  nodes.forEach((n) => {
    if (levels[n.id] === undefined) levels[n.id] = 0;
  });

  // Group by level
  const byLevel: Record<number, typeof nodes> = {};
  let maxLevel = 0;
  nodes.forEach((n) => {
    const lvl = levels[n.id];
    if (!byLevel[lvl]) byLevel[lvl] = [];
    byLevel[lvl].push(n);
    if (lvl > maxLevel) maxLevel = lvl;
  });

  return (
    <div className="w-full h-full bg-white flex flex-col p-[6%] font-sans overflow-hidden">
      <h2 className="text-[#0F1B2D] font-bold text-[1.3em] leading-tight">
        Risk Escalation &amp; Management
      </h2>
      <div className="h-[2px] w-[3em] bg-[#00C8C8] mt-[0.3em] mb-[0.5em] rounded" />

      <div className="flex-1 flex flex-col justify-center gap-[0.6em]">
        {Array.from({ length: maxLevel + 1 }, (_, lvl) => {
          const nodesAtLevel = byLevel[lvl] || [];
          return (
            <div key={lvl} className="flex justify-center gap-[0.5em]">
              {nodesAtLevel.map((node) => {
                const isRoot = !hasParent.has(node.id);
                return (
                  <div
                    key={node.id}
                    className={`rounded-[0.2em] px-[0.4em] py-[0.25em] min-w-[4em] text-center shadow-sm ${
                      isRoot
                        ? "bg-[#0F1B2D]"
                        : "bg-[#F0F2F5] border border-[#e5e7eb]"
                    }`}
                  >
                    <p
                      className={`text-[0.32em] ${
                        isRoot ? "text-[#00C8C8]" : "text-[#8B95A5]"
                      }`}
                    >
                      {node.role || "Role"}
                    </p>
                    <p
                      className={`font-bold text-[0.38em] ${
                        isRoot ? "text-white" : "text-[#0F1B2D]"
                      }`}
                    >
                      {node.name || node.role || "Name"}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Connection labels */}
        {links.length > 0 && (
          <div className="flex justify-center gap-[0.4em] flex-wrap mt-[0.1em]">
            {links.map((link, i) => {
              const from = nodes.find((n) => n.id === link.fromId);
              const to = nodes.find((n) => n.id === link.toId);
              return (
                <span key={i} className="text-[0.28em] text-[#8B95A5] italic">
                  {from?.role || "?"} → {link.label} → {to?.role || "?"}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {nodes.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-[#8B95A5] text-[0.5em] italic">
          Add team roles to see preview
        </div>
      )}
    </div>
  );
}
