
const HIIT = {
    rounds: 0,
    tabatas: 0,
    emin: 0,
    esec: 0,
    rmin: 0,
    rsec: 0
};
let TIME_LIMIT = 0;
// HIIT.rounds = parseInt(document.getElementById("rounds").value);

const FULL_DASH_ARRAY = 283;
let WARNING_THRESHOLD = TIME_LIMIT / 2;
let ALERT_THRESHOLD = TIME_LIMIT / 4;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};


let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;
let exercise = true;
let work = 0;
let rest = 0;
let rounds = 0;
let isGreen = true;
let started = false;
let roundsFinished = 0;



function exerciseClock() {
  HIIT.rounds = parseInt(document.getElementById("rounds").value);
  if(isNaN(HIIT.rounds)) HIIT.rounds = 1;
  HIIT.tabatas = parseInt(document.getElementById("tabatas").value);
  if(isNaN(HIIT.tabatas)) HIIT.tabatas = 1;
  HIIT.emin = parseInt(document.getElementById("time_on__min").value);
  if(isNaN(HIIT.emin)) HIIT.emin = 0;
  HIIT.esec = parseInt(document.getElementById("time_on__sec").value);
  if(isNaN(HIIT.esec)) HIIT.esec = 0;
  HIIT.rmin = parseInt(document.getElementById("time_off__min").value);
  if(isNaN(HIIT.rmin)) HIIT.rmin = 0;
  HIIT.rsec = parseInt(document.getElementById("time_off__sec").value);
  if(isNaN(HIIT.rsec)) HIIT.rsec = 0;
  TIME_LIMIT = ((((HIIT.emin * 60) + HIIT.esec) + ((HIIT.rmin * 60) + HIIT.rsec))
                * HIIT.rounds) * HIIT.tabatas;

  work = ((HIIT.emin * 60) + HIIT.esec);
  rest = ((HIIT.rmin * 60) + HIIT.rsec);
  rounds = HIIT.rounds * HIIT.tabatas;
  console.log("This is the round counter: " + rounds);

  WARNING_THRESHOLD = TIME_LIMIT / 2;
  ALERT_THRESHOLD = TIME_LIMIT / 4;
  COLOR_CODES.warning.threshold = WARNING_THRESHOLD;
  COLOR_CODES.alert.threshold = ALERT_THRESHOLD;

  timePassed = 0;
  timeLeft = TIME_LIMIT;
  timerInterval = null;
  remainingPathColor = COLOR_CODES.info.color;
  

  // document.getElementById("base-timer-path-remaining").classList.remove(COLOR_CODES.alert.color);
  // document.getElementById("base-timer-path-remaining").classList.add(COLOR_CODES.info.color);

  var allInputs = document.querySelectorAll('input');
  allInputs.forEach(singleInput => singleInput.value = '');

  // roundsRemaining++;
  // if(roundsRemaining >= HIIT.rounds) {tabatasRemaining++; roundsRemaining=0;}
  // if(tabatasRemaining > HIIT.tabatas) {window.location.reload()}
  // console.log(roundsRemaining);
  // console.log(tabatasRemaining);

  if(TIME_LIMIT > 0) {startTimer();} //&& tabatasRemaining <= HIIT.tabatas+1
  else {clearInterval(timerInterval)}
}

// function restClock() {
//     TIME_LIMIT = ((HIIT.rmin * 60) + HIIT.rsec);

//     WARNING_THRESHOLD = TIME_LIMIT / 2;
//     ALERT_THRESHOLD = TIME_LIMIT / 4;

//     COLOR_CODES.warning.threshold = WARNING_THRESHOLD;
//     COLOR_CODES.alert.threshold = ALERT_THRESHOLD;

//     timePassed = 0;
//     timeLeft = TIME_LIMIT;
//     timerInterval = null;
//     remainingPathColor = COLOR_CODES.info.color;

//     document.getElementById("base-timer-path-remaining").classList.remove(COLOR_CODES.alert.color);
//     document.getElementById("base-timer-path-remaining").classList.add(COLOR_CODES.info.color);

//     var allInputs = document.querySelectorAll('input');
//     allInputs.forEach(singleInput => singleInput.value = '');

//     wait(1000)

//     if(TIME_LIMIT > 0) {startTimer();}
//     else {clearInterval(timerInterval); }
// }

const submit = document.getElementById("submission");
submit.addEventListener('click', function() {
    event.target.disabled = true;
    exerciseClock();
});


document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(timeLeft)}</span>
  <p id="roundsCount"></p>
</div>
`;

function printRounds() {
  return `${roundsFinished}/${rounds}`;
}

function onTimesUp() {
  clearInterval(timerInterval);
  window.location.reload();
  // if(exercise) {
  //   exercise = false;
  //   restClock();
  // }
  // else {
  //   exercise = true;
  //   exerciseClock();
  // }
  // clearInterval(timerInterval);
}

function toggleFlagColor() {
  setRemainingPathColor(timeLeft);
  setTimeout(toggleFlagColor, isGreen ? (work)*1000 : (rest)*1000);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed + 1;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    //setRemainingPathColor(timeLeft);
    setCircleDasharray();
    if(!started) {
      setTimeout(toggleFlagColor, (work)*1000);
      started = true;
    }
    
    if (timeLeft === 0 || timeLeft < 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  // if (timeLeft <= alert.threshold) {
  //   document
  //     .getElementById("base-timer-path-remaining")
  //     .classList.remove(warning.color);
  //   document
  //     .getElementById("base-timer-path-remaining")
  //     .classList.add(alert.color);
  // } else if (timeLeft <= warning.threshold) {
  //   document
  //     .getElementById("base-timer-path-remaining")
  //     .classList.remove(info.color);
  //   document
  //     .getElementById("base-timer-path-remaining")
  //     .classList.add(warning.color);
  // }
  if(isGreen) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove("green");
    document
      .getElementById("base-timer-path-remaining")
       .classList.add("red");
    isGreen = false; console.log("Turned Red");
  }
  else {
  document
    .getElementById("base-timer-path-remaining")
    .classList.remove("red");
  document
    .getElementById("base-timer-path-remaining")
     .classList.add("green");
  isGreen = true; console.log("Turned Green");
  roundsFinished++;
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

// document.getElementById("roundsCount").innerHTML = `
//   ${printRounds()}`;