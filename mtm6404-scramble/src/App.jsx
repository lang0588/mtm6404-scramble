import React, { useState, useEffect } from "react";
import "./App.css";

/**********************************************
 * shuffle function (given)
 **********************************************/
function shuffle(src) {
  const copy = [...src];

  const length = copy.length;
  for (let i = 0; i < length; i++) {
    const x = copy[i];
    const y = Math.floor(Math.random() * length);
    const z = copy[y];
    copy[i] = z;
    copy[y] = x;
  }

  if (typeof src === "string") {
    return copy.join("");
  }

  return copy;
}

function App() {
  /**********************************************
   * WORD LIST
   **********************************************/
  const wordList = [
    "react",
    "javascript",
    "coding",
    "design",
    "browser",
    "object",
    "function",
    "array",
    "string",
    "element",
  ];

  const MAX_STRIKES = 3;
  const MAX_PASSES = 3;

  /**********************************************
   * STATE
   **********************************************/
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [scrambled, setScrambled] = useState("");
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [points, setPoints] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [passes, setPasses] = useState(MAX_PASSES);
  const [gameOver, setGameOver] = useState(false);

  /**********************************************
   * START GAME
   **********************************************/
  function startGame() {
    const shuffledWords = shuffle(wordList);
    const firstWord = shuffledWords[0];

    setWords(shuffledWords.slice(1));
    setCurrentWord(firstWord);
    setScrambled(shuffle(firstWord));
    setPoints(0);
    setStrikes(0);
    setPasses(MAX_PASSES);
    setMessage("");
    setGameOver(false);
  }

  /**********************************************
   * LOAD FROM LOCAL STORAGE
   **********************************************/
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scrambleGame"));

    if (saved) {
      setWords(saved.words);
      setCurrentWord(saved.currentWord);
      setScrambled(saved.scrambled);
      setPoints(saved.points);
      setStrikes(saved.strikes);
      setPasses(saved.passes);
      setGameOver(saved.gameOver);
    } else {
      startGame();
    }
  }, []);

  /**********************************************
   * SAVE TO LOCAL STORAGE
   **********************************************/
  useEffect(() => {
    const gameState = {
      words,
      currentWord,
      scrambled,
      points,
      strikes,
      passes,
      gameOver,
    };

    localStorage.setItem("scrambleGame", JSON.stringify(gameState));
  }, [words, currentWord, scrambled, points, strikes, passes, gameOver]);

  /**********************************************
   * NEXT WORD
   **********************************************/
  function nextWord() {
    if (words.length === 0) {
      setGameOver(true);
      return;
    }

    const next = words[0];
    setCurrentWord(next);
    setScrambled(shuffle(next));
    setWords(words.slice(1));
  }

  /**********************************************
   * HANDLE GUESS
   **********************************************/
  function handleSubmit(e) {
    e.preventDefault();

    if (gameOver) return;

    if (guess.toLowerCase() === currentWord) {
      setMessage("Correct!");
      setPoints(points + 1);
      nextWord();
    } else {
      setMessage("Incorrect!");
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);

      if (newStrikes >= MAX_STRIKES) {
        setGameOver(true);
      }
    }

    setGuess("");
  }

  /**********************************************
   * HANDLE PASS
   **********************************************/
  function handlePass() {
    if (passes <= 0 || gameOver) return;

    setPasses(passes - 1);
    setMessage("Skipped!");
    nextWord();
  }

  /**********************************************
   * UI
   **********************************************/
  return (
    <div className="container">
      <h1>Scramble Game</h1>

      {!gameOver ? (
        <>
          <h2>{scrambled}</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter your guess"
            />
          </form>

          <p className={message === "Correct!" ? "correct" : message === "Incorrect!" ? "incorrect" : ""}>
  {message}</p>

          <p>Points: {points}</p>
          <p>Strikes: {strikes}</p>
          <p>Passes: {passes}</p>

          <button onClick={handlePass}>Pass</button>
        </>
      ) : (
        <>
          <h2>Game Over</h2>
          <p>Final Score: {points}</p>
          <button onClick={startGame}>Play Again</button>
        </>
      )}
    </div>
  );
}

export default App;