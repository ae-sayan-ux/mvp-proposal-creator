import PptxGenJS from "pptxgenjs";
import { GanttData } from "../types";
import { BRAND, SLIDE, FONT } from "../constants";

export function buildGanttSlide(pptx: PptxGenJS, data: GanttData) {
  const slide = pptx.addSlide();
  slide.background = { color: BRAND.white };

  // Title
  slide.addText("Project Timeline", {
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

  const totalWeeks = data.totalWeeks || 20;
  const phases = data.phases;

  const chartX = SLIDE.MARGIN + 1.8;
  const chartW = SLIDE.W - chartX - SLIDE.MARGIN;
  const chartY = 1.6;
  const rowH = 0.65;
  const headerH = 0.5;
  const weekW = chartW / totalWeeks;

  // Month labels along the top
  const monthsToShow = Math.ceil(totalWeeks / 4);
  for (let m = 0; m < monthsToShow; m++) {
    const x = chartX + m * 4 * weekW;
    const w = Math.min(4 * weekW, chartX + chartW - x);
    slide.addText(`Month ${m + 1}`, {
      x,
      y: chartY,
      w,
      h: headerH,
      fontSize: 10,
      fontFace: FONT.body,
      color: BRAND.midGray,
      align: "center",
      valign: "middle",
    });

    // Vertical divider
    if (m > 0) {
      slide.addShape(pptx.ShapeType.rect, {
        x,
        y: chartY,
        w: 0.01,
        h: headerH + phases.length * rowH,
        fill: { color: BRAND.lightGray },
      });
    }
  }

  // Header bottom line
  slide.addShape(pptx.ShapeType.rect, {
    x: chartX,
    y: chartY + headerH,
    w: chartW,
    h: 0.02,
    fill: { color: BRAND.midGray },
  });

  // Phase rows
  phases.forEach((phase, i) => {
    const y = chartY + headerH + 0.1 + i * rowH;
    const barColor = phase.color || BRAND.teal;

    // Phase label (left column)
    slide.addText(phase.name, {
      x: SLIDE.MARGIN,
      y,
      w: 1.7,
      h: rowH - 0.1,
      fontSize: 12,
      fontFace: FONT.heading,
      color: BRAND.darkNavy,
      bold: true,
      valign: "middle",
    });

    // Alternating row background
    if (i % 2 === 0) {
      slide.addShape(pptx.ShapeType.rect, {
        x: chartX,
        y,
        w: chartW,
        h: rowH - 0.1,
        fill: { color: BRAND.lightGray },
      });
    }

    // Gantt bar
    const startX = chartX + (phase.startWeek - 1) * weekW;
    const barW = (phase.endWeek - phase.startWeek + 1) * weekW;
    const barH = 0.35;
    const barY = y + (rowH - 0.1 - barH) / 2;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: startX,
      y: barY,
      w: barW,
      h: barH,
      fill: { color: barColor },
      rectRadius: 0.06,
    });

    // Weeks text on the bar
    slide.addText(`W${phase.startWeek}–W${phase.endWeek}`, {
      x: startX,
      y: barY,
      w: barW,
      h: barH,
      fontSize: 9,
      fontFace: FONT.body,
      color: BRAND.white,
      bold: true,
      align: "center",
      valign: "middle",
    });
  });

  // Legend at bottom
  const legendY = chartY + headerH + 0.1 + phases.length * rowH + 0.3;
  const legendItemW = 1.8;
  const legendStartX =
    (SLIDE.W - phases.length * legendItemW) / 2;

  phases.forEach((phase, i) => {
    const x = legendStartX + i * legendItemW;

    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y: legendY,
      w: 0.25,
      h: 0.25,
      fill: { color: phase.color || BRAND.teal },
      rectRadius: 0.04,
    });

    slide.addText(phase.name, {
      x: x + 0.32,
      y: legendY,
      w: legendItemW - 0.4,
      h: 0.25,
      fontSize: 10,
      fontFace: FONT.body,
      color: BRAND.textDark,
      valign: "middle",
    });
  });
}
