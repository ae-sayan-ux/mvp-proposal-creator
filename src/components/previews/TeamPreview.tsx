"use client";

import { TeamData } from "@/lib/types";

const ICONS: Record<string, string> = {
  Designer: "\u{1F3A8}",
  Engineer: "\u{1F4BB}",
  "Project Manager": "\u{1F4CB}",
};

export default function TeamPreview({ data }: { data: TeamData }) {
  // Group by role type
  const grouped: Record<string, typeof data.members> = {};
  data.members.forEach((m) => {
    if (!grouped[m.roleType]) grouped[m.roleType] = [];
    grouped[m.roleType].push(m);
  });
  const groups = Object.entries(grouped);

  return (
    <div className="w-full h-full bg-white flex flex-col p-[6%] font-sans overflow-hidden">
      <h2 className="text-[#0F1B2D] font-bold text-[1.3em] leading-tight">
        Team Composition
      </h2>
      <div className="h-[2px] w-[3em] bg-[#00C8C8] mt-[0.3em] mb-[0.5em] rounded" />

      <div className="flex-1 flex flex-col gap-[0.5em]">
        {groups.map(([roleType, members]) => (
          <div key={roleType}>
            <p className="text-[#0F1B2D] font-bold text-[0.5em] mb-[0.2em]">
              {ICONS[roleType] || "\u{1F464}"} {roleType}s
            </p>
            <div className="flex gap-[0.3em] flex-wrap">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="bg-[#F0F2F5] rounded-[0.2em] p-[0.25em] flex flex-col items-center min-w-[3em] relative"
                >
                  <span className="text-[1em]">{ICONS[m.roleType] || "\u{1F464}"}</span>
                  <span className="text-[#8B95A5] text-[0.32em] mt-[0.05em]">
                    {m.seniority}
                  </span>
                  <span className="text-[#0F1B2D] font-bold text-[0.35em]">
                    {m.roleType}
                  </span>
                  {m.count > 1 && (
                    <span className="absolute top-[0.1em] right-[0.1em] bg-[#00C8C8] text-white text-[0.3em] font-bold px-[0.2em] py-[0.05em] rounded">
                      x{m.count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {data.members.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-[#8B95A5] text-[0.5em] italic">
          Add team members to see preview
        </div>
      )}
    </div>
  );
}
