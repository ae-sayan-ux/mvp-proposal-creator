"use client";

import { CoverData } from "@/lib/types";

export default function CoverPreview({ data }: { data: CoverData }) {
  return (
    <div className="w-full h-full bg-[#0F1B2D] flex flex-col justify-between p-[6%] font-sans relative overflow-hidden">
      {/* Top row: AE logo + client logo */}
      <div className="flex items-start justify-between">
        <span className="text-[#00C8C8] font-bold text-[0.9em] tracking-wide">
          AgileEngine
        </span>
        {data.clientLogoBase64 && (
          <img
            src={data.clientLogoBase64}
            alt="Client logo"
            className="max-h-[1.8em] max-w-[6em] object-contain"
          />
        )}
      </div>

      {/* Center content */}
      <div className="flex-1 flex flex-col justify-center gap-[0.3em]">
        <h1 className="text-white font-bold text-[2em] leading-[1.1] tracking-tight">
          {data.title || "Proposal Title"}
        </h1>
        {data.description && (
          <p className="text-[#8B95A5] text-[0.8em] mt-[0.1em]">
            {data.description}
          </p>
        )}
        <p className="text-[#00C8C8] font-bold text-[1.1em] mt-[0.4em]">
          {data.clientName || "Client Name"}
        </p>
      </div>

      {/* Bottom accent line */}
      <div className="h-[2px] bg-[#00C8C8] w-full rounded" />
    </div>
  );
}
