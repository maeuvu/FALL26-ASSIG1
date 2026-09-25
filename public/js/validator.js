// =====================================================================
// MISSION 1: Defensive data handling (Unit 1.2)
// =====================================================================
// This file runs in TWO places:
//   1) In Node, through the tests:   npm run test:m1
//   2) In the browser, in Mission 3, loaded by index.html
//
// Rules for this file:
//   - No var. Use const and let.
//   - Only strict equality (=== and !==).
//   - Fail safe: anything unexpected is rejected, never "fixed".
// =====================================================================

const ALLOWED_STATUS = ["up", "degraded", "down"];
const MAX_NAME_LENGTH = 64;

/**
 * Validates ONE raw service entry received from the server.
 *
 * Returns a NEW object with exactly these four fields:
 *   { name: string, status: string, online: boolean, latencyMs: number }
 * or returns null if the entry is invalid.
 *
 * Rules:
 *   - raw must be a plain object: not null, not an array
 *   - name: a string; after trim() it must be non-empty and at most MAX_NAME_LENGTH chars.
 *           The returned name is the trimmed one.
 *   - status: exactly one of ALLOWED_STATUS. "UP" is NOT "up".
 *   - online: a real boolean. The string "false" is not a boolean.
 *   - latencyMs: a finite number, greater than or equal to 0. The string "120" is not a number.
 *   - Any extra field in raw, for example isAdmin, must NOT appear in the returned object.
 */
function normalizeService(raw) {
 if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return null;
  }

  if (typeof raw.name !== "string") {
    return null;
  }
  const trimmedName = raw.name.trim();
  if (trimmedName.length === 0 || trimmedName.length > MAX_NAME_LENGTH) {
    return null;
  }

  if (typeof raw.status !== "string" || !ALLOWED_STATUS.includes(raw.status)) {
    return null;
  }

  if (typeof raw.online !== "boolean") {
    return null;
  }

  if (typeof raw.latencyMs !== "number" || !Number.isFinite(raw.latencyMs) || raw.latencyMs < 0) {
    return null;
  }

  return {
    name: trimmedName,
    status: raw.status,
    online: raw.online,
    latencyMs: raw.latencyMs,
  };

}

/**
 * Parses the full JSON text returned by the server.
 *
 * On success returns:
 *   { services: [ ...valid normalized entries ], rejected: <number of invalid entries>, error: null }
 *
 * If the text is not valid JSON, or the parsed value has no "services" array, returns:
 *   { services: [], rejected: 0, error: "invalid report" }
 */
function parseStatusReport(jsonText) {
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (e) {
    return { services: [], rejected: 0, error: "invalid report" };
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !Array.isArray(parsed.services)
  ) {
    return { services: [], rejected: 0, error: "invalid report" };
  }

  const services = [];
  let rejected = 0;

  for (const rawEntry of parsed.services) {
    const normalized = normalizeService(rawEntry);
    if (normalized === null) {
      rejected += 1;
    } else {
      services.push(normalized);
    }
  }

  return { services, rejected, error: null };
}

// Lets Node's require() see these functions. The browser simply ignores this block.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { normalizeService, parseStatusReport, ALLOWED_STATUS, MAX_NAME_LENGTH };
}
