import { useEffect, useState } from "react";
import { useGameStore } from "../state/gameStore";

export const Counter = () => {
  const game = useGameStore();
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    // Set an interval to toggle visibility every 500ms
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 500); // Blinks every 500ms (change this value as needed)

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [game.score]);

  const renderScore = () => {
    if (game.error) return "!!";
    if (game.score === 0) return "--";
    return game.score < 10 ? `0${game.score}` : game.score;
  };

  const getOpacityClass = () => {
    // If win or error, toggle opacity
    if (game.error) {
      return isVisible ? "opacity-100" : "opacity-0";
    }

    // Show score if going is true or score is 0; otherwise, check visibility
    if (game.going || game.score === 0) {
      return "opacity-100";
    }

    // Default visibility toggle for normal score display
    return isVisible ? "opacity-100" : "opacity-0";
  };

  return (
    <div className="flex flex-col items-center shadow-md">
      <div className="bg-[#2e3e4e] rounded-lg p-5 border-4 border-gray-800 w-18 h-16 flex flex-col items-center justify-center">
        {game.score !== 0 && !game.going ? (
          <span className="text-red-500 font-mono text-sm">Best:</span>
        ) : (
          <></>
        )}
        <span
          className={`text-red-500 text-3xl font-mono ${getOpacityClass()}`}
        >
          {renderScore()}
        </span>
      </div>
    </div>
  );
};
