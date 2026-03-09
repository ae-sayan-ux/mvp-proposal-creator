import PptxGenJS from "pptxgenjs";
import fs from "fs";
import path from "path";
import { SolutionData } from "../types";
import { BRAND, FONT } from "../constants";

const LEFT_X = 1.0;
const CARD_X = 6.07;
const CARD_Y = 0.56;
const CARD_W = 6.82;
const CARD_H = 6.39;
const CARD_PAD_X = 0.65;
const CARD_PAD_Y = 0.35;
const ICON_SIZE = 0.28;
const POINT_FONT = 13;
const LINE_H = 0.22;
const CHARS_PER_INCH = 9.0;
const ITEM_TEXT_W = CARD_W - CARD_PAD_X * 2 - ICON_SIZE - 0.18;

// Load checked icon once as base64
let checkedIconData: string | null = null;
function getCheckedIconData(): string | null {
  if (checkedIconData) return checkedIconData;
  try {
    const svgPath = path.join(process.cwd(), "public", "icon-checked.svg");
    const svgContent = fs.readFileSync(svgPath, "utf8");
    checkedIconData = "data:image/svg+xml;base64," + Buffer.from(svgContent).toString("base64");
  } catch {
    checkedIconData = null;
  }
  return checkedIconData;
}

function estimatePointH(point: string): number {
  const lines = Math.max(1, Math.ceil(point.length / (ITEM_TEXT_W * CHARS_PER_INCH)));
  return lines * LINE_H;
}

function paginatePoints(points: string[]): string[][] {
  const available = CARD_H - CARD_PAD_Y * 2;
  const pages: string[][] = [];
  let current: string[] = [];
  let usedH = 0;

  for (const point of points) {
    const h = estimatePointH(point) + 0.15;
    if (current.length > 0 && usedH + h > available) {
      pages.push(current);
      current = [point];
      usedH = h;
    } else {
      current.push(point);
      usedH += h;
    }
  }
  if (current.length > 0 || pages.length === 0) pages.push(current);
  return pages;
}

function buildOneSolutionSlide(
  pptx: PptxGenJS,
  points: string[],
  additionalStatement: string
) {
  const slide = pptx.addSlide();
  slide.background = { color: "F2F3F4" };

  slide.addText("Solution", {
    x: LEFT_X, y: 0.95, w: 5.0, h: 0.85,
    fontSize: 36, fontFace: FONT.headingBlack, color: "FF7A00", bold: true,
  });
  slide.addText("Overview", {
    x: LEFT_X, y: 1.75, w: 5.0, h: 0.85,
    fontSize: 36, fontFace: FONT.headingBlack, color: BRAND.darkBg, bold: true,
  });

  if (additionalStatement) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: LEFT_X, y: 2.75, w: 4.5, h: 0.75,
      fill: { color: BRAND.white }, line: { color: "DBDCDD", width: 1.5 },
      rectRadius: 0.1,
    });
    slide.addText(additionalStatement, {
      x: LEFT_X + 0.2, y: 2.75, w: 4.1, h: 0.75,
      fontSize: 12, fontFace: FONT.body, color: BRAND.darkBg, valign: "middle",
    });
  }

  // White card
  slide.addShape(pptx.ShapeType.roundRect, {
    x: CARD_X, y: CARD_Y, w: CARD_W, h: CARD_H,
    fill: { color: BRAND.white }, line: { color: BRAND.white, width: 0 },
    rectRadius: 0.4,
  });

  const iconData = getCheckedIconData();
  const iconX = CARD_X + CARD_PAD_X;
  const textX = iconX + ICON_SIZE + 0.18;
  const textW = ITEM_TEXT_W;

  // Distribute items evenly across card height
  const totalContentH = points.reduce((sum, p) => sum + estimatePointH(p), 0);
  const available = CARD_H - CARD_PAD_Y * 2;
  const totalGap = Math.max(0, available - totalContentH);
  const gap = points.length > 1 ? totalGap / (points.length - 1) : totalGap / 2;

  let curY = CARD_Y + CARD_PAD_Y + (points.length <= 1 ? totalGap / 2 : 0);

  points.forEach((point) => {
    const pointH = estimatePointH(point);
    const iconY = curY + (pointH - ICON_SIZE) / 2;

    if (iconData) {
      slide.addImage({
        data: iconData,
        x: iconX,
        y: Math.max(iconY, curY),
        w: ICON_SIZE,
        h: ICON_SIZE,
      });
    }

    slide.addText(point, {
      x: textX, y: curY, w: textW, h: pointH,
      fontSize: POINT_FONT, fontFace: FONT.heading,
      color: "6B7280", bold: true, valign: "top",
    });

    curY += pointH + gap;
  });
}

export function buildSolutionSlide(pptx: PptxGenJS, data: SolutionData) {
  const pages = paginatePoints(data.points);
  for (const pagePoints of pages) {
    buildOneSolutionSlide(pptx, pagePoints, data.additionalStatement);
  }
}
