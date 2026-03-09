import PptxGenJS from "pptxgenjs";
import { TeamData } from "../types";
import { BRAND, SLIDE, FONT, ROLE_ICONS } from "../constants";

export function buildTeamSlide(pptx: PptxGenJS, data: TeamData) {
  const slide = pptx.addSlide();
  slide.background = { color: BRAND.white };

  // Title
  slide.addText("Team Composition", {
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

  // Group members by roleType
  const grouped: Record<string, typeof data.members> = {};
  data.members.forEach((m) => {
    const key = m.roleType;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(m);
  });

  const groups = Object.entries(grouped);
  const totalCards = groups.reduce(
    (sum, [, members]) => sum + members.length,
    0
  );
  const maxCols = Math.min(totalCards, 5);
  const cardW = Math.min(
    2.2,
    (SLIDE.W - SLIDE.MARGIN * 2 - (maxCols - 1) * 0.3) / maxCols
  );

  // Draw role type headers + member cards
  let currentY = 1.6;

  groups.forEach(([roleType, members]) => {
    const icon = ROLE_ICONS[roleType] || "\u{1F464}";

    // Role type header row
    slide.addText(`${icon}  ${roleType}s`, {
      x: SLIDE.MARGIN,
      y: currentY,
      w: SLIDE.W - SLIDE.MARGIN * 2,
      h: 0.45,
      fontSize: 16,
      fontFace: FONT.heading,
      color: BRAND.darkNavy,
      bold: true,
      valign: "middle",
    });
    currentY += 0.55;

    // Member cards in a row
    const startX =
      SLIDE.MARGIN +
      (SLIDE.W - SLIDE.MARGIN * 2 - members.length * cardW - (members.length - 1) * 0.3) /
        2;

    members.forEach((member, i) => {
      const x = startX + i * (cardW + 0.3);

      // Card
      slide.addShape(pptx.ShapeType.roundRect, {
        x,
        y: currentY,
        w: cardW,
        h: 1.4,
        fill: { color: BRAND.lightGray },
        rectRadius: 0.08,
        shadow: {
          type: "outer",
          blur: 4,
          offset: 2,
          color: "000000",
          opacity: 0.1,
        },
      });

      // Big icon
      slide.addText(icon, {
        x,
        y: currentY + 0.1,
        w: cardW,
        h: 0.5,
        fontSize: 28,
        align: "center",
        valign: "middle",
      });

      // Seniority
      slide.addText(member.seniority || "", {
        x,
        y: currentY + 0.6,
        w: cardW,
        h: 0.3,
        fontSize: 11,
        fontFace: FONT.body,
        color: BRAND.midGray,
        align: "center",
        valign: "middle",
      });

      // Role label
      slide.addText(member.roleType, {
        x,
        y: currentY + 0.85,
        w: cardW,
        h: 0.3,
        fontSize: 12,
        fontFace: FONT.heading,
        color: BRAND.darkNavy,
        bold: true,
        align: "center",
        valign: "middle",
      });

      // Count
      if (member.count > 1) {
        slide.addText(`×${member.count}`, {
          x: x + cardW - 0.55,
          y: currentY + 0.05,
          w: 0.45,
          h: 0.3,
          fontSize: 11,
          fontFace: FONT.heading,
          color: BRAND.white,
          bold: true,
          align: "center",
          valign: "middle",
          fill: { color: BRAND.teal },
          shape: pptx.ShapeType.roundRect,
          rectRadius: 0.05,
        } as PptxGenJS.TextPropsOptions);
      }
    });

    currentY += 1.7;
  });
}
