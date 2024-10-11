import { Tile } from "./components/Tile";
import { Counter } from "./components/Counter";
import { StartEndButton } from "./components/StartEndButton";
import { useGameStore } from "./state/gameStore";

function App() {
  const game = useGameStore();
  const handleStrictButtonClick = () => {
    game.changeStrictMode();
  };
  return (
    <>
      <div className="min-h-full h-screen">
        <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-70 text-white font-bold text-xs md:text-lg px-6 py-2 rounded-lg shadow-md">
          Can you keep up? Follow my lead if you dare—one mistake, and it's game
          over!
        </div>
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="bg-[#c7c7c7] rounded-md relative">
            <div className="flex flex-row">
              <Tile
                id={1}
                audioUrl="simonSound1.mp3"
                backgroundColor="bg-cyan-400"
              />
              <Tile
                id={2}
                audioUrl="simonSound2.mp3"
                backgroundColor="bg-fuchsia-400"
                angle={90}
              />
            </div>
            <div className="z-10 w-56 h-56 shadow-md bg-[#c7c7c7] rounded-full flex items-center justify-center absolute top-[18%] left-[18%] md:top-[27%] md:left-[27%]">
              <div className="flex flex-col items-center gap-3">
                <div>
                  <span className="text-3xl font-bold text-gray-800">
                    Follow Me
                  </span>
                </div>

                <Counter />

                <div className="flex flex-col">
                  <div
                    className={`self-end mr-3 rounded-full 
                      ${game.strict ? "bg-red-500" : "bg-red-100"} h-2 w-2`}
                  ></div>
                  <div className="flex flex-row gap-2">
                    <StartEndButton />
                    <div className="flex flex-col items-center justify-start">
                      <span className="text-xs">Strict</span>
                      <div
                        onClick={handleStrictButtonClick}
                        className="rounded-full border-2 border-gray-500 bg-yellow-300 h-5 w-5 cursor-pointer"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row">
              <Tile
                id={3}
                audioUrl="simonSound3.mp3"
                backgroundColor="bg-lime-400"
                angle={270}
              />
              <Tile
                id={4}
                audioUrl="simonSound4.mp3"
                backgroundColor="bg-yellow-400"
                angle={180}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
