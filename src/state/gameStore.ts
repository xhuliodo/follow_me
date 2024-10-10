import { create } from "zustand";

interface GameState {
  going: boolean;
  win: boolean;
  winScore: number;
  winGame: () => void;
  score: number;
  waitingPeriod: number;
  showPeriod: number;
  sequence: number[];
  userSequence: number[];
  showing: boolean;
  error: boolean;
  strict: boolean;
  changeStrictMode: () => void;
  startGame: () => void;
  endGame: () => void;
  nextLevel: () => void;
  showTile: number;
  showSequence: () => void;
  addUserSequence: (step: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  going: false,
  win: false,
  winScore: 20,
  winGame: () => {
    set(() => ({ win: true }));
    setTimeout(() => get().startGame(), 5000);
  },
  score: localStorage.getItem("bestScore")
    ? Number(localStorage.getItem("bestScore"))
    : 0,
  waitingPeriod: 200,
  showPeriod: 500,
  sequence: [],
  userSequence: [],
  showing: false,
  error: false,
  strict: true,
  changeStrictMode: () => {
    if (get().going) {
      return;
    }
    set((state) => ({ strict: !state.strict }));
  },
  startGame: () => {
    set(() => {
      return {
        win: false,
        score: 0,
        sequence: [],
        going: true,
      };
    });
    get().nextLevel();
  },
  nextLevel: () => {
    set((state) => {
      return {
        score: state.score + 1,
        sequence: [...state.sequence, generateRandom(1, 4)],
      };
    });
    get().showSequence();
  },
  showTile: 0,
  showSequence: async () => {
    set(() => ({ showing: true }));
    await wait(get().showPeriod + 500);
    const seq = get().sequence;
    for (let i = 0; i < seq.length; i++) {
      set(() => ({ showTile: seq[i] }));
      await wait(get().showPeriod);
      set(() => ({ showTile: 0 }));
      await wait(get().waitingPeriod);
    }
    set(() => ({ showTile: 0 }));
    set(() => ({ showing: false }));
  },
  endGame: () => {
    let bestScore: number;
    const bestScoreString = localStorage.getItem("bestScore");
    if (bestScoreString === null) {
      bestScore = 0;
    } else {
      bestScore = Number(bestScoreString);
    }
    if (bestScore < get().score - 1) {
      bestScore = get().score - 1;
    }
    set(() => ({ score: bestScore, going: false, sequence: [] }));
    localStorage.setItem("bestScore", bestScore.toString());
  },
  addUserSequence: async (step) => {
    const seq = get().sequence;
    const userSeq = get().userSequence;
    // check if current step is correct
    console.log("seq", seq, "user seq:", [...userSeq, step]);
    if (seq[userSeq.length] === step) {
      // check if it is the final step
      if (seq.length - 1 === userSeq.length) {
        set(() => ({ userSequence: [] }));

        // check if this is the last level
        if (get().score === get().winScore) {
          get().winGame();
          return;
        }

        get().nextLevel();
        return;
      }
      set((state) => ({ userSequence: [...state.userSequence, step] }));
    } else {
      set(() => ({ error: true, userSequence: [] }));
      await wait(3000);
      set(() => ({ error: false }));
      if (get().strict) {
        get().startGame();
      } else {
        get().showSequence();
      }
    }
  },
}));

const generateRandom = (low: number, high: number): number => {
  return Math.floor(Math.random() * (high - low + 1)) + low;
};

const wait = (timeout: number) => {
  return new Promise((r) => setTimeout(r, timeout));
};
