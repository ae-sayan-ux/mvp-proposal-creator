import PptxGenJS from "pptxgenjs";
import fs from "fs";
import path from "path";
import { CoverData } from "../types";
import { BRAND, SLIDE, FONT, COMPANY } from "../constants";

let aeLogoData: string | null = null;
function getAeLogoData(): string | null {
  if (aeLogoData) return aeLogoData;
  try {
    const svgPath = path.join(process.cwd(), "public", "agileengine-logo.svg");
    const svgContent = fs.readFileSync(svgPath, "utf8");
    aeLogoData = "data:image/svg+xml;base64," + Buffer.from(svgContent).toString("base64");
  } catch {
    aeLogoData = null;
  }
  return aeLogoData;
}

export function buildCoverSlide(pptx: PptxGenJS, data: CoverData) {
  const slide = pptx.addSlide();

  // Full dark background (#101015)
  slide.background = { color: BRAND.darkBg };

  // Client logo (top-left)
  if (data.clientLogoBase64) {
    slide.addImage({
      data: data.clientLogoBase64,
      x: SLIDE.MARGIN,
      y: 0.6,
      w: 1.67,
      h: 0.83,
      sizing: { type: "contain", w: 1.67, h: 0.83 },
    });
  } else {
    // White placeholder rectangle
    slide.addShape(pptx.ShapeType.rect, {
      x: SLIDE.MARGIN,
      y: 0.6,
      w: 1.67,
      h: 0.83,
      fill: { color: BRAND.white },
      line: { color: BRAND.white, width: 0 },
    });
  }

  // Proposal type / title
  slide.addText(data.title || "Proposal Type", {
    x: SLIDE.MARGIN,
    y: 2.58,
    w: 9,
    h: 1.0,
    fontSize: 42,
    fontFace: FONT.headingBlack,
    color: BRAND.white,
    bold: true,
  });

  // Company name badge (orange rounded rectangle)
  slide.addShape(pptx.ShapeType.roundRect, {
    x: SLIDE.MARGIN,
    y: 3.65,
    w: Math.min((data.clientName || COMPANY.name).length * 0.18 + 0.5, 5),
    h: 0.55,
    fill: { color: BRAND.orange },
    line: { color: BRAND.orange, width: 0 },
    rectRadius: 0.1,
  });
  slide.addText(data.clientName || "Company Name", {
    x: SLIDE.MARGIN,
    y: 3.65,
    w: Math.min((data.clientName || COMPANY.name).length * 0.18 + 0.5, 5),
    h: 0.55,
    fontSize: 18,
    fontFace: FONT.heading,
    color: BRAND.white,
    bold: true,
    align: "center",
    valign: "middle",
  });

  // AgileEngine logo (bottom-left)
  const logoData = getAeLogoData();
  if (logoData) {
    slide.addImage({ data: logoData, x: SLIDE.MARGIN, y: 6.4, w: 1.33, h: 0.5 });
  }
}
