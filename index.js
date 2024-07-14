const random = async function () {
  try {
    const resp = await fetch("https://random-word-api.herokuapp.com/word");
    const data = await resp.json();

    const selectedWord = data[0];

    const guessInput = document.getElementById("guessInput");
    const wordLength = selectedWord.length;
    const hangman = document.querySelector(".hangman");
    const wordDisplay = document.querySelector("#wordDisplay");
    const guessButton = document.querySelector("#guessButton");
    const guesses = document.querySelector("#guesses");
    let i = 1;
    let succs = 0;
    let guessedLetters = [];
    let remainingAttempts = 6;

    function setWordUnderScore() {
      for (let i = 0; i < wordLength; i++) {
        const underScore = document.createElement("span");
        underScore.setAttribute("data-ide", i);
        underScore.textContent = "-";
        wordDisplay.append(underScore);
      }
    }

    function Answer(char, word) {
      return word.includes(char);
    }
    function setWinBackgroundColor() {
      document.body.style.backgroundColor = "green";
    }

    function setLossBackgroundColor() {
      document.body.style.backgroundColor = "red";
    }

    function checkWin() {
      wordDisplay.textContent = "Congratulations! You won!";
      guessInput.value = "";
      guessInput.setAttribute("placeHolder", `Retry ?`);
      guessInput.setAttribute("maxlength", `0`);
    }

    function checkLoss() {
      wordDisplay.textContent = "Game over! You lost.";
      guessInput.value = "";
      guessInput.setAttribute("placeHolder", `The word is ${selectedWord}`);
      guessInput.setAttribute("maxlength", `0`);
    }
    function display() {
      const InputAlpha = document
        .querySelector("#guessInput")
        .value.toLowerCase();
      if (InputAlpha && InputAlpha !== " ") {
        if (!guessedLetters.find((el) => el === InputAlpha)) {
          guessedLetters.push(InputAlpha);
          if (remainingAttempts > 0) {
            if (!Answer(InputAlpha, selectedWord)) {
              hangman.childNodes[i].classList.remove("hidden");
              remainingAttempts--;
              i = i + 2;
            } else {
              for (let y = 0; y < selectedWord.length; y++) {
                if (InputAlpha === selectedWord[y]) {
                  wordDisplay.childNodes[y].innerHTML = InputAlpha;
                  succs++;
                }
              }
            }
          } else {
            return;
          }
        }
        let guess = "";
        guessedLetters.forEach((el) => (guess += ` ${el},`));

        guesses.innerHTML = guess.slice(0, -1).trim();
        if (succs === selectedWord.length) {
          setWinBackgroundColor();
          checkWin();
          return;
        }
        if (remainingAttempts === 0) {
          setLossBackgroundColor();
          checkLoss();
          return;
        }
      }
    }
    function init() {
      setWordUnderScore();
      guessButton.addEventListener("click", (e) => {
        e.preventDefault();
        display();
      });
      guessInput.addEventListener("submit", (e) => {
        e.preventDefault();
        display();
      });
    }
    init();
  } catch (err) {
    console.log(err);
  }
};
random();
