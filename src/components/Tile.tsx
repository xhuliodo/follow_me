import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { useGameStore } from "../state/gameStore";

interface Props {
  id: number;
  angle?: 0 | 90 | 180 | 270;
  audioUrl?: string;
  backgroundColor?: string;
}

export const Tile: FC<Props> = ({
  angle = 0,
  backgroundColor = "",
  audioUrl = "",
  id,
}) => {
  const game = useGameStore();

  // handling audio
  const audioRef = useRef<Howl | null>(null);
  const playAudio = useCallback(() => {
    if (!audioRef.current && audioUrl) {
      const sound = new Howl({ src: audioUrl });
      audioRef.current = sound;
    }
    audioRef.current?.play();
  }, [audioUrl]);

  const [clicked, setClicked] = useState(false);
  const visualClick = useCallback(
    (showFor: number) => {
      if (!game.going) return;
      if (audioUrl) playAudio();
      setClicked(true);

      const timeoutId = setTimeout(() => {
        setClicked(false);
      }, showFor);

      return () => clearTimeout(timeoutId); // Cleanup
    },
    [game.going, audioUrl, playAudio]
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
