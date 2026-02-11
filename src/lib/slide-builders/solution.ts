import PptxGenJS from "pptxgenjs";
import { SolutionData } from "../types";
import { BRAND, SLIDE, FONT } from "../constants";

export function buildSolutionSlide(pptx: PptxGenJS, data: SolutionData) {
  const slide = pptx.addSlide();
  slide.background = { color: BRAND.white };

  // Section title
  slide.addText("Solution Overview", {
    x: SLIDE.MARGIN,
    y: 0.4,
    w: SLIDE.W - SLIDE.MARGIN * 2,
    h: 0.7,
    fontSize: 28,
    fontFace: FONT.heading,
    color: BRAND.darkNavy,
    bold: true,
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: SLIDE.MARGIN,
    y: 1.15,
    w: 2,
    h: 0.05,
    fill: { color: BRAND.teal },
  });

  // Points in 2-column layout (max 10)
  const points = data.points.slice(0, 10);
  const cols = 2;
  const perCol = Math.ceil(points.length / cols);
  const colW = (SLIDE.W - SLIDE.MARGIN * 2 - 0.5) / cols;
  const startY = 1.6;
  const rowH = 0.52;

  points.forEach((point, i) => {
    const col = Math.floor(i / perCol);
    const row = i % perCol;
    const x = SLIDE.MARGIN + col * (colW + 0.5);
    const y = startY + row * rowH;

    // Checkmark circle
    slide.addShape(pptx.ShapeType.ellipse, {
      x,
      y: y + 0.05,
      w: 0.32,
      h: 0.32,
      fill: { color: BRAND.teal },
    });
    slide.addText("\u2713", {
      x,
      y: y + 0.05,
      w: 0.32,
      h: 0.32,
      fontSize: 14,
      fontFace: FONT.heading,
      color: BRAND.white,
      bold: true,
      align: "center",
      valign: "middle",
    });

    // Point text
    slide.addText(point, {
      x: x + 0.42,
      y,
      w: colW - 0.5,
      h: rowH,
      fontSize: 12,
      fontFace: FONT.body,
      color: BRAND.textDark,
      valign: "middle",
      lineSpacingMultiple: 1.1,
    });
  });
}
