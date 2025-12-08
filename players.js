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

/* =========================
   ADD SINGLE PLAYER
========================= */
function addPlayer() {
  const name = document.getElementById('player-name').value.trim();
  const gender = document.getElementById('player-gender').value;
  if (name && !schedulerState.allPlayers.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    schedulerState.allPlayers.push({ name, gender, active: true });
    schedulerState.activeplayers = schedulerState.allPlayers
      .filter(p => p.active)
      .map(p => p.name)
      .reverse();

    updatePlayerList();
    updateFixedPairSelectors();
  } else if (name) {
    alert(`Player "${name}" already exists!`);
  }
  document.getElementById('player-name').value = '';
}


/* =========================
   EDIT PLAYER INFO
========================= */
function editPlayer(i, field, val) {
  const player = schedulerState.allPlayers[i];

  // Normal update
  if (field === 'active') {
    player.active = !!val;                         // make sure it's boolean
    if (val) {                                     // ←←← THIS IS THE ONLY NEW PART
      const highest = Math.max(0, ...schedulerState.allPlayers.map(p => p.turnOrder || 0));
      player.turnOrder = highest + 1;              // put him at the very end of the line
    }
  } else {
    player[field] = val.trim();
  }

  // Your two existing lines — unchanged
  schedulerState.activeplayers = schedulerState.allPlayers
    .filter(p => p.active)
    .map(p => p.name)
    .reverse();

  updatePlayerList();
  updateFixedPairSelectors();
}
/* =========================
   DELETE PLAYER
========================= */
function deletePlayer(i) {
  schedulerState.allPlayers.splice(i, 1);
   schedulerState.activeplayers = schedulerState.allPlayers
    .filter(p => p.active)
    .map(p => p.name)
    .reverse();

  updatePlayerList();
  updateFixedPairSelectors();
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

/* =========================
   ADD PLAYERS FROM TEXT
========================= */
function addPlayersFromText() {
  const text = document.getElementById('players-textarea').value.trim();
  if (!text) return;
  const defaultGender = document.querySelector('input[name="genderSelect"]:checked')?.value || "Male";
  const lines = text.split(/\r?\n/);

  const stopMarkers = [/court full/i, /wl/i, /waitlist/i, /late cancel/i, /cancelled/i, /reserve/i, /bench/i, /extras/i, /backup/i];

  let startIndex = 0;
  let stopIndex = lines.length;

  // Find first "Confirm" line
  const confirmLineIndex = lines.findIndex(line => /confirm/i.test(line));

  if (confirmLineIndex >= 0) {
    startIndex = confirmLineIndex + 1;
    // Find stop marker after Confirm
    for (let i = startIndex; i < lines.length; i++) {
      if (stopMarkers.some(re => re.test(lines[i]))) {
        stopIndex = i;
        break;
      }
    }
  } else {
    // No "Confirm" found → treat all lines as plain names
    startIndex = 0;
    stopIndex = lines.length;
  }

  const extractedNames = [];

  for (let i = startIndex; i < stopIndex; i++) {
    let line = lines[i].trim();
    if (!line) continue;                 // skip blank lines
    if (line.toLowerCase().includes("https")) continue; // skip URLs

    // Keep the prefix as-is (do NOT remove numbering or dash)
    // Extract parentheses content if present
    const parenMatch = line.match(/\(([^)]+)\)/);
    if (parenMatch) {
      line = parenMatch[1].trim();
    }

    // Avoid duplicates (case-insensitive)
    if (!schedulerState.allPlayers.some(p => p.name.toLowerCase() === line.toLowerCase())) {
      extractedNames.push({ name: line, gender: defaultGender, active: true });
    }
  }

  schedulerState.allPlayers.push(...extractedNames);

  schedulerState.activeplayers = schedulerState.allPlayers
    .filter(p => p.active)
    .map(p => p.name)
    .reverse();

  updatePlayerList();
  updateFixedPairSelectors();
  hideImportModal();
}


