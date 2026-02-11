"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import StepIndicator from "./ui/StepIndicator";
import DraftsManager from "./ui/DraftsManager";
import SlidePreview from "./previews/SlidePreview";
import CoverStep from "./steps/CoverStep";
import ChallengeStep from "./steps/ChallengeStep";
import SolutionStep from "./steps/SolutionStep";
import ScopeStep from "./steps/ScopeStep";
import TeamStep from "./steps/TeamStep";
import GanttStep from "./steps/GanttStep";
import RiskStep from "./steps/RiskStep";
import { ProposalData, OutputFormat } from "@/lib/types";
import { PHASE_COLORS, DEFAULT_GANTT_WEEKS } from "@/lib/constants";
import { autoSave, loadAutoSave, clearAutoSave } from "@/lib/drafts";

const STEP_LABELS = [
  "Cover",
  "Challenges",
  "Solution",
  "Scope",
  "Team",
  "Timeline",
  "Risk",
];

function initialData(): ProposalData {
  return {
    cover: { title: "", description: "", clientName: "" },
    challenge: { items: [], additionalStatement: "" },
    solution: { points: [] },
    scope: { features: [] },
    team: { members: [] },
    gantt: {
      totalWeeks: DEFAULT_GANTT_WEEKS,
      phases: [
        {
          id: "p1",
          name: "Discovery",
          startWeek: 1,
          endWeek: 4,
          color: PHASE_COLORS["Discovery"],
        },
        {
          id: "p2",
          name: "MVP",
          startWeek: 5,
          endWeek: 16,
          color: PHASE_COLORS["MVP"],
        },
      ],
    },
    risk: { nodes: [], links: [] },
  };
}

export default function ProposalWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ProposalData>(initialData);
  const [format, setFormat] = useState<OutputFormat>("pptx");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [autoSaved, setAutoSaved] = useState(false);
  const [restored, setRestored] = useState(false);

  // ── Restore auto-save on mount ────────────────────────────
  useEffect(() => {
    const saved = loadAutoSave();
    if (saved?.data) {
      setData(saved.data);
      setRestored(true);
      // Fade out the "restored" indicator after 3 seconds
      setTimeout(() => setRestored(false), 3000);
    }
  }, []);

  // ── Auto-save on every change (debounced 1s) ─────────────
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleAutoSave = useCallback((d: ProposalData) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      autoSave(d);
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 1500);
    }, 1000);
  }, []);

  const handleDataChange = useCallback(
    (updater: (prev: ProposalData) => ProposalData) => {
      setData((prev) => {
        const next = updater(prev);
        scheduleAutoSave(next);
        return next;
      });
    },
    [scheduleAutoSave]
  );

  // ── Navigation ────────────────────────────────────────────
  const goToStep = (s: number) => {
    setStep(Math.max(0, Math.min(STEP_LABELS.length - 1, s)));
  };

  // ── Generate ──────────────────────────────────────────────
  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, format }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Generation failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `proposal-${data.cover.clientName || "draft"}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setGenerating(false);
    }
  };

  // ── Load from draft ───────────────────────────────────────
  const handleLoadDraft = (d: ProposalData) => {
    setData(d);
    setStep(0);
    clearAutoSave();
    autoSave(d);
  };

  const isLastStep = step === STEP_LABELS.length - 1;

  return (
    <div>
      {/* Top bar: steps + drafts */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <StepIndicator
            steps={STEP_LABELS}
            currentStep={step}
            onStepClick={goToStep}
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Auto-save / restore indicators */}
          {autoSaved && (
            <span className="text-[10px] text-gray-400 transition-opacity">
              Auto-saved
            </span>
          )}
          {restored && (
            <span className="text-[10px] text-teal-500 font-medium animate-pulse">
              Restored previous session
            </span>
          )}
          <DraftsManager
            currentData={data}
            onLoad={handleLoadDraft}
            activeDraftId={activeDraftId}
            onActiveDraftChange={setActiveDraftId}
          />
        </div>
      </div>

      {/* Main layout: preview on left (dominant), form on right */}
      <div className="flex flex-col-reverse lg:flex-row gap-6 lg:gap-8">
        {/* Preview panel — left */}
        <div className="flex-1 min-w-0 lg:sticky lg:top-6 lg:self-start">
          <SlidePreview step={step} data={data} />
        </div>

        {/* Form panel — right */}
        <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0">
          <div className="lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto lg:pr-1 lg:-mr-1 custom-scrollbar">
            {step === 0 && (
              <CoverStep
                data={data.cover}
                onChange={(cover) =>
                  handleDataChange((d) => ({ ...d, cover }))
                }
              />
            )}
            {step === 1 && (
              <ChallengeStep
                data={data.challenge}
                onChange={(challenge) =>
                  handleDataChange((d) => ({ ...d, challenge }))
                }
              />
            )}
            {step === 2 && (
              <SolutionStep
                data={data.solution}
                onChange={(solution) =>
                  handleDataChange((d) => ({ ...d, solution }))
                }
              />
            )}
            {step === 3 && (
              <ScopeStep
                data={data.scope}
                onChange={(scope) =>
                  handleDataChange((d) => ({ ...d, scope }))
                }
              />
            )}
            {step === 4 && (
              <TeamStep
                data={data.team}
                onChange={(team) =>
                  handleDataChange((d) => ({ ...d, team }))
                }
              />
            )}
            {step === 5 && (
              <GanttStep
                data={data.gantt}
                onChange={(gantt) =>
                  handleDataChange((d) => ({ ...d, gantt }))
                }
              />
            )}
            {step === 6 && (
              <RiskStep
                data={data.risk}
                onChange={(risk) =>
                  handleDataChange((d) => ({ ...d, risk }))
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-5">
        <button
          type="button"
          onClick={() => goToStep(step - 1)}
          disabled={step === 0}
          className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
        >
          Back
        </button>

        <div className="flex items-center gap-3">
          {isLastStep && (
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as OutputFormat)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="pptx">Download PPTX</option>
              <option value="pdf">Download PDF</option>
            </select>
          )}

          {isLastStep ? (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="rounded-xl bg-teal-600 px-8 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              {generating ? "Generating..." : "Generate Proposal"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => goToStep(step + 1)}
              className="rounded-xl bg-teal-600 px-8 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
