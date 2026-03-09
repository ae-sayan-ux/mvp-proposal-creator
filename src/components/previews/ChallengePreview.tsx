"use client";

import { ChallengeData } from "@/lib/types";

export default function ChallengePreview({ data }: { data: ChallengeData }) {
  const page1 = data.items.slice(0, 8);

  return (
    <div className="w-full h-full bg-[#f2f3f4] flex font-sans overflow-hidden">
      {/* Left panel */}
      <div className="w-[40%] shrink-0 flex flex-col justify-center px-[6%] gap-[0.8em]">
        <div>
          <h1 className="text-[#ff7a00] font-black text-[2em] leading-[1.05] tracking-tight">
            Challenge
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
          {page1.length === 0 ? (
            <p className="text-[#6b7280] text-[0.5em] italic text-center">
              Add challenges to see preview
            </p>
          ) : (
            page1.map((item) => (
              <div key={item.id} className="flex items-start gap-[0.5em]">
                <img
                  src="/icon-speech-bubble.svg"
                  alt=""
                  className="w-[1em] h-[1em] shrink-0 mt-[0.05em]"
                />
                <div>
                  <p className="text-[#1a1a1a] font-bold text-[0.6em] leading-snug">
                    {item.title || "Challenge title"}
                  </p>
                  {item.description && (
                    <p className="text-[#6b7280] text-[0.5em] leading-[1.3]">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
