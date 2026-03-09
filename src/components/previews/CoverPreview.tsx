"use client";

import { CoverData } from "@/lib/types";

export default function CoverPreview({ data }: { data: CoverData }) {
  return (
    <div className="w-full h-full bg-[#101015] flex flex-col justify-between p-[7%] font-sans relative overflow-hidden">
      {/* Top-left: Client logo placeholder */}
      <div className="flex items-start">
        {data.clientLogoBase64 ? (
          <img
            src={data.clientLogoBase64}
            alt="Client logo"
            className="max-h-[1.8em] max-w-[6em] object-contain"
          />
        ) : (
          <div className="bg-white w-[5em] h-[2.5em]" />
        )}
      </div>

      {/* Center-left: Title + company name badge */}
      <div className="flex flex-col gap-[0.4em]">
        <h1 className="text-white font-black text-[2.2em] leading-[1.1] tracking-tight">
          {data.title || "Proposal Type"}
        </h1>
        <div className="inline-flex">
          <span className="bg-[#FF5900] text-white font-bold text-[0.9em] px-[0.7em] py-[0.35em] rounded-[0.3em]">
            {data.clientName || "Company Name"}
          </span>
        </div>
      </div>

      {/* Bottom-left: AgileEngine logo */}
      <img
        src="/agileengine-logo.svg"
        alt="AgileEngine"
        className="h-[1.8em] w-auto object-contain self-start"
      />
    </div>
  );
}
