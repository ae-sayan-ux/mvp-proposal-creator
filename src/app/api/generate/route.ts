import { NextRequest, NextResponse } from "next/server";
import { generatePptx } from "@/lib/generate-pptx";
import { ProposalData, OutputFormat } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      data: ProposalData;
      format: OutputFormat;
    };

    if (!body.data) {
      return NextResponse.json(
        { error: "Missing `data` in request body." },
        { status: 400 }
      );
    }

    const format = body.format || "pptx";

    if (format === "pptx") {
      const buffer = await generatePptx(body.data);
      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "Content-Disposition": `attachment; filename="proposal-${body.data.cover.clientName || "draft"}.pptx"`,
        },
      });
    }

    // PDF fallback (future)
    return NextResponse.json(
      { error: "PDF generation coming soon. Please use PPTX for now." },
      { status: 400 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Generate error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
