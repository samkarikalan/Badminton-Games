

function setFontSize(size) {
  const root = document.documentElement;

  // Update font size variable
  if (size === "small") root.style.setProperty("--base-font-size", "10px");
  if (size === "medium") root.style.setProperty("--base-font-size", "15px");
  if (size === "large") root.style.setProperty("--base-font-size", "20px");
    // Remove active from all buttons
  document.querySelectorAll(".btn").forEach(el => {
    el.classList.remove("active");
  });

  // Add active to selected button
  document.getElementById(`font_${size}`).classList.add("active");
}

function homeactive() {
}

function toggleActive(index, checkbox) {
  // Update data model first
  schedulerState.allPlayers[index].active = checkbox.checked;

  const card = checkbox.closest(".player-edit-card");

  // Apply the CSS class based on active state
  if (checkbox.checked) {
    card.classList.remove("inactive");
  } else {
    card.classList.add("inactive");
  }

  // Recalculate active players list
  schedulerState.activeplayers = schedulerState.allPlayers
    .filter(p => p.active)
    .map(p => p.name)
	.reverse();

  // Refresh UI
  updateFixedPairSelectors();
}


let currentLang = "en";

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("appLanguage", lang); // Save user choice

  // Remove 'active' from any language buttons (IDs that start with lang_)
  document.querySelectorAll("[id^='lang_']").forEach(el => {
    el.classList.remove("active");
  });

  // Add 'active' to the selected language button
  const btn = document.getElementById(`lang_${lang}`);
  if (btn) btn.classList.add("active");

  // Update normal text
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    // guard: translations and translations[lang] should exist
    if (typeof translations !== "undefined" && translations[lang]) {
      el.textContent = translations[lang][key] || key;
    } else {
      el.textContent = key;
    }
  });

  // Update placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (typeof translations !== "undefined" && translations[lang]) {
      el.placeholder = translations[lang][key] || "";
    } else {
      el.placeholder = "";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("appLanguage");

  // match the ids and HTML which use 'jp' / 'en'
  if (savedLang === "jp" || savedLang === "en") {
    setLanguage(savedLang);
  } else {
    // detect browser language: if Japanese -> use 'jp', otherwise 'en'
    const browserLang = navigator.language && navigator.language.startsWith("ja") ? "jp" : "en";
    setLanguage(browserLang);
  }
});
======================== */
function ResetAll() {
  location.reload(); // This refreshes the entire app clean
}
function resetRounds() {
  // 1️⃣ Clear all previous rounds
  allRounds.length = 0;
	report();
  //goToRounds()
  //const btn = document.getElementById('goToRoundsBtn');
  //btn.enabled;
}

const courtSlider = document.getElementById("num-courts");
const display = document.getElementById("courts-display");

courtSlider.addEventListener("input", () => {
  display.textContent = courtSlider.value;
});

courtSlider.addEventListener("change", () => {
  goToRounds();
});
/*
const courtInput = document.getElementById("num-courts");

courtInput.addEventListener("input", () => {
  const num = parseInt(courtInput.value.trim());
  if (num > 0) {
    goToRounds();
  }
})
