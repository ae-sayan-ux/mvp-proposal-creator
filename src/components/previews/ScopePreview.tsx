"use client";

import { ScopeData } from "@/lib/types";

export default function ScopePreview({ data }: { data: ScopeData }) {
  // Show first 4 features (first slide worth)
  const features = data.features.slice(0, 4);
  const totalSlides = Math.ceil(data.features.length / 4);

  return (
    <div className="w-full h-full bg-white flex flex-col p-[6%] font-sans overflow-hidden">
      <h2 className="text-[#0F1B2D] font-bold text-[1.3em] leading-tight">
        Scope &amp; Features
        {totalSlides > 1 && (
          <span className="text-[0.45em] text-[#8B95A5] font-normal ml-[0.5em]">
            (1/{totalSlides})
          </span>
        )}
      </h2>
      <div className="h-[2px] w-[3em] bg-[#00C8C8] mt-[0.3em] mb-[0.5em] rounded" />

      <div className="flex-1 flex flex-col gap-[0.3em]">
        {features.map((feat) => (
          <div key={feat.id} className="flex min-h-0">
            {/* Accent bar */}
            <div className="w-[2px] bg-[#00C8C8] rounded shrink-0 mr-[0.3em]" />
            <div className="bg-[#F0F2F5] rounded-[0.15em] p-[0.35em] flex-1 overflow-hidden">
              <p className="text-[#0F1B2D] font-bold text-[0.5em] leading-tight truncate">
                {feat.header || "Feature header"}
              </p>
              <p className="text-[#1E293B] text-[0.38em] leading-[1.3] mt-[0.1em] line-clamp-2">
                {feat.description || "Description..."}
              </p>
            </div>
          </div>
        ))}
      </div>

      {features.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-[#8B95A5] text-[0.5em] italic">
          Add features to see preview
        </div>
      )}
    </div>
  );
}
