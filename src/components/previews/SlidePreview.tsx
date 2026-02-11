"use client";

import { ProposalData } from "@/lib/types";
import CoverPreview from "./CoverPreview";
import ChallengePreview from "./ChallengePreview";
import SolutionPreview from "./SolutionPreview";
import ScopePreview from "./ScopePreview";
import TeamPreview from "./TeamPreview";
import GanttPreview from "./GanttPreview";
import RiskPreview from "./RiskPreview";

interface Props {
  step: number;
  data: ProposalData;
}

const SLIDE_LABELS = [
  "Cover",
  "Challenge Overview",
  "Solution Overview",
  "Scope & Features",
  "Team Composition",
  "Project Timeline",
  "Risk Escalation",
];

export default function SlidePreview({ step, data }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Label */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Live Preview
        </span>
        <span className="text-xs text-gray-300">|</span>
        <span className="text-xs font-medium text-teal-600">
          Slide {step + 1}: {SLIDE_LABELS[step]}
        </span>
      </div>

      {/* 16:9 slide container — fills available width */}
      <div className="w-full">
        <div
          className="relative w-full rounded-xl overflow-hidden shadow-xl border border-gray-200/80 ring-1 ring-black/5"
          style={{ paddingBottom: "56.25%" /* 9/16 */ }}
        >
          <div
            className="absolute inset-0"
            style={{ fontSize: "clamp(10px, 2.4vw, 20px)" }}
          >
            {step === 0 && <CoverPreview data={data.cover} />}
            {step === 1 && <ChallengePreview data={data.challenge} />}
            {step === 2 && <SolutionPreview data={data.solution} />}
            {step === 3 && <ScopePreview data={data.scope} />}
            {step === 4 && <TeamPreview data={data.team} />}
            {step === 5 && <GanttPreview data={data.gantt} />}
            {step === 6 && <RiskPreview data={data.risk} />}
          </div>
        </div>
      </div>
    </div>
  );
}
