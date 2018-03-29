/*
 * Create a list that holds all of your cards
 */
const cards = [
  {
    name: 'Diamond',
    faClass: 'fa fa-diamond'
  },
  {
    name: 'Paper-Plane',
    faClass: 'fa fa-paper-plane-o'
  },
  {
    name: 'Anchor',
    faClass: 'fa fa-anchor'
  },
  {
    name: 'Bolt',
    faClass: 'fa fa-bolt'
  },
  {
    name: 'Cube',
    faClass: 'fa fa-cube'
  },
  {
    name: 'Leaf',
    faClass: 'fa fa-leaf'
  },
  {
    name: 'Bicycle',
    faClass: 'fa fa-bicycle'
  },
  {
    name: 'Bomb',
    faClass: 'fa fa-bomb'
  }
];

//duplicate each card for our 16-card memory game with the rest parameter
function createCardList(cards) {
  return [...cards, ...cards]
}

let shuffledCardList = shuffle(createCardList(cards));

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

for (const index in shuffledCardList) {
  const card = shuffledCardList[index];
  const cardElement = document.createElement('li');
  const cardIcon = document.createElement('i');

  cardElement.className = 'card';
  cardElement.id = `card${index}`;

  cardIcon.className = card.faClass;

  cardElement.appendChild(cardIcon);
  document.querySelector('.deck').appendChild(cardElement);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let openCardList = [];
const matchedCardList = [];
let moveCounter = 0;
let starCounter = 3;
const deck = document.querySelector('.deck');
const resetButton = document.querySelector('.reset-button');
const starElements = document.querySelectorAll('.fa-star');
const stars = document.querySelector('.stars');
const timer = document.querySelector('.timer');
const moves = document.querySelector(".moves");
const modalReset = document.querySelector('.modal-reset-button');

let timerHandle;
let timerStarted = false;

function startTimer() {
  if (timerStarted) return;

  timerStarted = true;
  let start = Date.now();
  timerHandle = setInterval(function() {
    let delta = Date.now() - start;
    let timePassed = Math.floor(delta / 1000);

    const timerSeconds = document.querySelector("#seconds");
    const timerMinutes = document.querySelector("#minutes");
    let seconds = ("0" +  Math.floor(timePassed % 60)).substr(-2);
    let minutes = ("0" +  Math.floor(timePassed / 60)).substr(-2);
    timerSeconds.innerHTML = seconds;
    timerMinutes.innerHTML = minutes;
  }, 1000);
}

function stopTimer() {
	clearInterval(timerHandle)
}

function handleClick(evt) {
  const element = evt.target;

  if (openCardList[0] && element.id === openCardList[0].id) return;

  if (element.nodeName === "LI" && openCardList.length < 2) {
    startTimer();
    element.classList.add("open", "show");
    addCardToOpenList(element);

    }
}

deck.addEventListener('click', handleClick);
resetButton.addEventListener('click', reset);
modalReset.addEventListener('click', reset);

function addCardToOpenList(card) {
    openCardList.push(card);

    if (openCardList.length === 2) {
      updateMoveCounter();
      setTimeout(checkCardsMatch, 350);
    }
}

function updateMoveCounter() {
  moveCounter++;
  moves.innerHTML = moveCounter;
  updateStars(moveCounter);
}

function updateStars(moves) {
  if (moves === 12) {
    starCounter = 2;
    starElements[2].classList.toggle('fa-star');
    starElements[2].classList.toggle('fa-star-o');
  }
  else if (moves === 16) {
    starCounter = 1;
    starElements[1].classList.toggle('fa-star');
    starElements[1].classList.toggle('fa-star-o');
  }
}


function checkCardsMatch() {
  if (openCardList[0].firstElementChild.className === openCardList[1].firstElementChild.className) {
    for (const selectedCard of openCardList) {
      selectedCard.classList.remove("open", "show");
      selectedCard.classList.add("match");
    }
    let secondCard = openCardList.pop();
    let firstCard = openCardList.pop();
    matchedCardList.push(firstCard,secondCard);

    if (matchedCardList.length === 16) {
      endGame();
    }
  }
  else {
    setTimeout(cardsDontMatch, 350);
  }
}

function cardsDontMatch() {
  for (const selectedCard of openCardList) {
    selectedCard.classList.remove("open", "show");
  }
  openCardList = [];
}

function endGame() {
    stopTimer();
    showModal();
}

function showModal() {
  const modalMessage = document.querySelector('.modal-message');
  const modalStars = document.querySelector('.modal-stars');
  const modalTimer = document.querySelector('.modal-timer');
  const modal = document.querySelector('.modal');

  modalStars.innerHTML = stars.innerHTML;
  modalTimer.innerHTML = timer.innerHTML;


  if (starCounter === 3) {
    modalMessage.textContent = 'Whosoever holds this victory, if he be worthy, shall possess the power of the victor!';
  }
  else if (starCounter === 2) {
    modalMessage.textContent = 'A worthy effort, but futile!';
  }
  else {
    modalMessage.textContent = 'YOU ARE UNWORTHY OF THIS GAME!';
  }

  modal.style.display = 'block';

}

function reset() {
  location.reload();

}
