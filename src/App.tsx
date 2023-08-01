import { Board, BoardState } from "./board";
import { useMemo, useState } from "react";
import { generateGame } from "./math";
import styled from "@emotion/styled";

const StyledApp = styled.div(
  () => `
  display: flex;
  flex-direction: column;

  margin-top: 8px;

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
  const { target, numbers } = useMemo(() => generateGame(String(Date.now()), 4), []);
  const [state, setState] = useState(newState());
  return (
    <StyledApp>
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
