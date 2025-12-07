let timerInterval;
let remainingSeconds = 0;
let isRunning = false;
let alarmTimeout = null;

function toggleTimer() {
  if (!isRunning) {
    startTimerAlwaysReset();
  } else {
    stopTimer();
  }
}

function startTimerAlwaysReset() {
  const mins = parseInt(document.getElementById("timerInput").value) || 8;
  remainingSeconds = mins * 60;
  updateDisplay();

  clearInterval(timerInterval);
  timerInterval = setInterval(runTimer, 1000);

  document.getElementById("timerToggleBtn").classList.add("running");
  isRunning = true;
}

function stopTimer() {
  clearInterval(timerInterval);
  document.getElementById("timerToggleBtn").classList.remove("running");
  isRunning = false;
}

function runTimer() {
  remainingSeconds--;
  updateDisplay();

  if (remainingSeconds <= 0) {
    stopTimer();
    playBeep();
  }
}

function updateDisplay() {
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  document.getElementById("timerDisplay").textContent =
    `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function playBeep() {
  const sound = document.getElementById("timerSound");
  
  stopAlarm(); // ensure clean start
  
  sound.loop = true;
  sound.play();

  alarmTimeout = setTimeout(() => {
    stopAlarm();
  }, 30000); // stop alarm after 30 seconds
}
function stopAlarm() {
  const sound = document.getElementById("timerSound");
  sound.loop = false;
  sound.pause();
  sound.currentTime = 0;

  clearTimeout(alarmTimeout);
  alarmTimeout = null;
}

function updateSliderLabel() {
  document.getElementById("sliderValue").textContent =
    document.getElementById("timerInput").value + " min";

  if (!isRunning) {
    const mins = parseInt(document.getElementById("timerInput").value) || 8;
    remainingSeconds = mins * 60;
    updateDisplay();
  }
}
