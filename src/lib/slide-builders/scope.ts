import PptxGenJS from "pptxgenjs";
import { ScopeData } from "../types";
import { BRAND, SLIDE, FONT } from "../constants";

const FEATURES_PER_SLIDE = 4;

export function buildScopeSlides(pptx: PptxGenJS, data: ScopeData) {
  const features = data.features;
  const totalSlides = Math.ceil(features.length / FEATURES_PER_SLIDE);

  for (let s = 0; s < totalSlides; s++) {
    const slide = pptx.addSlide();
    slide.background = { color: BRAND.white };

    const pageLabel =
      totalSlides > 1 ? ` (${s + 1}/${totalSlides})` : "";

    // Title
    slide.addText(`Scope & Features${pageLabel}`, {
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

    // Features for this page
    const pageFeatures = features.slice(
      s * FEATURES_PER_SLIDE,
      (s + 1) * FEATURES_PER_SLIDE
    );

    const cardH = 1.2;
    const gap = 0.2;
    const startY = 1.5;

    pageFeatures.forEach((feat, i) => {
      const y = startY + i * (cardH + gap);

      // Left accent bar
      slide.addShape(pptx.ShapeType.rect, {
        x: SLIDE.MARGIN,
        y,
        w: 0.06,
        h: cardH,
        fill: { color: BRAND.teal },
      });

      // Card background
      slide.addShape(pptx.ShapeType.roundRect, {
        x: SLIDE.MARGIN + 0.12,
        y,
        w: SLIDE.W - SLIDE.MARGIN * 2 - 0.12,
        h: cardH,
        fill: { color: BRAND.lightGray },
        rectRadius: 0.06,
      });

      // Feature header
      slide.addText(feat.header, {
        x: SLIDE.MARGIN + 0.35,
        y,
        w: SLIDE.W - SLIDE.MARGIN * 2 - 0.6,
        h: 0.45,
        fontSize: 15,
        fontFace: FONT.heading,
        color: BRAND.darkNavy,
        bold: true,
        valign: "bottom",
      });

      // Feature description
      slide.addText(feat.description, {
        x: SLIDE.MARGIN + 0.35,
        y: y + 0.45,
        w: SLIDE.W - SLIDE.MARGIN * 2 - 0.6,
        h: cardH - 0.55,
        fontSize: 11,
        fontFace: FONT.body,
        color: BRAND.textDark,
        valign: "top",
        lineSpacingMultiple: 1.15,
      });
    });
  }
}
