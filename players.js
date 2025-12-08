function showImportModal() {
  const textarea = document.getElementById("players-textarea");
  // Clear any entered text
  textarea.value = "";
  textarea.placeholder = translations[currentLang].importExample;
  document.getElementById('importModal').style.display = 'block';
}

function hideImportModal() {
  document.getElementById('importModal').style.display = 'none';
  document.getElementById('players-textarea').value = '';
}
