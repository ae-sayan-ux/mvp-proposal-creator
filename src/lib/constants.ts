/* ─── AgileEngine brand palette ───────────────────────────── */
export const BRAND = {
  darkNavy: "0F1B2D",
  darkBg: "101015",
  navy: "1A2744",
  teal: "00C8C8",
  orange: "FF5900",
  white: "FFFFFF",
  lightGray: "F0F2F5",
  midGray: "8B95A5",
  textDark: "1E293B",
  textLight: "94A3B8",
  accent: "3B82F6",
} as const;

/* ─── Phase palette (Gantt) ───────────────────────────────── */
export const PHASE_COLORS: Record<string, string> = {
  Discovery: "6366F1",
  MVP: "10B981",
  "Post-MVP": "F59E0B",
  Maintenance: "EF4444",
  Custom: "8B5CF6",
};

/* ─── Slide dimensions (inches, 16:9 widescreen) ─────────── */
export const SLIDE = {
  W: 13.33,
  H: 7.5,
  MARGIN: 0.6,
} as const;

/* ─── Font ────────────────────────────────────────────────── */
export const FONT = {
  headingBlack: "Montserrat Black", // 900 weight — large slide titles
  heading: "Montserrat",            // 700 weight — sub-headings, bold text
  body: "Montserrat",               // 400–500 weight — body text
} as const;

/* ─── Company info ────────────────────────────────────────── */
export const COMPANY = {
  name: "AgileEngine",
  tagline: "Let's build something great together!",
  address: "1751 Pinnacle Drive, Suite 600\nMcLean, VA 22102, USA",
  email: "hello@agileengine.com",
  website: "https://agileengine.com",
} as const;

/* ─── Team icons (simple unicode for PPTX) ────────────────── */
export const ROLE_ICONS: Record<string, string> = {
  Designer: "\u{1F3A8}",       // 🎨
  Engineer: "\u{1F4BB}",       // 💻
  "Project Manager": "\u{1F4CB}", // 📋
};

/* ─── Default proposal state ──────────────────────────────── */
export const DEFAULT_GANTT_WEEKS = 20;
