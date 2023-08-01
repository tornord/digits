import { Board, BoardState } from "./board";
import { useMemo, useState } from "react";
import { generateGame, randomSeed } from "./math";
import styled from "@emotion/styled";

const StyledApp = styled.div(
  () => `
  display: flex;
  flex-direction: column;

  margin-top: 8px;

  .seed {
    text-align: center;
    font-size: 14px;
    color: #aaa;
    margin-bottom: 0.5rem;
    user-select: none;

    .lt, .gt {
      cursor: pointer;
    }

    .lt {
      margin-right: 0.5rem;
    }

    .gt {
      margin-left: 0.5rem;
    }
  }

  .sessions {
    margin: 0 auto;
    display: flex;
    flex-flow: wrap;
    justify-content: space-evenly;

    &>div {
      margin: 24px 18px 8px;
    }
  }
`
);

const newState = () => ({ activeNumber: null, activeOperation: null, moves: [] } as BoardState);

export function App() {
  const [seed, setSeed] = useState(randomSeed(4));
  const { target, numbers } = useMemo(() => generateGame(seed, 4), [seed]);
  const [state, setState] = useState(newState());
  const addHex = (h: string, d: number) => (parseInt(h, 16) + d).toString(16);
  return (
    <StyledApp>
      <div className="seed">
        <span
          className="lt"
          onClick={() => {
            setState(newState());
            setSeed((p) => addHex(p, -1));
          }}
        >
          &lt;
        </span>
        {seed}
        <span
          className="gt"
          onClick={() => {
            setState(newState());
            setSeed((p) => addHex(p, 1));
          }}
        >
          &gt;
        </span>
      </div>
      <Board
        target={target}
        numbers={numbers}
        state={state}
        boardSize={305}
        watchMode={false}
        onChange={(ev) => {
          setState(() => ev);
        }}
      />
    </StyledApp>
  );
}
