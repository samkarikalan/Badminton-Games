function loadHelp(type) {
  // hide all help blocks
  document.querySelectorAll(".player-help").forEach(el => {
    el.style.display = "none";
  });

  // show selected help
  const help = document.getElementById(`${type}Help`);
  if (!help) {
    console.warn("Help block not found:", `${type}Help`);
    return;
  }

  help.style.display = "block";

  // update active button
  document.querySelectorAll(".help-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  // apply language
  const savedLang = localStorage.getItem("appLanguage");  
  updateHelpLanguage(savedLang);
  
}

function updateHelpLanguage(lang) {  
  document.querySelectorAll(".player-help").forEach(help => {
    help.classList.remove("lang-en", "lang-jp", "lang-kr", "lang-vi");
    help.classList.add(`lang-${lang}`);
  });
}


function updateHelpLanguage2(appLang) {
  const help = document.querySelector(".player-help");
  if (!help) return;

  help.classList.remove("lang-en", "lang-jp", "lang-kr", "lang-vi");
  help.classList.add(`lang-${appLang}`);
}

