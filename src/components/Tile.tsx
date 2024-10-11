import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useGameStore } from "../state/gameStore";

interface Props {
  id: number;
  angle?: 0 | 90 | 180 | 270;
  audioUrl?: string;
  backgroundColor?:
    | "bg-cyan-400"
    | "bg-yellow-400"
    | "bg-fuchsia-400"
    | "bg-lime-400";
}

export const Tile: FC<Props> = ({
  angle = 0,
  backgroundColor = "bg-cyan-400",
  audioUrl = "",
  id,
}) => {
  const game = useGameStore();

  // handling audio
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
    }
  }, [audioUrl]);
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset to the beginning
      audioRef.current.play();
    }
  };

  const [clicked, setClicked] = useState(false);
  const visualClick = useCallback(
    (showFor: number) => {
      if (!game.going) {
        return;
      }
      if (audioUrl !== "") {
        playAudio();
      }
      setClicked(true);

      setTimeout(() => {
        setClicked(false);
      }, showFor);
    },
    [audioUrl, game.going]
  );

  const handleClicked = () => {
    if (game.showing || game.error) {
      return;
    }
    visualClick(game.waitingPeriod);
    game.addUserSequence(id);
  };

  useEffect(() => {
    if (id === game.showTile) {
      visualClick(game.showPeriod);
    }
  }, [game.showPeriod, game.showTile, id, visualClick]);

  return (
    <div
      className={`
        w-40 h-40
        md:w-56 md:h-56
        ${
          !game.going
            ? ""
            : game.showing
            ? ""
            : !game.error
            ? "cursor-pointer"
            : ""
        }
        m-2
        md:m-4
        shadow-lg
        border rounded-md border-gray-400
        ${clicked ? "brightness-100" : "brightness-75"}
        ${backgroundColor}`}
      onClick={handleClicked}
      style={{ transform: `rotate(${angle}deg)` }}
    ></div>
  );
};
