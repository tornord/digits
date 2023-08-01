import { calcNumbersAndPositions, Move } from "../math";
import { IconAdd, IconDivide, IconMultiply, IconSubtract, IconUndo } from "../Icons";
import clsx from "clsx";
import { StyledBoard } from "./StyledBoard";

const { floor, log10 } = Math;

const operations = [
  { id: "undo", component: <IconUndo key={0} /> },
  { id: "add", component: <IconAdd key={1} /> },
  { id: "subtract", component: <IconSubtract key={2} /> },
  { id: "multiply", component: <IconMultiply key={3} /> },
  { id: "divide", component: <IconDivide key={4} /> },
];

export interface BoardState {
  activeNumber: number | null;
  activeOperation: string | null;
  moves: Move[];
}

interface BoardProps {
  target: number;
  numbers: number[];
  state: BoardState;
  onChange?: ((ev: BoardState) => void) | null;
  watchMode?: boolean;
  boardSize?: number;
}

export function Board({
  target,
  numbers: startNumbers,
  state,
  onChange = null,
  watchMode = false,
  boardSize = 360,
}: BoardProps) {
  const { activeNumber, activeOperation, moves } = state ?? {};
  const { numbers, positions } = calcNumbersAndPositions(startNumbers ?? [...Array(6)].map(() => null), moves ?? []);
  const allNull = !numbers.some((d) => d !== null);
  return (
    <StyledBoard boardSize={boardSize}>
      <div className={clsx(["board", !state ? "readonly" : watchMode ? "watch-mode" : ""])}>
        <div className="board-prompt-text">Use any combination of numbers to reach the target:</div>
        <div className="target-wrapper">
          <div className="target">{target}</div>
        </div>
        <div className="numbers">
          {numbers.map((d, i) => (
            <div
              key={i}
              className={clsx([
                "number",
                activeNumber === i ? "active" : "",
                numbers[i] === target ? "target" : "",
                numbers[i] !== null ? `d${1 + floor(log10(d as number))}` : null,
                `number-pos-${positions[i]}`,
              ])}
              style={{
                zIndex: `${numbers[i] !== null ? 1 : 0}`,
                opacity: allNull || numbers[i] !== null ? 1 : 0,
              }}
              onClick={
                numbers[i] !== null && onChange
                  ? () => {
                      let move: Move | null = null;
                      if (activeOperation !== null && activeNumber !== null && activeNumber !== i) {
                        move = { ia: activeNumber, ib: i, op: null };
                        if (activeOperation === "add") {
                          move.op = "+";
                        } else if (activeOperation === "multiply") {
                          move.op = "*";
                        } else {
                          const a = numbers[activeNumber] as number;
                          const b = numbers[i] as number;
                          if (activeOperation === "subtract" && a > b) {
                            move.op = "-";
                          } else if (activeOperation === "divide" && a >= b && a / b === Math.round(a / b)) {
                            move.op = "/";
                          }
                        }
                      }
                      const res = { ...state };
                      const success = move && move.op !== null;
                      if (move !== null) {
                        res.activeOperation = null;
                      }
                      if (success) {
                        res.moves.push(move as Move);
                      }
                      let newNumber = activeNumber === i ? null : i;
                      if (move && move.op === null) {
                        newNumber = activeNumber;
                      }
                      res.activeNumber = newNumber;
                      onChange(res);
                    }
                  : void 0
              }
            >
              {d}
            </div>
          ))}
        </div>
        <div className="operations">
          {operations.map((d, i) => (
            <button
              key={i}
              id={d.id}
              className={clsx([
                "operation",
                activeOperation === d.id || (d.id === "undo" && moves?.length > 0) ? "active" : "",
              ])}
              onClick={
                onChange
                  ? () => {
                      if (d.id === "undo" && moves.length === 0) return;
                      const res = { ...state };
                      if (d.id === "undo") {
                        const m = moves.pop() as Move;
                        res.activeNumber = m.ia;
                        res.activeOperation = null;
                      } else {
                        res.activeOperation = d.id === activeOperation ? null : d.id;
                      }
                      onChange(res);
                    }
                  : void 0
              }
            >
              {d.component}
            </button>
          ))}
        </div>
        <div className="submit-and-share-buttons">
          <div
            className={clsx([
              "submit-button",
              numbers.some((d) => d === target) && onChange ? "active" : "",
              "noselect",
            ])}
          >
            Submit
          </div>
        </div>
      </div>
    </StyledBoard>
  );
}
