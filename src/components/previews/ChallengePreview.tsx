"use client";

import { ChallengeData } from "@/lib/types";

export default function ChallengePreview({ data }: { data: ChallengeData }) {
  const items = data.items.slice(0, 4);

  return (
    <div className="w-full h-full bg-white flex flex-col p-[6%] font-sans overflow-hidden">
      {/* Title */}
      <h2 className="text-[#0F1B2D] font-bold text-[1.3em] leading-tight">
        Challenge Overview
      </h2>
      <div className="h-[2px] w-[3em] bg-[#00C8C8] mt-[0.3em] mb-[0.6em] rounded" />

      {/* 2x2 grid */}
      <div className="flex-1 grid grid-cols-2 gap-[0.4em]">
        {items.map((item, i) => (
          <div key={item.id} className="bg-[#F0F2F5] rounded-[0.2em] p-[0.4em] flex flex-col overflow-hidden">
            <div className="flex items-center gap-[0.25em] mb-[0.2em]">
              <span className="flex items-center justify-center w-[1.2em] h-[1.2em] rounded-full bg-[#00C8C8] text-white text-[0.5em] font-bold shrink-0">
                {i + 1}
              </span>
              <span className="text-[#0F1B2D] font-bold text-[0.55em] leading-tight truncate">
                {item.title || "Challenge title"}
              </span>
            </div>
            <p className="text-[#1E293B] text-[0.4em] leading-[1.3] line-clamp-4">
              {item.description || "Description..."}
            </p>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-2 flex items-center justify-center text-[#8B95A5] text-[0.5em] italic">
            Add challenges to see preview
          </div>
        )}
      </div>

      {/* Bottom statement */}
      {data.additionalStatement && (
        <div className="bg-[#1A2744] rounded-[0.15em] px-[0.5em] py-[0.3em] mt-[0.3em]">
          <p className="text-white text-[0.4em] italic leading-[1.3]">
            {data.additionalStatement}
          </p>
        </div>
      )}
    </div>
  );
}
