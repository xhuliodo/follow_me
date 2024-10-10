import { useState } from "react";
import { useGameStore } from "../state/gameStore";

export const Button = () => {
  const game = useGameStore();
  const [clicked, setClicked] = useState(false);
  const handleClicked = () => {
    if (game.win) {
      return;
    }
    setClicked(true);
    if (game.going) {
      game.endGame();
    } else {
      game.startGame();
    }
    setTimeout(() => {
      setClicked(false);
    }, game.waitingPeriod);
  };

  return (
    <div
      onClick={handleClicked}
      className={`w-20 h-10 rounded-md
     ${clicked ? "bg-red-600" : "bg-red-500"}
       border-2 border-gray-500 flex items-center justify-center ${
         !game.win ? "cursor-pointer" : ""
       }`}
    >
      <span className="text-xl font-semibold text-gray-800">
        {game.going ? "Give up" : "Start"}
      </span>
    </div>
  );
};
