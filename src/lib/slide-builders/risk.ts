import PptxGenJS from "pptxgenjs";
import { RiskData } from "../types";
import { BRAND, SLIDE, FONT } from "../constants";

/**
 * Builds a reporting/escalation matrix slide.
 * Nodes are laid out in a top-down hierarchy and connected with arrows.
 * Layout: topmost row = escalation targets, bottom rows = reporters.
 */
export function buildRiskSlide(pptx: PptxGenJS, data: RiskData) {
  const slide = pptx.addSlide();
  slide.background = { color: BRAND.white };

  // Title
  slide.addText("Risk Escalation & Management", {
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

  if (data.nodes.length === 0) return;

  // Build adjacency: who reports to whom
  const childrenOf: Record<string, string[]> = {};
  const hasParent = new Set<string>();

  data.links.forEach((link) => {
    if (!childrenOf[link.toId]) childrenOf[link.toId] = [];
    childrenOf[link.toId].push(link.fromId);
    hasParent.add(link.fromId);
  });

  // Roots = nodes nobody reports FROM (i.e. top of chain)
  const roots = data.nodes.filter((n) => !hasParent.has(n.id));
  if (roots.length === 0) roots.push(data.nodes[0]);

  // BFS to assign levels
  const levels: Record<string, number> = {};
  const queue = roots.map((r) => r.id);
  roots.forEach((r) => (levels[r.id] = 0));

  while (queue.length > 0) {
    const current = queue.shift()!;
    const children = childrenOf[current] || [];
    children.forEach((childId) => {
      if (levels[childId] === undefined) {
        levels[childId] = (levels[current] || 0) + 1;
        queue.push(childId);
      }
    });
  }

  // Ensure all nodes have a level
  data.nodes.forEach((n) => {
    if (levels[n.id] === undefined) levels[n.id] = 0;
  });

  // Group by level
  const byLevel: Record<number, typeof data.nodes> = {};
  let maxLevel = 0;
  data.nodes.forEach((n) => {
    const lvl = levels[n.id];
    if (!byLevel[lvl]) byLevel[lvl] = [];
    byLevel[lvl].push(n);
    if (lvl > maxLevel) maxLevel = lvl;
  });

  const chartY = 1.6;
  const chartH = SLIDE.H - chartY - 0.6;
  const levelH = chartH / (maxLevel + 1);
  const nodeW = 2.2;
  const nodeH = 0.8;

  // Compute positions
  const positions: Record<string, { cx: number; cy: number }> = {};

  for (let lvl = 0; lvl <= maxLevel; lvl++) {
    const nodesAtLevel = byLevel[lvl] || [];
    const totalW = nodesAtLevel.length * nodeW + (nodesAtLevel.length - 1) * 0.4;
    const startX = (SLIDE.W - totalW) / 2;

    nodesAtLevel.forEach((node, i) => {
      const cx = startX + i * (nodeW + 0.4) + nodeW / 2;
      const cy = chartY + lvl * levelH + nodeH / 2;
      positions[node.id] = { cx, cy };
    });
  }

  // Draw connector lines first (behind nodes)
  data.links.forEach((link) => {
    const from = positions[link.fromId];
    const to = positions[link.toId];
    if (!from || !to) return;

    // Draw line from child (bottom) up to parent (top)
    const x1 = from.cx;
    const y1 = from.cy - nodeH / 2; // top of child
    const x2 = to.cx;
    const y2 = to.cy + nodeH / 2; // bottom of parent

    slide.addShape(pptx.ShapeType.line, {
      x: Math.min(x1, x2) - 0.01,
      y: Math.min(y1, y2),
      w: Math.abs(x2 - x1) + 0.02,
      h: Math.abs(y2 - y1),
      line: { color: BRAND.midGray, width: 1.5, dashType: "solid" },
      flipV: y1 < y2,
      flipH: x1 > x2,
    });

    // Arrow label
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    if (link.label) {
      slide.addText(link.label, {
        x: midX - 0.6,
        y: midY - 0.15,
        w: 1.2,
        h: 0.3,
        fontSize: 8,
        fontFace: FONT.body,
        color: BRAND.midGray,
        align: "center",
        valign: "middle",
        italic: true,
      });
    }
  });

  // Draw nodes
  data.nodes.forEach((node) => {
    const pos = positions[node.id];
    if (!pos) return;

    const x = pos.cx - nodeW / 2;
    const y = pos.cy - nodeH / 2;

    const isRoot = !hasParent.has(node.id);

    // Node box
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: nodeW,
      h: nodeH,
      fill: { color: isRoot ? BRAND.darkNavy : BRAND.lightGray },
      rectRadius: 0.08,
      shadow: {
        type: "outer",
        blur: 3,
        offset: 1,
        color: "000000",
        opacity: 0.12,
      },
    });

    // Role
    slide.addText(node.role, {
      x,
      y,
      w: nodeW,
      h: nodeH * 0.5,
      fontSize: 10,
      fontFace: FONT.body,
      color: isRoot ? BRAND.teal : BRAND.midGray,
      align: "center",
      valign: "bottom",
    });

    // Name
    slide.addText(node.name || node.role, {
      x,
      y: y + nodeH * 0.45,
      w: nodeW,
      h: nodeH * 0.5,
      fontSize: 12,
      fontFace: FONT.heading,
      color: isRoot ? BRAND.white : BRAND.darkNavy,
      bold: true,
      align: "center",
      valign: "top",
    });
  });
}
