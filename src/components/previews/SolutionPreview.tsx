"use client";

import { SolutionData } from "@/lib/types";

export default function SolutionPreview({ data }: { data: SolutionData }) {
  const points = data.points.slice(0, 10);

  return (
    <div className="w-full h-full bg-[#f2f3f4] flex font-sans overflow-hidden">
      {/* Left panel */}
      <div className="w-[40%] shrink-0 flex flex-col justify-center px-[6%] gap-[0.8em]">
        <div>
          <h1 className="text-[#ff7a00] font-black text-[2em] leading-[1.05] tracking-tight">
            Solution
          </h1>
          <h1 className="text-[#101015] font-black text-[2em] leading-[1.05] tracking-tight">
            Overview
          </h1>
        </div>
        {data.additionalStatement && (
          <div className="bg-white border border-[#dbdcdd] rounded-[0.4em] px-[0.8em] py-[0.5em]">
            <p className="text-[#101015] text-[0.5em] leading-[1.4] font-medium">
              {data.additionalStatement}
            </p>
          </div>
        )}
      </div>

      {/* Right panel — white card */}
      <div className="flex-1 flex items-center justify-center py-[4%] pr-[4%]">
        <div className="bg-white rounded-[1em] shadow-sm w-full h-full flex flex-col justify-evenly px-[7%] py-[4%] overflow-hidden">
          {points.length === 0 ? (
            <p className="text-[#6b7280] text-[0.5em] italic text-center">
              Add solution points to see preview
            </p>
          ) : (
            points.map((point, i) => (
              <div key={i} className="flex items-start gap-[0.5em]">
                <img
                  src="/icon-checked.svg"
                  alt=""
                  className="w-[0.9em] h-[0.9em] shrink-0 mt-[0.05em]"
                />
                <p className="text-[#6b7280] font-bold text-[0.55em] leading-snug">
                  {point || `Item/Action #${i + 1}`}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
