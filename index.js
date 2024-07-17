const guessInput = document.getElementById("guessInput");
const hangman = document.querySelector(".hangman");
const wordDisplay = document.querySelector("#wordDisplay");
const guessButton = document.querySelector("#guessButton");
const questionField = document.querySelector("#question");
const guesses = document.querySelector("#guesses");
const reload = document.querySelector("#reload");
let i = 1;
let succs = 0;
let guessedLetters = [];
let remainingAttempts = 6;


const random = async function () {
  try {
    // const resp = await fetch("https://random-word-api.herokuapp.com/word");
    // const data = await resp.json();
    const res = await fetch('https://opentdb.com/api.php?amount=1&type=multiple')
    const data2= await res.json()
    //const selectedWord = data[0];
    const question = data2.results[0].question
    const selectedWord = data2.results[0].correct_answer.toLowerCase()
    const wordLength = selectedWord.length;

 /// decode html characters like &#039;
    function decodeHTMLEntities(html) {
      let textarea = document.createElement('textarea');
      textarea.innerHTML = html;
      return textarea.value;
  }

    function spaceCount(word){
      const space = word.split('').reduce((acc,curr)=>{
        if(curr===' '){
          return acc+1
        }
        else{
          return acc
        }},0)
        succs+=space
      }
    spaceCount(selectedWord)
    function setWordUnderScore() {
      //questionField.textContent=question
      questionField.textContent=decodeHTMLEntities(question)
      for (let i = 0; i < wordLength; i++) {
        const underScore = document.createElement("span");
        underScore.setAttribute("data-ide", i);
        if(selectedWord.at(i)===' '){
          
          underScore.textContent = " ";
        }
        else{
          
          underScore.textContent = "-";
        }
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
      guessInput.setAttribute("placeHolder", `The word is ${selectedWord} ,Retry ?`);
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
    questionField.textContent=`Something went wrong please reload`
    console.log(err);
  }
};
random();
reload.addEventListener('click',()=>{
  location.reload()
})