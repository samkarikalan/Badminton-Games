const translations = {
  en: {
    appTitle: "CLUB Scheduler™",
    players: "Players",
    rounds: "Rounds",
    summary: "Summary",
    fontSize: "Font Size",
    reset: "Reset",
    resetAll: "Reset All",
    resetExcept: "Reset Except Players",
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
    roundShort: "R"
  },
  jp: {
    appTitle: "CLUB Scheduler™",
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
    roundShort: "R"
  }
};

let currentLang = "en";

function setLanguage(lang) {
  currentLang = lang;

  // Update active button
  document.getElementById('lang_en').classList.toggle('active', lang==='en');
  document.getElementById('lang_jp').classList.toggle('active', lang==='jp');

  // Update all i18n elements
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.dataset.i18n;
    el.textContent = translations[lang][key] || key;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{
    const key = el.dataset.i18nPlaceholder;
    el.placeholder = translations[lang][key] || "";
  });
}

