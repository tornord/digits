import styled from "@emotion/styled";

const { round } = Math;

export const StyledBoard = styled.div(({ boardSize = 305 }: { boardSize: number }) => {
  const px = (x: number) => `${round((x * boardSize) / 30.5) / 10}px`;
  const numberSize = 86;
  const numberMargin = 18;
  return `
    flex-direction: column;
    justify-content: center;
    align-items: center;
    display: flex;
    min-width: ${px(305)};

    .board-prompt-text {
      width: ${px(305)};
      min-height: ${px(16)};
      margin-bottom: 0;
      font-size: ${px(14)};
    }

    .target-wrapper {
      height: ${px(1.75 * 56)};
      justify-content: space-evenly;
      align-items: center;
      display: flex;

      .target {
        text-align: center;
        -webkit-user-select: none;
        user-select: none;
        font-size: ${px(56)};
      }
    }

    .numbers {
      width: ${px(3 * numberSize + 2 * numberMargin)};
      height: ${px(2 * numberSize + numberMargin)};
      margin-bottom: ${px(20)};
      font-size: ${px(20)};
      position: relative;
      box-sizing: border-box;

      .number {
        text-align: center;
        width: ${px(86)};
        height: ${px(86)};
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
        border: ${px(3)} dashed #000;
        border-radius: 50%;
        justify-content: center;
        align-items: center;
        padding-top: 0;
        font-size: ${px(32)};
        display: flex;
        position: absolute;
        cursor: pointer;
        box-sizing: border-box;
        transition: top 0.3s ease-out, 
          left 0.3s ease-out, 
          color 0.3s linear, 
          background-color 0.3s linear, 
          border 0.3s linear, 
          opacity 0.3s linear;

        &.active {
          color: #fff;
          background-color: var(--digits-medium-green);
          border: ${px(2)} solid var(--digits-medium-green);
        }  

        &.active.target {
          color: #000;
          background-color: var(--digits-yellow-green);
          border: ${px(2)} solid var(--digits-yellow-green);
          animation: target-animation 2s 1;
        }

        @keyframes target-animation {
          0% {
            box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
          }
          100% {
            box-shadow: 0 0 0 20px rgba(0, 0, 0, 0);
          }
        }
    
        &.d4 {
          font-size: ${px(28)};
        }
        &.d5 {
          font-size: ${px(25)};
        }
        &.d6 {
          font-size: ${px(22)};
        }
        &.d7 {
          font-size: ${px(19)};
        }

        &.number-pos-0 {
          top: 0;
          left: 0;
        }
        &.number-pos-1 {
          top: 0;
          left: ${px(numberSize + numberMargin)};
        }
        &.number-pos-2 {
          top: 0;
          left: ${px(2 * numberSize + 2 * numberMargin)};
        }
        &.number-pos-3 {
          top: ${px(numberSize + numberMargin)};
          left: 0;
        }
        &.number-pos-4 {
          top: ${px(numberSize + numberMargin)};
          left: ${px(numberSize + numberMargin)};
        }
        &.number-pos-5 {
          top: ${px(numberSize + numberMargin)};
          left: ${px(2 * numberSize + 2 * numberMargin)};
        }
      }
    }

    .operations {
      justify-content: space-evenly;
      align-items: stretch;
      margin-bottom: ${px(10)};
      display: flex;
      width: ${px(305)};

      button {
        background-color: #fff;
  
        svg {
          width: ${px(32)};
          height: ${px(32)};
        }
      }  

      .operation {
        width: ${px(55)};
        height: ${px(55)};
        color: #fff;
        cursor: pointer;
        box-sizing: border-box;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
        background: #000;
        border: none;
        border-radius: 50%;
        outline: none;
        justify-content: center;
        align-items: center;
        padding: 0;
        font-size: ${px(45)};
        transition: filter 0.3s;
        display: flex;
        // margin: ${px(3)};
    
        &.active {
          background-color: var(--digits-medium-green);
          color: #000;
        }
      }
    }

    .submit-and-share-buttons {
      display: none;
      margin: ${px(3)};

      .submit-button {
        background: var(--dark-grey);
        color: var(--light-grey);
        text-align: center;
        max-height: 4.5em;
        padding: ${px(8)} ${px(12)};
        display: block;
        font-size: ${px(18)};
        border-radius: ${px(30)};
        user-select: none;

        &.active {
          background: var(--digits-yellow-green);
          color: #000;
        }
      }      
    }

    &.readonly {
      color: #aaa;

      .number {
        border-color: #aaa;
        cursor: initial;

        &.active {
          background: #aaa;
          border: ${px(5)} solid #aaa;
        }
      }

      .operation {
        background: #ddd;
        cursor: initial;

        &.active {
          background: #999;
        }
      }

      .submit-button {
        background: #ccc;
        color: #999;
      }
    }

    .watch-mode {
      margin-top: ${px(10)};
      opacity: 0.5;

      .board-prompt-text, .target-wrapper {
        display: none;
      }

      .number, .operation {
        cursor: initial;
      }
    }

    .shrunk {
      animation: shrink ease-in 0.5s 0s 1;
      animation-fill-mode: forwards;
    }
    
    .short-bounce {
      animation: bounce ease-in 0.3s 1;
    }
    
    .long-bounce {
      animation: bounce ease-in 0.3s 2;
    }
    
    .invalid-shake {
      animation: shake ease-in 0.2s 1.5;
    }
    
    .flicker {
      animation: flicker 0.5s step-start 2;
    }
    
    .pulse {
      animation: pulse linear 0.4s 1;
    }
    
    @keyframes flicker {
      50% {
        color: var(--digits-light-green);
      }
    }
    
    @keyframes shake {
      0%,
      100% {
        transform: translatex(0);
      }
    
      25% {
        transform: translateX(-5px);
      }
    
      75% {
        transform: translateX(5px);
      }
    }
    
    @keyframes bounce {
      0%,
      100% {
        transform: translateY(0);
      }
    
      50% {
        transform: translateY(-5px);
      }
    }
    
    @keyframes pulse {
      0% {
        transform: scale(1);
      }
    
      20% {
        transform: scale(1.2);
      }
    
      100% {
        transform: scale(1);
      }
    }    
  `;
});
