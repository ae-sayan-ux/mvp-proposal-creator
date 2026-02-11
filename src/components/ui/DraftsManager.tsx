"use client";

import { useState, useEffect, useCallback } from "react";
import { Draft, listDrafts, saveDraft, deleteDraft, loadDraft } from "@/lib/drafts";
import { ProposalData } from "@/lib/types";

interface Props {
  currentData: ProposalData;
  onLoad: (data: ProposalData) => void;
  activeDraftId: string | null;
  onActiveDraftChange: (id: string | null) => void;
}

export default function DraftsManager({
  currentData,
  onLoad,
  activeDraftId,
  onActiveDraftChange,
}: Props) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [open, setOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const refresh = useCallback(() => setDrafts(listDrafts()), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleSave = () => {
    if (!saveName.trim()) return;
    const draft = saveDraft(saveName.trim(), currentData);
    onActiveDraftChange(draft.id);
    setSaveName("");
    setShowSaveInput(false);
    refresh();
    // toast
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleLoad = (id: string) => {
    const draft = loadDraft(id);
    if (!draft) return;
    onLoad(draft.data);
    onActiveDraftChange(draft.id);
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteDraft(id);
    if (activeDraftId === id) onActiveDraftChange(null);
    refresh();
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Save button */}
        {showSaveInput ? (
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="Draft name..."
              autoFocus
              className="rounded border border-gray-300 px-2 py-1 text-xs w-36 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={!saveName.trim()}
              className="rounded bg-teal-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-teal-700 disabled:opacity-40 transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowSaveInput(false)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowSaveInput(true)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Draft
          </button>
        )}

        {/* Load drafts toggle */}
        <button
          type="button"
          onClick={() => { setOpen(!open); refresh(); }}
          className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          Drafts{drafts.length > 0 && ` (${drafts.length})`}
        </button>

        {/* Saved toast */}
        {savedToast && (
          <span className="text-xs text-teal-600 font-medium animate-pulse">
            Saved!
          </span>
        )}
      </div>

      {/* Drafts dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Saved Drafts
            </p>
          </div>
          {drafts.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-gray-400">
              No saved drafts yet.
            </div>
          ) : (
            <ul className="max-h-60 overflow-y-auto custom-scrollbar divide-y divide-gray-50">
              {drafts.map((draft) => (
                <li
                  key={draft.id}
                  className={`flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 transition-colors ${
                    activeDraftId === draft.id ? "bg-teal-50" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleLoad(draft.id)}
                    className="flex-1 text-left min-w-0"
                  >
                    <span className="block text-sm font-medium text-gray-800 truncate">
                      {draft.name}
                    </span>
                    <span className="block text-[10px] text-gray-400">
                      {formatDate(draft.updatedAt)}
                      {draft.data.cover.clientName &&
                        ` \u00B7 ${draft.data.cover.clientName}`}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(draft.id);
                    }}
                    className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                    title="Delete draft"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
