let timerInterval;
let remainingSeconds = 0;
let isRunning = false;
let alarmTimeout = null;

/* ================================
   MOBILE AUDIO UNLOCK
================================ */
let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;

  const sound = document.getElementById("timerSound");

  sound.play()
    .then(() => {
      sound.pause();
      sound.currentTime = 0;
      audioUnlocked = true;
      console.log("Audio unlocked");
    })
    .catch(() => {
      console.log("Unlock failed (normal on first try)");
    });
}

/* ================================
   TIMER TOGGLE
================================ */
function toggleTimer() {
  unlockAudio();   // <<< REQUIRED for mobile sound

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

/* ================================
   TIMER COUNTDOWN
================================ */
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

/* ================================
   MOBILE-SAFE BEEP REPEATER
================================ */
function playBeep() {
  const sound = document.getElementById("timerSound");

  stopAlarm(); // clean state

  let count = 0;

  function playOnce() {
    sound.currentTime = 0;
    sound.play().catch(() => {});

    count++;
    if (count < 20) { 
      setTimeout(playOnce, 1500); // repeat without loop
    }
  }

  playOnce();

  // stop after ~30 sec (20 repeats)
  alarmTimeout = setTimeout(() => {
    stopAlarm();
  }, 30000);
}

function stopAlarm() {
  const sound = document.getElementById("timerSound");
  sound.pause();
  sound.currentTime = 0;

  clearTimeout(alarmTimeout);
  alarmTimeout = null;
}

/* ================================
   SLIDER LABEL UPDATE
================================ */
function updateSliderLabel() {
  document.getElementById("sliderValue").textContent =
    document.getElementById("timerInput").value + " min";

  if (!isRunning) {
    const mins = parseInt(document.getElementById("timerInput").value) || 8;
    remainingSeconds = mins * 60;
    updateDisplay();
  }
}
