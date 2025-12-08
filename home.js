function showPage(pageID, el) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');

  // Show selected page
  document.getElementById(pageID).style.display = 'block';

  // Update active tab styling
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  if (el) el.classList.add('active');

  // ➜ Additional action when page2 is opened
  if (pageID === "page2") {
     if (allRounds.length <= 1) {
	     resetRounds();
		 //goToRounds();
     } else {
     //goToRounds();
     }
   }
  
	if (pageID === "page3") {
     report();
   }
}


let currentLang = "en";

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
