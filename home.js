
let currentLang = "en";

/* ===== Timer ===== */
function updateSliderLabel() {
  const val = document.getElementById('timerInput').value;
  document.getElementById('sliderValue').textContent = val + ' min';
}

/* ===== Theme ===== */
function initTheme() {
  const saved = localStorage.getItem('app-theme');
  if (saved) {
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
}

function applyTheme(mode) {
  document.body.classList.toggle('app-dark', mode === 'dark');

  document.getElementById('theme_light')?.classList.toggle('active', mode === 'light');
  document.getElementById('theme_dark')?.classList.toggle('active', mode === 'dark');

  localStorage.setItem('app-theme', mode);
}

function setTheme(mode) {
  applyTheme(mode);
}

/* ===== Init ===== */
initTheme();
updateSliderLabel();


document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("appLanguage");

  if (savedLang === "jp" || savedLang === "en") {
    setLanguage(savedLang);
  } else {
    const browserLang = navigator.language.startsWith("jp") ? "jp" : "en";
    setLanguage(browserLang);
  }
});


function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("appLanguage", lang); // Save user choice

  // Update UI language buttons
  document.getElementById('lang_en').classList.toggle('active', lang === 'en');
  document.getElementById('lang_jp').classList.toggle('active', lang === 'jp');

  // Update normal text
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = translations[lang][key] || key;
  });

  // Update placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    el.placeholder = translations[lang][key] || "";
  });
}


function setFontSize(size) {
  const root = document.documentElement;

  // Update font size variable
  if (size === "small") root.style.setProperty("--base-font-size", "12px");
  if (size === "medium") root.style.setProperty("--base-font-size", "15px");
  if (size === "large") root.style.setProperty("--base-font-size", "18px");

  // Only remove active from font-size buttons, not all .btn elements
  document.querySelectorAll("#font_small, #font_medium, #font_large").forEach(el => {
    el.classList.remove("active");
  });

  // Add active to selected font size
  document.getElementById(`font_${size}`).classList.add("active");
}

function ResetAll() {
  location.reload(); // This refreshes the entire app clean
  document.getElementById("reset_all").classList.remove("active");
}


function resetRounds() {
  // 1️⃣ Clear all previous rounds
  allRounds.length = 0;
  initScheduler(1);  
  clearPreviousRound();
  goToRounds();
  report(); 
  document.getElementById("reset_rounds").classList.remove("active");
}

async function exportAllRoundsToPDF() {
  if (!allRounds || allRounds.length === 0) {
    alert('No rounds to export');
    return;
  }

  const originalRoundIndex = currentRoundIndex ?? 0;

  // 🔹 Temporary container for PDF
  const exportContainer = document.createElement('div');
  exportContainer.style.width = '210mm';
  exportContainer.style.background = '#fff';
  document.body.appendChild(exportContainer);

  /* =========================
     1️⃣ PLAYERS PAGE
  ========================= */
  const page1 = document.getElementById('page1');
  if (page1) {
    const clone = page1.cloneNode(true);
    clone.style.display = 'block';
    clone.style.pageBreakAfter = 'always';

    clone.prepend(makeTitle('Players'));
    exportContainer.appendChild(clone);
  }

  /* =========================
     2️⃣ SUMMARY PAGE
  ========================= */
  const page3 = document.getElementById('page3');
  if (page3) {
    const clone = page3.cloneNode(true);
    clone.style.display = 'block';
    clone.style.pageBreakAfter = 'always';

    clone.prepend(makeTitle('Summary'));
    exportContainer.appendChild(clone);
  }

  /* =========================
     3️⃣ ROUNDS (FULL PAGE2)
  ========================= */
  const page2 = document.getElementById('page2');

  for (let i = 0; i < allRounds.length; i++) {
    showRound(i);
    await waitForPaint();

    const roundClone = page2.cloneNode(true);

    // 🔥 Force render hidden page
    roundClone.style.display = 'block';
    roundClone.style.pageBreakAfter = 'always';

    roundClone.prepend(makeTitle(allRounds[i].round));

    exportContainer.appendChild(roundClone);
  }

  /* =========================
     EXPORT
  ========================= */
  await html2pdf().set({
    margin: 10,
    filename: 'Badminton_Schedule.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(exportContainer).save();

  // 🧹 Restore UI
  document.body.removeChild(exportContainer);
  showRound(originalRoundIndex);
}

/* ===== helpers ===== */

function makeTitle(text) {
  const h = document.createElement('h2');
  h.innerText = text;
  h.style.textAlign = 'center';
  h.style.marginBottom = '10px';
  return h;
}

function waitForPaint() {
  return new Promise(resolve => setTimeout(resolve, 150));
}
function saveSchedule() {
  // Placeholder – implement later
  console.log('Save schedule clicked');

  // Future ideas:
  // localStorage.setItem('savedSchedule', JSON.stringify(allRounds));
  // export JSON
  // cloud sync

  alert('Save feature coming soon');
}
