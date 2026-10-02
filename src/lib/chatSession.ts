// ─────────────────────────────────────────────────────────────
// Chat session ID helper
// Generates and persists a per-visitor session ID in localStorage
// so n8n's Memory node can scope conversations to a single chatter.
// Format: sess_YYYYMMDD_<8-char-random>  (no PII)
// ─────────────────────────────────────────────────────────────
const STORAGE_KEY = "glenn_chat_session_id";

const generateSessionId = (): string => {
  const now = new Date();
  const datePart =
    `${now.getFullYear()}` +
    `${String(now.getMonth() + 1).padStart(2, "0")}` +
    `${String(now.getDate()).padStart(2, "0")}`;

  let randomPart = "";
  try {
    // crypto.randomUUID is available in modern browsers
    randomPart = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  } catch {
    randomPart = Math.random().toString(36).slice(2, 10);
  }

  return `sess_${datePart}_${randomPart}`;
};

export const getChatSessionId = (): string => {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const fresh = generateSessionId();
    localStorage.setItem(STORAGE_KEY, fresh);
    return fresh;
  } catch {
    // localStorage may be unavailable (SSR, privacy mode) — fall back to ephemeral ID
    return generateSessionId();
  }
};
