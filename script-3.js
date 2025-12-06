const translations = {
  en: {
    appTitle: "CLUB Scheduler™",
    home: "Home",
    players: "Players",
    rounds: "Rounds",
    summary: "Summary",
    fontSize: "Font Size",
    reset: "Reset",
    resetAll: "Reset",
    resetExcept: "Reset Games",
    enterCourts: "Enter Number of Courts",
    importPlayers: "Import Multiple Players",
    gender: "Gender",
    male: "Male",
    female: "Female",
    import: "Import",
    cancel: "Cancel",
    enterPlayerName: "Enter Player Name",
    addPlayer: "Add Player",
    fixedPairs: "Set Fixed Pairs (Optional)",
    add: "Add",
    prevRound: "« Round",
    nextRound: "Round »",
    roundShort: "R",
    rank: "Rank",
    name: "Name",
    played: "Played",
    rested: "Rested"
  },
  jp: {
    appTitle: "CLUB Scheduler™",
    home: "ホーム",
    players: "選手一覧",
    rounds: "試合ラウンド",
    summary: "集計",
    fontSize: "文字サイズ",
    reset: "リセット",
    resetAll: "全てをリセット",
    resetExcept: "プレーヤー以外をリセット",
    enterCourts: "コート数を入力",
    importPlayers: "複数選手を取り込み",
    gender: "性別",
    male: "男性",
    female: "女性",
    import: "取り込み",
    cancel: "キャンセル",
    enterPlayerName: "選手名を入力",
    addPlayer: "選手追加",
    fixedPairs: "固定ペア設定（任意）",
    add: "追加",
    prevRound: "« ラウンド",
    nextRound: "ラウンド »",
    roundShort: "R",
    rank: "順位",
    name: "名前",
    played: "試合数",
    rested: "休憩数"
  }
};

let currentLang = "en";

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

document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("appLanguage");

  if (savedLang === "ja" || savedLang === "en") {
    setLanguage(savedLang);
  } else {
    const browserLang = navigator.language.startsWith("ja") ? "ja" : "en";
    setLanguage(browserLang);
  }
});




