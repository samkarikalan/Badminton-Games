// ----------------- language + i18n -----------------
let currentLang = "en";

function setLanguage(lang) {
  // normalize: accept 'jp' too, map to 'ja'
  if (lang === 'jp') lang = 'ja';

  currentLang = lang;
  localStorage.setItem("appLanguage", lang); // Save user choice

  // Update UI language buttons (IDs are lang_en and lang_ja)
  document.getElementById('lang_en')?.classList.toggle('active', lang === 'en');
  document.getElementById('lang_ja')?.classList.toggle('active', lang === 'ja');

  // Update normal text
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations && translations[lang]) {
      el.textContent = translations[lang][key] || key;
    } else {
      el.textContent = key;
    }
  });

  // Update placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (translations && translations[lang]) {
      el.placeholder = translations[lang][key] || "";
    } else {
      el.placeholder = "";
    }
  });
}

// ----------------- font size + active toggle -----------------
function setFontSize(size) {
  // Remove active from font buttons
  ['small','medium','large'].forEach(s => {
    const btn = document.getElementById(`font_${s}`);
    if (btn) btn.classList.toggle('active', s === size);
  });

  // store selection
  localStorage.setItem('appFontSize', size);

  // apply font-size class to body (optional styling method — change css accordingly)
  document.body.classList.remove('font-small','font-medium','font-large');
  document.body.classList.add(`font-${size}`);

  // If you also have a separate setFontSize logic (e.g. change sizes of certain elements), call it here
  // applyFontSizeToElements(size); // optional
}


// ----------------- DOMContentLoaded: restore previous selections -----------------
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("appLanguage");
  if (savedLang === "ja" || savedLang === "en") {
    setLanguage(savedLang);
  } else {
    const browserLang = navigator.language && navigator.language.startsWith("ja") ? "ja" : "en";
    setLanguage(browserLang);
  }

  const savedFont = localStorage.getItem("appFontSize") || 'small';
  setFontSize(savedFont);

  // initialize slider label (if you use timerRange)
  const slider = document.getElementById('timerRange');
  if (slider) {
    const val = slider.value;
    const lbl = document.getElementById('sliderValue');
    if (lbl) lbl.textContent = `${val} min`;
  }
});



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
