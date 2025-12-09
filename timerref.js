let alarmTimeout = null;
let timerInterval = null;
let remainingSeconds = 8 * 60;

function toggleTimerPanel() {
  const panel = document.getElementById("timerPanel");
  const isOpen = panel.classList.contains("open");

  panel.classList.toggle("open");
  panel.classList.toggle("hidden");

  // If panel is being closed, stop alarm too
  if (isOpen) stopAlarm();
}

function updateDisplay() {
  const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const secs = String(remainingSeconds % 60).padStart(2, '0');
  document.getElementById('timerDisplay').innerText = `${mins}:${secs}`;
}

function startTimer() {
  if (timerInterval) return;

  const endTime = Date.now() + remainingSeconds * 1000;

  timerInterval = setInterval(() => {
    remainingSeconds = Math.max(0, Math.round((endTime - Date.now()) / 1000));
    updateDisplay();

    if (remainingSeconds <= 0) {
      stopTimer();
      playAlarm();
    }
  }, 200);
}

function playAlarm() {
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

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  stopAlarm();
}

function resetTimer() {
  const mins = parseInt(document.getElementById("timerInput").value) || 8;
  remainingSeconds = mins * 60;
  updateDisplay();
  stopTimer();
}

function applyNewTime() {
  resetTimer();
}

function unlockAudio() {
  const sound = document.getElementById("timerSound");

  sound.play().then(() => {
    sound.pause();
    sound.currentTime = 0;
    console.log("Audio Unlocked!");
  }).catch(err => {
    console.log("Unlock failed:", err);
  });
}
