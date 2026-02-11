"use client";

import { SolutionData } from "@/lib/types";

export default function SolutionPreview({ data }: { data: SolutionData }) {
  const points = data.points.slice(0, 10);
  const perCol = Math.ceil(points.length / 2);
  const col1 = points.slice(0, perCol);
  const col2 = points.slice(perCol);

  return (
    <div className="w-full h-full bg-white flex flex-col p-[6%] font-sans overflow-hidden">
      <h2 className="text-[#0F1B2D] font-bold text-[1.3em] leading-tight">
        Solution Overview
      </h2>
      <div className="h-[2px] w-[3em] bg-[#00C8C8] mt-[0.3em] mb-[0.6em] rounded" />

      <div className="flex-1 grid grid-cols-2 gap-x-[0.6em] gap-y-0 content-start">
        {[col1, col2].map((col, ci) => (
          <div key={ci} className="flex flex-col gap-[0.25em]">
            {col.map((point, pi) => (
              <div key={pi} className="flex items-start gap-[0.25em]">
                <span className="flex items-center justify-center w-[1em] h-[1em] rounded-full bg-[#00C8C8] text-white text-[0.4em] font-bold shrink-0 mt-[0.05em]">
                  &#10003;
                </span>
                <span className="text-[#1E293B] text-[0.45em] leading-[1.35]">
                  {point || "Solution point..."}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {points.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-[#8B95A5] text-[0.5em] italic">
          Add solution points to see preview
        </div>
      )}
    </div>
  );
}
