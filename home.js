
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

  // ============================
  // BUSY STATE (START)
  // ============================
  const exportBtn = document.getElementById("exportPdfBtn");
  exportBtn?.classList.add("busy");

  try {
    if (!allRounds || allRounds.length === 0) {
      alert("No rounds to export");
      return;
    }

    const originalRound = currentRoundIndex ?? 0;
    const originalPage =
      document.querySelector(".page:not([style*='display: none'])")?.id;

    // ----------------------------
    // PDF OPTIONS (Mobile Layout)
    // ----------------------------
    const opt = {
      margin: 6,
      filename: "Badminton_Schedule.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        windowWidth: 375 // 📱 mobile width
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait"
      }
    };

    const worker = html2pdf().set(opt);

    // ----------------------------
    // Helper: wait for UI paint
    // ----------------------------
    const waitPaint = () =>
      new Promise(r => requestAnimationFrame(() => r()));

    const wait = ms =>
      new Promise(r => setTimeout(r, ms));

    // ----------------------------
    // Helper: clone page at mobile width
    // ----------------------------
    function cloneMobilePage(pageId, titleText) {
      const page = document.getElementById(pageId);

      const wrapper = document.createElement("div");
      wrapper.style.width = "375px";
      wrapper.style.padding = "10px";
      wrapper.style.boxSizing = "border-box";

      if (titleText) {
        const h = document.createElement("h2");
        h.textContent = titleText;
        h.style.textAlign = "center";
        h.style.marginBottom = "10px";
        wrapper.appendChild(h);
      }

      wrapper.appendChild(page.cloneNode(true));
      return wrapper;
    }

    // ============================
    // PAGE 1 — PLAYERS
    // ============================
    showPage("page1");
    await waitPaint();

    await worker
      .from(cloneMobilePage("page1", "Players"))
      .toPdf()
      .get("pdf")
      .then(pdf => pdf.addPage());

    // ============================
    // PAGE 3 — SUMMARY (REFRESH)
    // ============================
    showPage("page3");

    if (typeof report === "function") {
      report(); // 🔁 rebuild summary
      await waitPaint();
    }

    await worker
      .from(cloneMobilePage("page3", "Summary"))
      .toPdf()
      .get("pdf")
      .then(pdf => pdf.addPage());

    // ============================
    // PAGE 2 — ROUNDS (ALL)
    // ============================
    showPage("page2");

    for (let i = 0; i < allRounds.length; i++) {
      showRound(i);
      await wait(120); // allow DOM render

      const roundPage = cloneMobilePage("page2", allRounds[i].round);

      await worker
        .from(roundPage)
        .toPdf()
        .get("pdf")
        .then(pdf => {
          if (i !== allRounds.length - 1) {
            pdf.addPage();
          }
        });
    }

    // ============================
    // SAVE PDF
    // ============================
    worker.save();

    // ============================
    // RESTORE UI
    // ============================
    if (originalPage) showPage(originalPage);
    showRound(originalRound);

  } finally {
    // ============================
    // BUSY STATE (END)
    // ============================
    exportBtn?.classList.remove("busy");
  }
}
async function oldexportAllRoundsToPDF() {
  if (!allRounds || allRounds.length === 0) {
    alert('No rounds to export');
    return;
  }

  const resultsDiv = document.getElementById('game-results');
  const originalIndex = currentRoundIndex ?? 0;

  const opt = {
    margin: 10,
    filename: 'Rounds_Schedule.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  const worker = html2pdf().set(opt);

  for (let i = 0; i < allRounds.length; i++) {
    showRound(i);

    // allow DOM to paint
    await new Promise(r => setTimeout(r, 150));

    const page = document.createElement('div');

    const title = document.createElement('h2');
    title.style.textAlign = 'center';
    title.style.marginBottom = '10px';
    title.textContent = allRounds[i].round;

    page.appendChild(title);
    page.appendChild(resultsDiv.cloneNode(true));

    await worker.from(page).toPdf().get('pdf').then(pdf => {
      if (i !== allRounds.length - 1) pdf.addPage();
    });
  }

  worker.save();

  // Restore UI
  showRound(originalIndex);
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
