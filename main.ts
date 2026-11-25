// Fortune Cookie for the Liquidated Trader — make.fun entry (program/v1).
//
// Writes one fortune cookie line to /output/entry.txt: a fortune for a
// crypto trader who has just been liquidated. The line has to sound like
// a real fortune and land as a joke on the loss.
//
// Five candidates were drafted against the judge brief, in criterion
// order: (1) cookie voice AND the trading loss both in the line,
// (2) rueful and warm — the trader laughs with the cookie, never lectured,
// pitied, or mocked, (3) one line, at most 20 words, readable in a single
// breath, (4) a fresh joke — a turn, a double meaning, or a surprising
// last word, never the obvious liquidation pun, (5) small oracular formal
// phrasing that the punchline then breaks.
//
// Draft directions (from the interpretation advisor): A — a trading term
// used in its everyday sense; B — a fortune printed for the wrong person;
// C — lofty oracle opening broken by a small 3am reality. Banned as
// punchlines: liquidated / rekt / to the moon / buy the dip / HODL /
// margin call / leverage / stop-loss / diamond hands / not financial advice.
//
// Local head-to-head race (10 pairs, criteria applied in order — the first
// criterion where two lines differ decides, unless a later one differs by
// much more):
//   Rubric totals (/25): V1 22, V2 22, V3 21, V4 23, V5 24.
//   V1-V2: V1 (C3 breath, 16 vs 17 words). V1-V3: V1 (C1, loss explicit).
//   V1-V4: V4 (C2, warmer). V1-V5: V5 (C4, "in ascending order").
//   V2-V3: V2 (C1). V2-V4: V4 (C2). V2-V5: V5 (C3, 13 vs 17 words).
//   V3-V4: V4 (C1). V3-V5: V5 (C1). V4-V5: V4 (C2, the noodle stall still
//   extends credit — warmest of the five; V5's C4/C5 edge is 1 point each,
//   not "much more").
//   Standings: V4 4-0, V5 3-1, V1 2-2, V2 1-3, V3 0-4.
// Winner: V4 — the market closed the position, but the noodle stall's tab
// stays open. The double meaning (position closed / tab open) is the turn,
// the loss is explicit in trader terms, and the trader keeps his dignity:
// he laughs with the cookie, not at himself. V5 is the close second
// (shortest, freshest last phrase) and loses only on warmth.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const CANDIDATES: ReadonlyArray<{ id: string; line: string }> = [
  {
    id: "V1",
    line: "You will go long on instant noodles, for the market has taken everything else you owned.",
  },
  {
    id: "V2",
    line: "The stars say great wealth awaits you, just not in this wallet, this year, or this life.",
  },
  {
    id: "V3",
    line: "This fortune was printed for the trader who shorted you, and it says: thank you.",
  },
  {
    id: "V4",
    line: "The market has closed your position, but your tab at the noodle stall remains open.",
  },
  {
    id: "V5",
    line: "Your lucky numbers are the ones the exchange already took, in ascending order.",
  },
];

const WINNER_ID = "V4";
const OUT_PATH = "/output/entry.txt";

function charCount(text: string): number {
  return [...text].length;
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

function byteCount(text: string): number {
  return Buffer.byteLength(text, "utf8");
}

function passesGate(text: string): boolean {
  const chars = charCount(text);
  if (chars < 1 || chars > 160) return false;
  if (wordCount(text) > 20) return false;
  if (text.trim().length === 0) return false;
  if (/[\r\n]/.test(text)) return false;
  return true;
}

function main(): void {
  for (const candidate of CANDIDATES) {
    const ok = passesGate(candidate.line);
    console.log(
      `${candidate.id}: ${charCount(candidate.line)} chars / ${wordCount(candidate.line)} words / ${byteCount(candidate.line)} bytes, gate ${ok ? "pass" : "FAIL"}`,
    );
    if (!ok) throw new Error(`${candidate.id} fails the 1-160 char, <=20 word, single-line gate`);
  }

  const winner = CANDIDATES.find((c) => c.id === WINNER_ID);
  if (!winner) throw new Error(`winner ${WINNER_ID} not found among candidates`);

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, winner.line, "utf8");

  const back = readFileSync(OUT_PATH, "utf8");
  if (back !== winner.line) throw new Error("read-back mismatch on entry.txt");
  console.log(`wrote ${WINNER_ID} (${charCount(winner.line)} chars / ${wordCount(winner.line)} words / ${byteCount(winner.line)} bytes) to ${OUT_PATH}`);
}

main();
