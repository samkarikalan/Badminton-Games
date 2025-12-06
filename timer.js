let timerInterval = null;
let remainingSeconds = 8 * 60;

function toggleTimerPanel() {
  const panel = document.getElementById("timerPanel");
  panel.classList.toggle("open");
  panel.classList.toggle("hidden");
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
      document.getElementById("timerSound").play();
    }
  }, 200);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
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


document.getElementById("roundTimerIcon").addEventListener("click", () => {
    toggleTimerPanel();   // show the panel
    unlockAudio();        // allow sound (mobile requirement)
    startTimer();         // immediately begin countdown
});







function unlockAudio() {
    const sound = document.getElementById("timerSound");

    sound.play().then(() => {
        sound.pause();
        sound.currentTime = 0;
        console.log("Audio unlocked");
    }).catch(err => {
        console.log("Unlock failed:", err);
    });
}
