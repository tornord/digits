import {
  doMove,
  drawSample,
  generateCombs,
  generateGame,
  generateTargets,
  multiplyHardnessLevel,
  randomSeed,
  toExpr,
} from "./math";
import { randomNumberGenerator } from "./randomNumberGenerator";

describe("math", () => {
  test("multiplyHardnessLevel", () => {
    expect(multiplyHardnessLevel(3, 7) === 1);
    expect(multiplyHardnessLevel(6, 8) === 2);
    expect(multiplyHardnessLevel(4, 15) === 3);
    expect(multiplyHardnessLevel(25, 16) === 4);
    expect(multiplyHardnessLevel(6, 17) === 5);
    expect(multiplyHardnessLevel(17, 22) === 6);
  });

  test("generateCombs", () => {
    expect(generateCombs(3).length).toBe(3);
    expect(generateCombs(6).length).toBe(15);
  });

  test("generateTargets", () => {
    const ts = generateTargets([1, 2, 3], 4, 9, 1, 2, false);
    expect(Object.values(ts).length).toBe(6);
  });

  test("toExpr", () => {
    expect(toExpr("2", "3", "+", 5)).toBe("2+3");
    expect(toExpr("2", "3+7", "+", 12)).toBe("2+3+7");
    expect(toExpr("2+4", "3+7", "*", 60)).toBe("(2+4)*(3+7)");
    expect(toExpr("9", "7-3", "-", 5)).toBe("9-(7-3)");
    expect(toExpr("27-7", "4", "/", 5)).toBe("(27-7)/4");
  });

  test("drawSample", () => {
    const rng = randomNumberGenerator("123");
    const ns = [1, 2, 3, 4, 5];
    const r = drawSample(ns, rng);
    expect(ns).toEqual([1, 3, 4, 5]);
    expect(r).toBe(2);
  });

  test("doMove", () => {
    expect(doMove(0, 1, "+", [1, 2, 3])).toEqual([3, 3]);
    expect(doMove(2, 3, "*", [9, 8, 7, 6, 5])).toEqual([9, 8, 5, 42]);
    expect(doMove(0, 1, "/", [60, 12])).toEqual([5]);
    expect(doMove(1, 0, "-", [5, 20])).toEqual([15]);
  });

  test("randomSeed", () => {
    const a: { [id: string]: boolean } = {};
    for (let i = 0; i < 200; i++) {
      a[randomSeed(1)] = true;
    }
    expect(Object.keys(a).length).toBe(16);
    expect(randomSeed(12).length).toBe(12);
    expect(typeof randomSeed(6)).toBe("string");
  });

  test("generateGame", () => {
    const r1 = generateGame("123", 1);
    expect(r1.numbers).toEqual([1, 2, 3, 4, 5, 10]);
    expect(r1.target).toBe(30);
    const r5 = generateGame("123", 5);
    expect(r5.numbers).toEqual([1, 2, 3, 16, 24, 25]);
    expect(r5.target).toBe(285);
  });
});
