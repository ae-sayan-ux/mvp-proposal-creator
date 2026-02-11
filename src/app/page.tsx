import ProposalWizard from "@/components/ProposalWizard";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Proposal Generator
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in each section and see a live preview of your slides. Then
          generate a polished PPTX or PDF.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <ProposalWizard />
      </div>
    </main>
  );
}
