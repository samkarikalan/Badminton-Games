function pastePlayersText() {
  const textarea = document.getElementById('players-textarea');

  if (navigator.clipboard && navigator.clipboard.readText) {
    navigator.clipboard.readText()
      .then(text => {
        textarea.value += (textarea.value ? '\n' : '') + text;
        textarea.focus();
      })
      .catch(() => {
        alert('Paste not allowed. Long-press and paste instead.');
      });
  } else {
    alert('Paste not supported on this device.');
  }
}



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
function addPlayersFromText2() {
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
    //const parenMatch = line.match(/\(([^)]+)\)/);
    
	  //if (parenMatch) {
      //line = parenMatch[1].trim();
    //}

	  // Extract parentheses content if present
const parenMatch = line.match(/\(([^)]+)\)/);
if (parenMatch) {
  line = parenMatch[1].trim();
}

// --- normalize to: [number(optional)] + first name ---
const match = line.match(/^(\d+\.?\s*)?(.*)$/);
if (match) {
  const prefix = match[1] || "";          // "10. " | "10 " | ""
  const namePart = match[2].trim();       // "Kari Kaplan"
  const firstName = namePart.split(/\s+/)[0];
  //line = prefix + firstName;
	line = prefix + namePart;
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

function addPlayersFromText() {
  const text = document.getElementById('players-textarea').value.trim();
  if (!text) return;

  const defaultGender =
    document.querySelector('input[name="genderSelect"]:checked')?.value || "Male";

  const lines = text.split(/\r?\n/);

  const stopMarkers = [
    /court full/i, /wl/i, /waitlist/i, /late cancel/i,
    /cancelled/i, /reserve/i, /bench/i, /extras/i, /backup/i
  ];

  let startIndex = 0;
  let stopIndex = lines.length;

  // Find first "Confirm" line
  const confirmLineIndex = lines.findIndex(line => /confirm/i.test(line));

  if (confirmLineIndex >= 0) {
    startIndex = confirmLineIndex + 1;
    for (let i = startIndex; i < lines.length; i++) {
      if (stopMarkers.some(re => re.test(lines[i]))) {
        stopIndex = i;
        break;
      }
    }
  }

  const extractedNames = [];

  for (let i = startIndex; i < stopIndex; i++) {
    let line = lines[i].trim();
    if (!line) continue;
    if (line.toLowerCase().includes("https")) continue;

    let gender = defaultGender;

    // ✅ Handle name,gender format
    if (line.includes(",")) {
      const parts = line.split(",").map(p => p.trim());
      line = parts[0];

      if (parts[1]) {
        const g = parts[1].toLowerCase();
        if (g === "male" || g === "female") {
          gender = g.charAt(0).toUpperCase() + g.slice(1);
        }
      }
    }

    // Extract parentheses content if present
    const parenMatch = line.match(/\(([^)]+)\)/);
    if (parenMatch) {
      const inside = parenMatch[1].toLowerCase();
      if (inside === "male" || inside === "female") {
        gender = inside.charAt(0).toUpperCase() + inside.slice(1);
      }
      line = line.replace(/\([^)]+\)/, "").trim();
    }

    // Normalize numbering (keep prefix)
    const match = line.match(/^(\d+\.?\s*)?(.*)$/);
    if (match) {
      const prefix = match[1] || "";
      const namePart = match[2].trim();
      line = prefix + namePart;
    }

    // Avoid duplicates (case-insensitive)
    if (!schedulerState.allPlayers.some(
      p => p.name.toLowerCase() === line.toLowerCase()
    )) {
      extractedNames.push({
        name: line,
        gender,
        active: true
      });
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


/* =========================
 
PLAYER MANAGEMENT
 
========================= */



function createPlayerCard(player, index) {
  // Base card class + gender
  let cardClass = `player-edit-card player-row ${player.gender.toLowerCase()}`;
  
  // Add 'inactive' class if player is not active
  if (!player.active) {
    cardClass += " inactive";
  }

  const card = document.createElement("div");
  card.className = cardClass;

  // Gender icon
  const genderIcon =
    player.gender === "Male" ? "👨‍💼" :
    player.gender === "Female" ? "🙎‍♀️" :
    "❔";

  card.innerHTML = `
    <div class="pec-col pec-active">
      <input type="checkbox"
        ${player.active ? "checked" : ""}
        onchange="toggleActive(${index}, this)">
    </div>
    <div class="pec-col pec-sl">${index + 1}</div>
    <div class="pec-col pec-gender">
      <span class="gender-icon ${player.gender.toLowerCase()}">${genderIcon}</span>
    </div> 

    <div class="pec-col pec-name">${player.name}</div>    

    <div class="pec-col pec-delete">
      <button class="pec-btn delete" onclick="deletePlayer(${index})">🗑</button>
    </div>
  `;

  return card;
}
/*
========================
   UPDATE PLAYER LIST TABLE
========================= */
function reportold1() {
  const table = document.getElementById('page3-table');
  table.innerHTML = `
    <tr>
      <th>No</th>
      <th>Name</th>
      <th>P/R</th>
    </tr>
  `;

  schedulerState.allPlayers.forEach((p, i) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <!-- No -->
      <td class="no-col" style="text-align:center; font-weight:bold;">
        ${i + 1}
      </td>

      <!-- Name (plain text) -->
      <td class="Player-cell">
        ${p.name}
      </td>

      <!-- Played / Rest circles -->
      <td class="stat-cell">
        <span class="played-count" id="played_${i}"></span>
        <span class="rest-count" id="rest_${i}"></span>
      </td>
    `;

    // 🔥 Update Played circle
    const playedElem = row.querySelector(`#played_${i}`);
    if (playedElem) {
      const playedValue = schedulerState.PlayedCount.get(p.name) || 0;
      playedElem.textContent = playedValue;
      playedElem.style.borderColor = getPlayedColor(playedValue);
    }

    // 🔥 Update Rest circle
    const restElem = row.querySelector(`#rest_${i}`);
    if (restElem) {
      const restValue = schedulerState.restCount.get(p.name) || 0;
      restElem.textContent = restValue;
      restElem.style.borderColor = getRestColor(restValue);
    }

    table.appendChild(row);
  });
}

function updatePlayerList() {
  const container = document.getElementById("playerList");
  container.innerHTML = "";

  schedulerState.allPlayers.forEach((player, index) => {
    const card = createPlayerCard(player, index);
    container.appendChild(card);
  });
}

function oldupdatePlayerList() {
  const table = document.getElementById('player-list-table');
  table.innerHTML = `
    <tr>
      <th>No</th>
      <th></th>
      <th>Name</th>
      <th>M/F</th>
      <th>Del</th>
    </tr>
  `;

  schedulerState.allPlayers.forEach((p, i) => {
    const row = document.createElement('tr');
    if (!p.active) row.classList.add('inactive');

    row.innerHTML = `
      <!-- No. -->
      <td class="no-col" style="text-align:center; font-weight:bold;">${i + 1}</td>

      <!-- Active checkbox -->
      <td style="text-align:center;">
        <input type="checkbox" ${p.active ? 'checked' : ''}
          onchange="editPlayer(${i}, 'active', this.checked)">
      </td>

      <!-- Name -->
      <td class="Player-cell">
        <input type="text" value="${p.name}"
          ${!p.active ? 'disabled' : ''}
          onchange="editPlayer(${i}, 'name', this.value)">
      </td>

      <!-- Gender -->
      <td class="gender-cell">
        <label class="gender-btn male">
          <input type="radio" name="gender-${i}" value="Male"
            ${p.gender === 'Male' ? 'checked' : ''}
            onchange="editPlayer(${i}, 'gender', 'Male')">
          <span>M</span>
        </label>
        <label class="gender-btn female">
          <input type="radio" name="gender-${i}" value="Female"
            ${p.gender === 'Female' ? 'checked' : ''}
            onchange="editPlayer(${i}, 'gender', 'Female')">
          <span>F</span>
        </label>
      </td>

      <!-- Delete button col -->
      <td style="text-align:center;">
        <button onclick="deletePlayer(${i})">🗑️</button>
      </td>
    `;  // <-- ⬅ HERE: properly closed backtick!

    table.appendChild(row);
  });
}



function getPlayedColor(value) {
  if (!value || value <= 0) return "#e0e0e0";

  const plays = Math.min(value, 20);
  const hue = (plays - 1) * 36; // 36° steps → 10 distinct, bold colors: 0°, 36°, 72°, ..., 684° → wraps cleanly

  return `hsl(${hue}, 92%, 58%)`;
}

function getRestColor(value) {
  if (!value || value <= 0) return "#e0e0e0";

  const rests = Math.min(value, 20);
  const hue = ((rests - 1) * 36 + 180) % 360; // +180° offset = perfect opposite color

  return `hsl(${hue}, 88%, 62%)`;
}




let selectedNoCell = null;

function enableTouchRowReorder() {
  const table = document.getElementById("player-list-table");
  Array.from(table.querySelectorAll(".no-col")).forEach(cell => {
    cell.addEventListener("click", onNumberTouch);
    cell.addEventListener("touchend", onNumberTouch);
  });
}

function onNumberTouch(e) {
  e.preventDefault();
  const cell = e.currentTarget;
  const sourceRow = selectedNoCell ? selectedNoCell.parentElement : null;
  const targetRow = cell.parentElement;

  // Select first row
  if (!sourceRow) {
    selectedNoCell = cell;
    cell.classList.add("selected-no");
    return;
  }

  // Unselect if same row
  if (sourceRow === targetRow) {
    selectedNoCell.classList.remove("selected-no");
    selectedNoCell = null;
    return;
  }

  const table = document.getElementById("player-list-table");

  // Move source row AFTER target row
  const nextSibling = targetRow.nextSibling;
  table.insertBefore(sourceRow, nextSibling);

  // Clear selection
  selectedNoCell.classList.remove("selected-no");
  selectedNoCell = null;

  // Update No. column
  updateNumbers();
  syncPlayersFromTable();
}


function updateNumbers() {
  const table = document.getElementById("player-list-table");
  Array.from(table.querySelectorAll(".no-col")).forEach((cell, idx) => {
    cell.textContent = idx + 1;
  });
}

function syncPlayersFromTable() {
  const table = document.getElementById('player-list-table');
  const rows = table.querySelectorAll('tr');

  const updated = [];

  rows.forEach((row, index) => {
    if (index === 0) return; // skip header

    const nameCell = row.querySelector('.player-name');
    const genderCell = row.querySelector('.player-gender');

    if (!nameCell || !genderCell) return;

    updated.push({
      name: nameCell.textContent.trim(),
      gender: genderCell.textContent.trim(),
      active: !row.classList.contains('inactive-row')
    });
  });

  // Update your global arrays
  schedulerState.allPlayers = updated;
  schedulerState.activeplayers = schedulerState.allPlayers
    .filter(p => p.active)
    .map(p => p.name)
    .reverse();

}


// Function to toggle all checkboxes
function toggleAllCheckboxes(masterCheckbox) {
  // Only run if the checkbox exists and event came from it
  if (!masterCheckbox || masterCheckbox.id !== 'select-all-checkbox') return;
  const checkboxes = document.querySelectorAll('#player-list-table td:first-child input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = masterCheckbox.checked);
}
/* =========================
   FIXED PAIRS MANAGEMENT
========================= */
function updateFixedPairSelectors() {
  const sel1 = document.getElementById('fixed-pair-1');
  const sel2 = document.getElementById('fixed-pair-2');
  const pairedPlayers = new Set(schedulerState.fixedPairs.flat());
  sel1.innerHTML = '<option value="" data-i18n="selectPlayer1"></option>';
  sel2.innerHTML = '<option value="" data-i18n="selectPlayer2"></option>';
  //sel2.innerHTML = '<option value="">-- Select Player 2 --</option>';
  // Only active players
  schedulerState.activeplayers.slice().reverse().forEach(p => {
    if (!pairedPlayers.has(p)) {
      const option1 = document.createElement('option');
      const option2 = document.createElement('option');
      option1.value = option2.value = p;
      option1.textContent = option2.textContent = p;
      sel1.appendChild(option1);
      sel2.appendChild(option2);
    }
  });
}

function modifyFixedPair(p1 = null, p2 = null) {
  // If called from delete button (icon), values passed.
  // If called from main button, read from selectors:
  if (!p1 || !p2) {
    p1 = document.getElementById('fixed-pair-1').value;
    p2 = document.getElementById('fixed-pair-2').value;
  }

  if (!p1 || !p2) {
    alert("Please select both players.");
    return;
  }

  if (p1 === p2) {
    alert("You cannot pair the same player with themselves.");
    return;
  }

  const pairKey = [p1, p2].sort().join('&');

  // Check if pair already exists
  const index = schedulerState.fixedPairs.findIndex(
    pair => pair.sort().join('&') === pairKey
  );

  // -------------------------
  // REMOVE if exists
  // -------------------------
  if (index !== -1) {
    schedulerState.fixedPairs.splice(index, 1);
    removeFixedCard(pairKey);
    updateFixedPairSelectors();
    return;
  }

  // -------------------------
  // ADD if does not exist
  // -------------------------
  schedulerState.fixedPairs.push([p1, p2]);
  addFixedCard(p1, p2, pairKey);
  updateFixedPairSelectors();
}

function addFixedCard(p1, p2, key) {
  const list = document.getElementById('fixed-pair-list');

  const card = document.createElement("div");
  card.className = "fixed-card";
  card.setAttribute("data-key", key);

  card.innerHTML = `
    
    <div class="fixed-name">${p1} & ${p2}</div>
    <div class="fixed-delete">
      <button class="pec-btn delete"
              onclick="modifyFixedPair('${p1}', '${p2}')">🗑</button>
    </div>
  `;

  list.appendChild(card);
}

function removeFixedCard(key) {
  const card = document.querySelector(`[data-key="${key}"]`);
  if (card) card.remove();
}

function addFixedPairold() {
  const p1 = document.getElementById('fixed-pair-1').value;
  const p2 = document.getElementById('fixed-pair-2').value;
  if (!p1 || !p2) {
    alert("Please select both players.");
    return;
  }
  if (p1 === p2) {
    alert("You cannot pair the same player with themselves.");
    return;
  }
  const pairKey = [p1, p2].sort().join('&');
  const alreadyExists = schedulerState.fixedPairs.some(pair => pair.sort().join('&') === pairKey);
  if (alreadyExists) {
    alert(`Fixed pair "${p1} & ${p2}" already exists.`);
    return;
  }
  schedulerState.fixedPairs.push([p1, p2]);
  const div = document.createElement('div');
  div.classList.add('fixed-pair-item');
  div.innerHTML = `
    ${p1} & ${p2}
    <span class="fixed-pair-remove" onclick="removeFixedPair(this, '${p1}', '${p2}')">
      Remove
    </span>
  `;
  document.getElementById('fixed-pair-list').appendChild(div);
  updateFixedPairSelectors();
}
function removeFixedPair(el, p1, p2) {
  schedulerState.fixedPairs = schedulerState.fixedPairs.filter(pair => !(pair[0] === p1 && pair[1] === p2));
  el.parentElement.remove();
  updateFixedPairSelectors();
}

/* =========================
 
PAGE NAVIGATION
 
========================= */


