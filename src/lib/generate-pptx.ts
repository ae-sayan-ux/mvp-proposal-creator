import PptxGenJS from "pptxgenjs";
import { ProposalData } from "./types";
import { buildCoverSlide } from "./slide-builders/cover";
import { buildChallengeSlide } from "./slide-builders/challenge";
import { buildSolutionSlide } from "./slide-builders/solution";
import { buildScopeSlides } from "./slide-builders/scope";
import { buildTeamSlide } from "./slide-builders/team";
import { buildGanttSlide } from "./slide-builders/gantt";
import { buildRiskSlide } from "./slide-builders/risk";

export async function generatePptx(data: ProposalData): Promise<Buffer> {
  const pptx = new PptxGenJS();

  pptx.layout = "LAYOUT_WIDE"; // 13.33 × 7.5 inches (16:9)
  pptx.author = "AgileEngine";
  pptx.company = "AgileEngine";
  pptx.title = `${data.cover.title} - ${data.cover.clientName}`;

  // 1. Cover
  buildCoverSlide(pptx, data.cover);

  // 2. Challenge Overview
  buildChallengeSlide(pptx, data.challenge);

  // 3. Solution Overview
  buildSolutionSlide(pptx, data.solution);

  // 4. Scope Features (may produce multiple slides)
  buildScopeSlides(pptx, data.scope);

  // 5. Team Composition
  buildTeamSlide(pptx, data.team);

  // 6. Gantt / Timeline
  buildGanttSlide(pptx, data.gantt);

  // 7. Risk Escalation
  buildRiskSlide(pptx, data.risk);

  // Generate buffer
  const output = await pptx.write({ outputType: "nodebuffer" });
  return output as Buffer;
}
