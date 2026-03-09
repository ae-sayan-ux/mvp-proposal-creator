import PptxGenJS from "pptxgenjs";
import fs from "fs";
import path from "path";
import { ChallengeData, ChallengeItem } from "../types";
import { BRAND, FONT } from "../constants";

const LEFT_X = 1.0;
const CARD_X = 6.07;
const CARD_Y = 0.56;
const CARD_W = 6.82;
const CARD_H = 6.39;
const CARD_PAD_X = 0.65;
const CARD_PAD_Y = 0.35;
const ITEM_GAP = 0.18;
const TITLE_FONT = 13;
const DESC_FONT = 11;
const TITLE_LINE_H = 0.24;
const DESC_LINE_H = 0.20;
const ITEM_TEXT_W = CARD_W - CARD_PAD_X * 2;
const CHARS_PER_INCH_TITLE = 8.5;
const CHARS_PER_INCH_DESC = 9.5;

// Load speech bubble icon once as base64
let speechBubbleData: string | null = null;
function getSpeechBubbleData(): string | null {
  if (speechBubbleData) return speechBubbleData;
  try {
    const svgPath = path.join(process.cwd(), "public", "icon-speech-bubble.svg");
    const svgContent = fs.readFileSync(svgPath, "utf8");
    speechBubbleData = "data:image/svg+xml;base64," + Buffer.from(svgContent).toString("base64");
  } catch {
    speechBubbleData = null;
  }
  return speechBubbleData;
}

function estimateItemH(item: ChallengeItem): number {
  const titleLines = Math.max(1, Math.ceil(item.title.length / (ITEM_TEXT_W * CHARS_PER_INCH_TITLE)));
  const descLines = item.description
    ? Math.max(1, Math.ceil(item.description.length / (ITEM_TEXT_W * CHARS_PER_INCH_DESC)))
    : 0;
  return titleLines * TITLE_LINE_H + descLines * DESC_LINE_H;
}

function paginateItems(items: ChallengeItem[]): ChallengeItem[][] {
  const available = CARD_H - CARD_PAD_Y * 2;
  const pages: ChallengeItem[][] = [];
  let current: ChallengeItem[] = [];
  let usedH = 0;

  for (const item of items) {
    const h = estimateItemH(item) + ITEM_GAP;
    if (current.length > 0 && usedH + h > available) {
      pages.push(current);
      current = [item];
      usedH = h;
    } else {
      current.push(item);
      usedH += h;
    }
  }
  if (current.length > 0 || pages.length === 0) pages.push(current);
  return pages;
}

function buildOneChallengeSlide(
  pptx: PptxGenJS,
  items: ChallengeItem[],
  additionalStatement: string
) {
  const slide = pptx.addSlide();
  slide.background = { color: "F2F3F4" };

  slide.addText("Challenge", {
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

  const iconData = getSpeechBubbleData();
  const iconSize = 0.32;
  const textX = CARD_X + CARD_PAD_X + iconSize + 0.15;
  const textW = ITEM_TEXT_W - iconSize - 0.15;

  // Distribute items evenly across the card height
  const totalContentH = items.reduce((sum, item) => sum + estimateItemH(item), 0);
  const available = CARD_H - CARD_PAD_Y * 2;
  const totalGap = Math.max(0, available - totalContentH);
  const gap = items.length > 1 ? totalGap / (items.length - 1) : totalGap / 2;

  let curY = CARD_Y + CARD_PAD_Y + (items.length <= 1 ? totalGap / 2 : 0);

  items.forEach((item) => {
    const titleLines = Math.max(1, Math.ceil(item.title.length / (textW * CHARS_PER_INCH_TITLE)));
    const descLines = item.description
      ? Math.max(1, Math.ceil(item.description.length / (textW * CHARS_PER_INCH_DESC)))
      : 0;
    const titleH = titleLines * TITLE_LINE_H;
    const descH = descLines * DESC_LINE_H;
    const itemH = titleH + descH;

    // Speech bubble icon
    if (iconData) {
      slide.addImage({
        data: iconData,
        x: CARD_X + CARD_PAD_X,
        y: curY + titleH / 2 - iconSize / 2,
        w: iconSize,
        h: iconSize,
      });
    }

    // Title
    slide.addText(item.title, {
      x: textX, y: curY, w: textW, h: titleH,
      fontSize: TITLE_FONT, fontFace: FONT.heading,
      color: "1A1A1A", bold: true, valign: "top",
    });

    // Description
    if (item.description) {
      slide.addText(item.description, {
        x: textX, y: curY + titleH, w: textW, h: descH,
        fontSize: DESC_FONT, fontFace: FONT.body,
        color: "6B7280", valign: "top",
      });
    }

    curY += itemH + gap;
  });
}

export function buildChallengeSlide(pptx: PptxGenJS, data: ChallengeData) {
  const pages = paginateItems(data.items);
  for (const pageItems of pages) {
    buildOneChallengeSlide(pptx, pageItems, data.additionalStatement);
  }
}
