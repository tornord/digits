import Mexp from "math-expression-evaluator";
import { randomNumberGenerator } from "./randomNumberGenerator";

const { floor, max, min, round, random } = Math;

export interface Move {
  ia: number;
  ib: number;
  op: string | null;
}

export function randomSeed(digits = 6): string {
  const res = [...Array(digits)].map(() => floor(16 * random()).toString(16));
  return res.join("");
}

export function toExpr(xa: string, xb: string, op: string, c: number) {
  const mexp = new Mexp();
  let x = `${xa}${op}${xb}`;
  if (mexp.eval(x, [], {}) === c) return x;
  x = `(${xa})${op}${xb}`;
  if (mexp.eval(x, [], {}) === c) return x;
  x = `${xa}${op}(${xb})`;
  if (mexp.eval(x, [], {}) === c) return x;
  x = `(${xa})${op}(${xb})`;
  if (mexp.eval(x, [], {}) === c) return x;
}

export function findIndices(numbers: number[], ns: number[]) {
  const res = [];
  for (const n of ns) {
    res.push(numbers.findIndex((d) => d === n));
  }
  return res;
}

export function parseMove(m: string) {
  const [, sa, op, sb, sc] = m.match(/(\d+)([+*/-])(\d+)=(\d+)/) as string[];
  return { a: Number(sa), op, b: Number(sb), c: Number(sc) };
}

export function calcNumbersAndPositions(startNumbers: (number | null)[], moves: Move[]) {
  const numbers: (number | null)[] = [...startNumbers];
  const positions = numbers.map((_, i) => i);
  for (const m of moves) {
    const c = calc(m.ia, m.ib, m.op as string, numbers as number[]);
    numbers[m.ia] = null;
    numbers[m.ib] = c;
    positions[m.ia] = positions[m.ib];
  }
  return { numbers, positions };
}

function canCalc(ia: number, ib: number, op: string, numbers: number[], skipHardMultply = false) {
  if (op === "+") return true;
  const a = numbers[ia];
  const b = numbers[ib];
  if (op === "*" && a > 1 && b > 1) {
    let ok = true;
    if (skipHardMultply && multiplyHardnessLevel(a, b) >= 4) {
      ok = false;
    }
    if (ok) return true;
  }
  if (op === "-" && a > b) return true;
  if (op === "/" && a >= b && b > 1 && a / b === round(a / b)) {
    const c = a / b;
    let ok = true;
    if (skipHardMultply && multiplyHardnessLevel(b, c) >= 4) {
      ok = false;
    }
    if (ok) return true;
  }
  return false;
}

function calc(ia: number, ib: number, op: string, numbers: number[]) {
  const a = numbers[ia] as number;
  const b = numbers[ib] as number;
  if (op === "+") {
    return a + b;
  } else if (op === "-") {
    return a - b;
  } else if (op === "*") {
    return a * b;
  } else if (op === "/") {
    return a / b;
  }
  throw new Error(`Invalid operation ${op}`);
}

export function doMove(ia: number, ib: number, op: string, numbers: number[]) {
  const c = calc(ia, ib, op, numbers);
  const res: number[] = [];
  for (let i = 0; i < numbers.length; i++) {
    if (i === ia || i === ib) continue;
    res.push(numbers[i]);
  }
  res.push(c);
  return res;
}

function moveToString(m: Move, ns: number[]) {
  const c = calc(m.ia, m.ib, m.op as string, ns);
  return `${ns[m.ia]}${m.op}${ns[m.ib]}=${c}`;
}

export function multiplyHardnessLevel(a: number, b: number) {
  const mn = min(a, b);
  const mx = max(a, b);
  const c = a * b;
  if (mx <= 10 && c <= 30) return 1;
  if (mx <= 10 || mn <= 1) return 2;
  if (a === 20 || b === 20) return 3;
  if (mn === 2 || mn === 10) return 3;
  if (mx === 11 && mn <= 10) return 3;
  if ((mx === 15 || mx === 25) && mn <= 5) return 3;
  if (mn <= 5 || mx === 25) return 4;
  if (mn <= 12 && mx === 15) return 4;
  if (a === b && (a === 11 || a === 12 || a === 15 || a === 16)) return 4;
  if (mn <= 11 || mn === 15 || (mx === 15 && mn !== 13)) return 5;
  return 6;
}

export function generateCombs(count: number) {
  const allCombs = [];
  for (let i = 0; i < count - 1; i++) {
    for (let j = i + 1; j < count; j++) {
      allCombs.push([i, j]);
    }
  }
  return allCombs;
}

export function generateMoves(numbers: number[], skipHardMultply: boolean = false) {
  const allCombs = generateCombs(numbers.length);
  const res = [];
  for (const op of ["+", "-", "*", "/"]) {
    for (const d of allCombs) {
      if (canCalc(d[0], d[1], op, numbers, skipHardMultply)) {
        res.push({ ia: d[0], ib: d[1], op });
      }
      if (op === "-" || op === "/") {
        if (canCalc(d[1], d[0], op, numbers, skipHardMultply)) {
          res.push({ ia: d[1], ib: d[0], op });
        }
      }
    }
  }
  return res;
}

interface QueueItem {
  ns: number[];
  ops: string[];
}

export function generateTargets(
  ns: number[],
  minTarget = 50,
  maxTarget = 500,
  minSteps = 1,
  maxSteps: number | null = null,
  skipHardMultply: boolean = false
) {
  const nn = ns.length;
  maxSteps ??= nn - 1;
  const queue: QueueItem[] = [{ ns, ops: [] }];
  const res: { [id: string]: string[] } = {};
  const targets: { [t: string]: string[] } = {};
  for (let i = 0; i < nn; i++) {
    const t = Number(ns[i]);
    if (t < minTarget || t > maxTarget) continue;
    targets[t] = [];
  }
  while (queue.length > 0) {
    const q = queue.shift() as QueueItem;
    const ms = generateMoves(q.ns, skipHardMultply);
    for (const m of ms) {
      const r = doMove(m.ia, m.ib, m.op, q.ns);
      const sn = r.join(",");
      const sm = moveToString(m, q.ns);
      const ops = [...q.ops, sm];
      for (let i = 0; i < r.length; i++) {
        const t = r[i];
        if (t < minTarget || t > maxTarget) continue;
        if (targets[String(t)]) continue;
        targets[String(t)] = ops;
      }
      if (r.length === 1) continue;
      if (res[sn]) continue;
      res[sn] = ops;
      const qn = { ns: r, ops };
      queue.push(qn);
    }
  }
  const ps = Object.entries(targets).filter(([, v]) => v.length >= minSteps && v.length <= (maxSteps as number));
  return ps.reduce((p, [k, v]) => {
    p[k] = v;
    return p;
  }, {} as { [k: string]: string[] });
}

export function sandbox() {
  const ns = [5, 7, 11, 13, 19, 23];
  const targets = generateTargets(ns);
  console.log(Object.keys(targets).length); // eslint-disable-line no-console
  for (const t in targets) {
    console.log(targets[t].join(", "), "=>", t); // eslint-disable-line no-console
  }
}

/**
 * Draws a random number from ns and removes it from ns.
 */
export function drawSample(ns: number[], rng: () => number) {
  const i = floor(ns.length * rng());
  const [res] = ns.splice(i, 1);
  return res;
}

function generateNumbers(rng: () => number) {
  const smalls = [...Array(9)].map((_, i) => i + 1);
  const allBig = [...Array(16)].map((_, i) => i + 10);
  const bigs = allBig.filter((d) => d % 5 !== 0);
  const evenBigs = allBig.filter((d) => d % 5 === 0);
  const res = [];
  for (let i = 0; i < 3; i++) {
    res.push(drawSample(smalls, rng));
  }
  res.push(drawSample(evenBigs, rng));
  while (res.length < 6) {
    const ns = [smalls, evenBigs, bigs][floor(3 * rng())];
    res.push(drawSample(ns, rng));
  }
  res.sort((d1, d2) => d1 - d2);
  return res;
}

export function generateGame(seed: string, level: number) {
  const rng = randomNumberGenerator(seed);
  const ns = level > 1 ? generateNumbers(rng) : [1, 2, 3, 4, 5, 10];
  const targets = generateTargets(
    ns,
    level === 1 ? 20 : 50,
    level === 1 ? 80 : 500,
    min(level, level < 5 ? 2 : 3),
    max(level, 2),
    level < 5
  );
  const t = drawSample(
    Object.keys(targets).map((d) => Number(d)),
    rng
  );
  console.log(targets[t].join(", ")); // eslint-disable-line no-console
  return { numbers: ns, target: Number(t) };
}

// console.log(generateGame(String(Date.now()), true));
