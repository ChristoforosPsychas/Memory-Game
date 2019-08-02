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

/*Initialization of some variables needed below.*/
let openCardList = [];
let matchedCardList = [];
let moveCounter = 0;
let starCounter = 3;
const deck = document.querySelector('.deck');
const resetButton = document.querySelector('.reset-button');
const starElements = document.querySelectorAll('.fa-star');
const stars = document.querySelector('.stars');
const timer = document.querySelector('.timer');
const moves = document.querySelector(".moves");
const timerSeconds = document.querySelector("#seconds");
const timerMinutes = document.querySelector("#minutes");
const modalReset = document.querySelector('.modal-reset-button');
const modal = document.querySelector('.modal');

let timerHandle;
let timerStarted = false;

/*This is my timer function which starts to count the time passed. I've used a flag variable to make sure
  that the timer will only start once. I store the time which the function called into the start variable, calculate the difference and store it again in
  another variable which i divide that by 1000 to find the seconds. Then my seconds in the timer will be the timePassed modulo 60 and the minutes will be
  timePassed divide 60. This way i ensure that the timer will count correctly and count minutes as well as seconds.*/
function startTimer() {
  if (timerStarted) return;

  timerStarted = true;
  let start = Date.now();
  timerHandle = setInterval(function() {
    let delta = Date.now() - start;
    let timePassed = Math.floor(delta / 1000);
    let seconds = ("0" +  Math.floor(timePassed % 60)).substr(-2);
    let minutes = ("0" +  Math.floor(timePassed / 60)).substr(-2);
    timerSeconds.innerHTML = seconds;
    timerMinutes.innerHTML = minutes;
  }, 1000);
}
/*My stop timer function. The function above has a setInterval which returns a number.
  This function uses that number with the clearInterval to stop the timer.*/
function stopTimer() {
	clearInterval(timerHandle)
}

/*My function to handle the clicks that happen to the cards. I've included two restrictions.
  The first checks if the same card is clicked. If it is, i return early because i dont want to do something more
  to the already clicked card. The second checks if the element clicked is a node with the name LI and if the
  length of the array of the open cards is less than 2. This is because someone can click something else in the deck besides the cards.
  This would be faulty, so i wanted to be more specific. With the length less than 2, i check how many cards are in the array of the open cards.
  When everything is okay, i start the timer, show the cards and call the addCardToOpenList function.*/
function handleClick(evt) {
  const element = evt.target;

  if (openCardList[0] && element.id === openCardList[0].id) return;

  if (element.nodeName === "LI" && openCardList.length < 2) {
    startTimer();
    element.classList.add("open", "show");
    addCardToOpenList(element);

    }
}
/*Event listeners for clicking the cards, the reset button and the modal reset button */
deck.addEventListener('click', handleClick);
resetButton.addEventListener('click', reset);
modalReset.addEventListener('click', closeModal);

/*This function pushes the card clicked into the array of the open cards. If the length of that array is 2, that means we have a pair and we must check it.
  I call the updateMoveCounter function and the checkCardsMatch with a delay.*/
function addCardToOpenList(card) {
    openCardList.push(card);

    if (openCardList.length === 2) {
      updateMoveCounter();
      setTimeout(checkCardsMatch, 350);
    }
}
/*Function to update the moves counter. Pretty simple. I increase the counter and put that into the display with the innerHTML property. Then i call the updateStars function.*/
function updateMoveCounter() {
  moveCounter++;
  moves.innerHTML = moveCounter;
  updateStars(moveCounter);
}
/*My update stars function. If the moves reach a specific number, i drop one star by toggling the class names as seen below. If moves reach the second if statement, i drop another star.*/
function updateStars(moves) {
  if (moves === 15) {
    starCounter = 2;
    starElements[2].classList.toggle('fa-star');
    starElements[2].classList.toggle('fa-star-o');
  }
  else if (moves === 18) {
    starCounter = 1;
    starElements[1].classList.toggle('fa-star');
    starElements[1].classList.toggle('fa-star-o');
  }
}

/*My compare function. If the classname of the childs of the first 2 positions of the array with the open cards is the same, that means they are the same and it's a match pair.
  Then i pop them from the first array, and i push them with the correct order in a new array, which i will store the matched cards found. If the classname isn't the same,
  i call the cardsDontMatch function with a delay again.
  Finally, i put a condition that says if the length of the matched array is 16, that means i have found all the cards, and i should terminate. */
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
/*This function hides the cards again by removing the open and show classes. And i reinitialize the array with the open cards to empty it.*/
function cardsDontMatch() {
  for (const selectedCard of openCardList) {
    selectedCard.classList.remove("open", "show");
  }
  openCardList = [];
}
/*The termination function. This function stops the timer and shows the modal.*/
function endGame() {
    stopTimer();
    setTimeout(showModal, 350);
}
/*The modal function. First i initialize some variables. The stars and the timer of the modal are copied from the display with the smart innerHTML property.
  The message of the modal is being made differently. I print a different modal message depending on the star counter. And then i use the textContent property
  to show the message. At the end of the function, i edit the display style of the modal to block, in order to make it appear whenever this functions is being called.*/
function showModal() {
  const modalMessage = document.querySelector('.modal-message');
  const modalStars = document.querySelector('.modal-stars');
  const modalTimer = document.querySelector('.modal-timer');


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

function closeModal() {
  modal.style.display = 'none';
  reset();
}
/*My reset function. I initialize every variable that i need again, fix the star rating, the timer and reshuffling the cards.*/
function reset() {
  //location.reload();
  let cards = document.getElementsByClassName('card');
  openCardList = [];
  matchedCardList = [];
  moveCounter = 0;
  moves.innerHTML = moveCounter;
  starCounter = 3;
  timerStarted = false;
  for (let i = 0; i < starElements.length; i++) {
    if (starElements[i].classList.contains('fa-star-o')) {
      starElements[i].classList.toggle('fa-star-o');
      starElements[i].classList.toggle('fa-star');
    }
  }
  for (const totalCard of cards) {
    totalCard.className = 'card';
  }
  timerSeconds.innerHTML = '00';
  timerMinutes.innerHTML = '00';
  stopTimer();
  let shuffleList = shuffle(cards);
  for (const card of shuffleList) {
    document.querySelector('.deck').appendChild(card);
  }
}
