//# sourceURL=pen.js

console.clear()

const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');

const figureParts = document.querySelectorAll('.figure-part');

const randomWordAPI = "https://random-words-api.vercel.app/word";
const para = document.querySelector("#test");
const btn = document.querySelector("#generateBtn");

btn.addEventListener("click", generateWord)

let word

async function generateWord() {
  word = await getWord()
  
  console.log(word)

  displayWord()
}

async function getWord() {
  const response = await fetch(randomWordAPI)
  const data = await response.json()
  const word = data[0].word

  return word.toLowerCase()
}

const correctLetters = [];
const wrongLetters = [];

// Show hidden word
async function displayWord() {  
  wordEl.innerHTML = `
    ${word
      .split('')
      .map(
        letter => `
          <span class="letter">
            ${correctLetters.includes(letter) ? letter : ''}
          </span>
        `
      )
      .join('')}
  `;

  const innerWord = wordEl.innerText.replace(/\n/g, '');

  // console.log(wordEl.innerText);

  if (innerWord === word) {
    finalMessage.innerText = 'Congratulations! You won! 😃';
    popup.style.display = 'flex';
  }

  //console.log(wordEl.innerText, innerWord);
}

// update wrong letters
function updateWrongLettersEl() {
  //console.log('update wrong letters');

  // display wrong letters
  wrongLettersEl.innerHTML = `
  ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
  ${wrongLetters.map(letter => `<span>${letter}</span>`)}
  `;

  // display parts
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;

    if(index < errors) {
      part.style.display = 'block';
    }
    else {
      part.style.display ='none';
    }
  })

  // check if lost
  if(wrongLetters.length === figureParts.length) {
    finalMessage.innerText = "Unfortunately you lost 😕";
    popup.style.display = 'flex';
  }
}

//show notification
function showNotification() {
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

// keydown letter press 
window.addEventListener('keydown', e => {
  // console.log(e.keyCode);
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key;

    if (word.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);

        displayWord();
      } else {
        showNotification();
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);

        updateWrongLettersEl();
      } else {
        showNotification();
      }
    }
  }
});

// Restart game and play again
playAgainBtn.addEventListener('click', () => {

  // empty arrays
  correctLetters.splice(0);
  wrongLetters.splice(0);

  //word = words[Math.floor(Math.random() * words.length)];

  displayWord();

  updateWrongLettersEl();

  popup.style.display = 'none';
})

generateWord()
