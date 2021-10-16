// Countdown Form overlay
const countdownForm = document.getElementById('countdown-form');
const date = document.getElementById('date');
const submitBtn = document.getElementById('submit');
const titleInput = document.getElementById('title');
// Timer Overlay
const timerTitle = document.getElementById('timer-title');
const days = document.getElementById('days');
const hours = document.getElementById('hours');
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');
const timerContainer = document.getElementById('timer');

// Reset
const resetBtn = document.getElementById('reset');

// Completed
const completedContainer = document.getElementById('completed');
const completedBtn = document.getElementById('completed-btn');
const completedInfo = document.getElementById('completed-info');

// Global Variables
let countdown;
let savedCountdown;

// Time Converter
const timeConverter = (time) => {
  let numOfDays;
  let numOfHrs;
  let numOfMins;
  let numOfSecs;
  if (time > 0) {
    let toSecs = time / 1000;
    let toMins = toSecs / 60;
    let toHrs = toMins / 60;
    let toDays = toHrs / 24;
    numOfDays = Math.floor(toDays);
    toDays -= numOfDays;
    toDays *= 24;
    numOfHrs = Math.floor(toDays);
    toDays -= numOfHrs;
    toDays *= 60;
    numOfMins = Math.floor(toDays);
    toDays -= numOfMins;
    numOfSecs = Math.floor(toDays * 60);
  } else {
    numOfDays = 0;
    numOfHrs = 0;
    numOfMins = 0;
    numOfSecs = 0;
  }

  // Setting up timer values
  timerTitle.textContent = titleInput.value;
  days.textContent = numOfDays;
  hours.textContent = numOfHrs;
  minutes.textContent = numOfMins;
  seconds.textContent = numOfSecs;
};

// Minimum attribute for date calendar
const setMinimumDate = () => {
  let dateNow = new Date();
  let yearNow = dateNow.getFullYear();
  let monthNow = dateNow.getMonth() + 1; // since it starts from 0
  let dayNow = dateNow.getDate();
  let hourNow = dateNow.getHours();
  let minuteNow = dateNow.getMinutes();

  // to make it two digits
  if (monthNow < 10) {
    monthNow = `0${monthNow}`;
  }
  if (dayNow < 10) {
    dayNow = `0${dayNow}`;
  }
  if (hourNow < 10) {
    hourNow = `0${hourNow}`;
  }
  if (minuteNow < 10) {
    minuteNow = `0${minuteNow}`;
  }
  date.setAttribute(
    'min',
    `${yearNow}-${monthNow}-${dayNow}T${hourNow}:${minuteNow}`
  );
};

// Restoring Previous countdown from local storage
const restorePreviousCountdown = () => {
  let previousCountdown = JSON.parse(localStorage.getItem('countdown'));
  if (previousCountdown) {
    timerTitle.textContent = previousCountdown.title;
    timeConverter(previousCountdown.date - new Date().getTime());
    timerContainer.style.display = 'flex';
    countdownForm.style.display = 'none';
    countdown = setInterval(() => {
      today = Date.now();
      timeConverter(previousCountdown.date - today);
    }, 1000);
  }
};

// On Load
setMinimumDate();
restorePreviousCountdown();

// Submit button event listener
submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  savedCountdown = {
    title: titleInput.value,
    date: new Date(date.value).getTime(),
  };
  // Saving to Local Storage
  localStorage.setItem('countdown', JSON.stringify(savedCountdown));

  if (titleInput.value !== '' && date.value !== '') {
    countdownForm.style.display = 'none';
    timerContainer.style.display = 'flex';
    let today = Date.now(); //milliseconds
    let newDate = new Date(date.value).getTime();
    // setInterval
    countdown = setInterval(() => {
      if (newDate - today <= 0) {
        completedInfo.textContent = `${titleInput.value} completed on ${date.value}`;
        titleInput.value = '';
        date.value = '';
        timerContainer.style.display = 'none';
        completedContainer.style.display = 'flex';
        localStorage.removeItem('countdown');
        clearInterval(countdown);
      }
      today = Date.now();
      timeConverter(newDate - today);
    }, 1000);
  } else {
    alert('Input is undefined!');
  }
});

// Reset Event Listener
resetBtn.addEventListener('click', () => {
  titleInput.value = '';
  date.value = '';
  countdownForm.style.display = 'flex';
  timerContainer.style.display = 'none';
  localStorage.removeItem('countdown');
  timeConverter(0);
  clearInterval(countdown);
});

// Completed Event Listener
completedBtn.addEventListener('click', () => {
  titleInput.value = '';
  date.value = '';
  countdownForm.style.display = 'flex';
  completedContainer.style.display = 'none';
  clearInterval(countdown);
});
