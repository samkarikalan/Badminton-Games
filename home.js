
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

