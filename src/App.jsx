import { useRef, useState } from 'react';
import NewGame from './components/NewGame';
import Game from './components/Game';
import GameOver from './components/GameOver';
import { levels } from './levels';

// Import audio files
import popSound from './assets/pop.mp3';
import gameOverSound from './assets/game_over.mp3';

const getRndInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

function App() {
  const [player, setPlayer] = useState();
  const [circles, setCircles] = useState([]);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState();
  const [gameLaunch, setGameLaunch] = useState(true);
  const [gameOn, setGameOn] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  

  // we use useRef to store the value between renders
  const timeoutIdRef = useRef(null);
  const roundsCount = useRef(0);
  const currentInst = useRef(0);

  let pace = 1000;
  let levelAmount;

  const gameSetHandler = (level, name) => {
    
    const { amount } = levels.find((el) => el.name === level);
    levelAmount = amount;

    const circlesArray = Array.from({ length: levelAmount }, (_, i) => i);

    setCircles(circlesArray);
    setPlayer({
      level: level,
      name: name,
    });

    // using the callback to ensure that we have the latest state
    setGameLaunch((prevLaunch) => !prevLaunch);
    gameStart();
  };

  const randomNumb = () => {
    if (roundsCount.current >= 3) {
      stopHandler();
      return;
    }

    let nextActive;

    do {
      nextActive = getRndInt(0, levelAmount);
    } while (nextActive === currentInst.current);

    setCurrent(nextActive);
    currentInst.current = nextActive;
    roundsCount.current++;
    pace *= 0.95;
    timeoutIdRef.current = setTimeout(randomNumb, pace);
  };

  function gameStart() {
    setGameOn(!gameOn);
    randomNumb();
  }

  const clickHandler = (id) => {
    if (current !== id) {
      stopHandler();
      return;
    }
    setScore((prevScore) => prevScore + 10);
    roundsCount.current--;

    // added pop sound
    const popAudio = new Audio(popSound);
    popAudio.play();
  };

  const stopHandler = () => {
    clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = null;
  
    setGameOn(false);
    setGameOver(true); // Set gameOver to true
  
    // game over sound
    const gameOverAudio = new Audio(gameOverSound);
    gameOverAudio.play();
  
    roundsCount.current = null;
    pace = 1000;
  };
  
  const closeHandler = () => {
    setGameOver(!gameOver);
    setGameLaunch(!gameLaunch);
    setScore(0);
  };

  return (
    <>
      <h1>Catch the Water Droplet!</h1>
      {gameLaunch && <NewGame onclick={gameSetHandler} />}
      {gameOn && (
        <Game
          score={score}
          circles={circles}
          stopHandler={stopHandler}
          clickHandler={clickHandler}
          current={current}
        />
      )}
      {gameOver && (
        <GameOver closeHandler={closeHandler} {...player} score={score} />
      )}

      <audio id="popAudio">
        <source src={popSound} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <audio id="gameOverAudio">
        <source src={gameOverSound} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </>
  );
}

export default App;
