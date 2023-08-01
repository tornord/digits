import { css, Global } from "@emotion/react";
import { App } from "./App";
import ReactDOM from "react-dom/client";

import "./index.scss";

ReactDOM.createRoot(document.getElementById("root") as Element).render(
  <>
    <Global
      styles={css`
        :root {
          --dark-grey: #a0a0a0;
          --light-grey: #c7c7c7;
          --digits-light-green: #dbe797;
          --digits-yellow-green: #e0d95e;
          --digits-medium-green: #5f9c49;
        }
        body {
          color: #000;
          -webkit-tap-highlight-color: transparent;
          touch-action: pan-y;
          overflow-wrap: break-word;
          background-color: #fff;
          font-size: 20px;
          font-family: Libre Franklin, Sans-Serif;
          font-weight: 600;
          margin: 0;
        }
      `}
    />
    <App />
  </>
);
