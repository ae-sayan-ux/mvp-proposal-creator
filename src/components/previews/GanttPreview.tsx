"use client";

import { GanttData } from "@/lib/types";

export default function GanttPreview({ data }: { data: GanttData }) {
  const totalWeeks = data.totalWeeks || 20;
  const phases = data.phases;
  const months = Math.ceil(totalWeeks / 4);

  return (
    <div className="w-full h-full bg-white flex flex-col p-[6%] font-sans overflow-hidden">
      <h2 className="text-[#0F1B2D] font-bold text-[1.3em] leading-tight">
        Project Timeline
      </h2>
      <div className="h-[2px] w-[3em] bg-[#00C8C8] mt-[0.3em] mb-[0.5em] rounded" />

      {/* Chart area */}
      <div className="flex-1 flex flex-col">
        {/* Month headers */}
        <div className="flex ml-[4em]">
          {Array.from({ length: months }, (_, i) => (
            <div
              key={i}
              className="text-[0.35em] text-[#8B95A5] text-center border-l border-[#F0F2F5]"
              style={{ width: `${(4 / totalWeeks) * 100}%` }}
            >
              Month {i + 1}
            </div>
          ))}
        </div>

        <div className="h-[1px] bg-[#8B95A5] ml-[4em] mb-[0.2em]" />

        {/* Phase rows */}
        <div className="flex-1 flex flex-col gap-[0.25em]">
          {phases.map((phase, i) => {
            const left = ((phase.startWeek - 1) / totalWeeks) * 100;
            const width =
              ((phase.endWeek - phase.startWeek + 1) / totalWeeks) * 100;
            return (
              <div key={phase.id} className="flex items-center">
                <span className="text-[#0F1B2D] font-bold text-[0.38em] w-[4em] shrink-0 truncate pr-[0.2em]">
                  {phase.name}
                </span>
                <div
                  className={`flex-1 h-[1em] relative ${
                    i % 2 === 0 ? "bg-[#F0F2F5]" : ""
                  } rounded-[0.1em]`}
                >
                  <div
                    className="absolute top-[0.15em] h-[0.7em] rounded-[0.15em] flex items-center justify-center"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      backgroundColor: `#${phase.color}`,
                    }}
                  >
                    <span className="text-white text-[0.3em] font-bold whitespace-nowrap">
                      W{phase.startWeek}-W{phase.endWeek}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        {phases.length > 0 && (
          <div className="flex gap-[0.5em] justify-center mt-[0.4em] flex-wrap">
            {phases.map((phase) => (
              <div key={phase.id} className="flex items-center gap-[0.15em]">
                <span
                  className="w-[0.5em] h-[0.5em] rounded-[0.08em] inline-block"
                  style={{ backgroundColor: `#${phase.color}` }}
                />
                <span className="text-[#1E293B] text-[0.32em]">{phase.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {phases.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-[#8B95A5] text-[0.5em] italic">
          Add phases to see preview
        </div>
      )}
    </div>
  );
}
