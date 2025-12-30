
let currentLang = "en";


/* ===== Theme ===== */

function initLanguage() {
  const savedLang = localStorage.getItem("appLanguage");
  const supportedLangs = ["en", "jp", "kr", "vi"];

  if (supportedLangs.includes(savedLang)) {
    setLanguage(savedLang);
  } else {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("ja")) setLanguage("jp");
    else if (browserLang.startsWith("ko")) setLanguage("kr");
    else if (browserLang.startsWith("vi")) setLanguage("vi");
    else setLanguage("en");
  }
}


function initTheme() {
  const saved = localStorage.getItem('app-theme');
  if (saved) {
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
}

function initFontSize() {
  const savedSize = localStorage.getItem("appFontSize") || "medium";
  setFontSize(savedSize);
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



document.addEventListener("DOMContentLoaded", () => {
  initTheme();     // restore theme
  initFontSize();  // restore font size
  initLanguage();  // restore language
});



function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("appLanguage", lang);

  document.querySelectorAll("[id^='lang_']").forEach(btn => {
    btn.classList.remove("active");
  });
  document.getElementById("lang_" + lang)?.classList.add("active");

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = translations[lang][key] || key;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    el.placeholder = translations[lang][key] || "";
  });
}



function setFontSize(size) {
  const root = document.documentElement;

  if (size === "small") root.style.setProperty("--base-font-size", "12px");
  if (size === "medium") root.style.setProperty("--base-font-size", "15px");
  if (size === "large") root.style.setProperty("--base-font-size", "18px");

  localStorage.setItem("appFontSize", size); // 👈 SAVE (ADD THIS)

  document.querySelectorAll("#font_small, #font_medium, #font_large").forEach(el => {
    el.classList.remove("active");
  });

  document.getElementById(`font_${size}`)?.classList.add("active");
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
  const btn = document.getElementById("reset_rounds_btn");
  if (btn) {
    btn.classList.remove("active");
  }
}


