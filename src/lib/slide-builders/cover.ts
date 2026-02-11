import PptxGenJS from "pptxgenjs";
import { CoverData } from "../types";
import { BRAND, SLIDE, FONT, COMPANY } from "../constants";

export function buildCoverSlide(pptx: PptxGenJS, data: CoverData) {
  const slide = pptx.addSlide();

  // Full dark background
  slide.background = { color: BRAND.darkNavy };

  // AgileEngine logo text (top-left)
  slide.addText(COMPANY.name, {
    x: SLIDE.MARGIN,
    y: 0.4,
    w: 4,
    h: 0.5,
    fontSize: 16,
    fontFace: FONT.heading,
    color: BRAND.teal,
    bold: true,
  });

  // Title
  slide.addText(data.title || "Proposal", {
    x: SLIDE.MARGIN,
    y: 2.2,
    w: 8,
    h: 1.2,
    fontSize: 44,
    fontFace: FONT.heading,
    color: BRAND.white,
    bold: true,
  });

  // Description
  if (data.description) {
    slide.addText(data.description, {
      x: SLIDE.MARGIN,
      y: 3.5,
      w: 8,
      h: 0.8,
      fontSize: 18,
      fontFace: FONT.body,
      color: BRAND.midGray,
    });
  }

  // Client name
  slide.addText(data.clientName || "", {
    x: SLIDE.MARGIN,
    y: 4.6,
    w: 8,
    h: 0.6,
    fontSize: 24,
    fontFace: FONT.heading,
    color: BRAND.teal,
    bold: true,
  });

  // Client logo (top-right if provided)
  if (data.clientLogoBase64) {
    slide.addImage({
      data: data.clientLogoBase64,
      x: SLIDE.W - SLIDE.MARGIN - 2.5,
      y: 0.4,
      w: 2.5,
      h: 1.2,
      sizing: { type: "contain", w: 2.5, h: 1.2 },
    });
  }

  // Bottom accent line
  slide.addShape(pptx.ShapeType.rect, {
    x: SLIDE.MARGIN,
    y: SLIDE.H - 0.6,
    w: SLIDE.W - SLIDE.MARGIN * 2,
    h: 0.04,
    fill: { color: BRAND.teal },
  });
}
