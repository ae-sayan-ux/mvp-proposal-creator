import PptxGenJS from "pptxgenjs";
import { ChallengeData } from "../types";
import { BRAND, SLIDE, FONT } from "../constants";

export function buildChallengeSlide(pptx: PptxGenJS, data: ChallengeData) {
  const slide = pptx.addSlide();
  slide.background = { color: BRAND.white };

  // Section title
  slide.addText("Challenge Overview", {
    x: SLIDE.MARGIN,
    y: 0.4,
    w: SLIDE.W - SLIDE.MARGIN * 2,
    h: 0.7,
    fontSize: 28,
    fontFace: FONT.heading,
    color: BRAND.darkNavy,
    bold: true,
  });

  // Accent underline
  slide.addShape(pptx.ShapeType.rect, {
    x: SLIDE.MARGIN,
    y: 1.15,
    w: 2,
    h: 0.05,
    fill: { color: BRAND.teal },
  });

  // Challenge items (max 4, 2x2 grid)
  const items = data.items.slice(0, 4);
  const cols = 2;
  const cardW = (SLIDE.W - SLIDE.MARGIN * 2 - 0.4) / cols;
  const cardH = 2.0;

  items.forEach((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = SLIDE.MARGIN + col * (cardW + 0.4);
    const y = 1.6 + row * (cardH + 0.3);

    // Card background
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: cardW,
      h: cardH,
      fill: { color: BRAND.lightGray },
      rectRadius: 0.1,
    });

    // Number badge
    slide.addShape(pptx.ShapeType.ellipse, {
      x: x + 0.2,
      y: y + 0.2,
      w: 0.45,
      h: 0.45,
      fill: { color: BRAND.teal },
    });
    slide.addText(String(i + 1), {
      x: x + 0.2,
      y: y + 0.2,
      w: 0.45,
      h: 0.45,
      fontSize: 16,
      fontFace: FONT.heading,
      color: BRAND.white,
      bold: true,
      align: "center",
      valign: "middle",
    });

    // Item title
    slide.addText(item.title, {
      x: x + 0.8,
      y: y + 0.2,
      w: cardW - 1.1,
      h: 0.45,
      fontSize: 14,
      fontFace: FONT.heading,
      color: BRAND.darkNavy,
      bold: true,
      valign: "middle",
    });

    // Item description
    slide.addText(item.description, {
      x: x + 0.2,
      y: y + 0.8,
      w: cardW - 0.4,
      h: cardH - 1.0,
      fontSize: 11,
      fontFace: FONT.body,
      color: BRAND.textDark,
      valign: "top",
      lineSpacingMultiple: 1.2,
    });
  });

  // Additional statement at bottom
  if (data.additionalStatement) {
    slide.addShape(pptx.ShapeType.rect, {
      x: SLIDE.MARGIN,
      y: SLIDE.H - 1.1,
      w: SLIDE.W - SLIDE.MARGIN * 2,
      h: 0.65,
      fill: { color: BRAND.navy },
      rectRadius: 0.08,
    });
    slide.addText(data.additionalStatement, {
      x: SLIDE.MARGIN + 0.3,
      y: SLIDE.H - 1.1,
      w: SLIDE.W - SLIDE.MARGIN * 2 - 0.6,
      h: 0.65,
      fontSize: 12,
      fontFace: FONT.body,
      color: BRAND.white,
      valign: "middle",
      italic: true,
    });
  }
}
