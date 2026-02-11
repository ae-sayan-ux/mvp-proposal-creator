"use client";

import { CoverData } from "@/lib/types";
import { useRef } from "react";

interface Props {
  data: CoverData;
  onChange: (d: CoverData) => void;
}

export default function CoverStep({ data, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange({ ...data, clientLogoBase64: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">Cover Slide</h2>
      <p className="text-sm text-gray-500">
        Set up the title page of your proposal.
      </p>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">
          Proposal Title *
        </span>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          placeholder="Discovery Proposal"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">
          Short Description
        </span>
        <input
          type="text"
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          placeholder="Design & Technical Assessment"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-gray-700">
          Client Name *
        </span>
        <input
          type="text"
          value={data.clientName}
          onChange={(e) => onChange({ ...data, clientName: e.target.value })}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          placeholder="Acme Corp"
        />
      </label>

      <div>
        <span className="text-sm font-medium text-gray-700 block mb-1">
          Client Logo (optional)
        </span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogo}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {data.clientLogoBase64 ? "\u2713 Logo uploaded" : "Upload logo image"}
        </button>
        {data.clientLogoBase64 && (
          <button
            type="button"
            onClick={() => onChange({ ...data, clientLogoBase64: undefined })}
            className="ml-2 text-xs text-red-500 hover:underline"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
