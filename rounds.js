
let allRounds = [];
let currentRoundIndex = 0;
let isOnPage2 = false;
let resetRest = false;

let schedulerState = {
    numCourts: 0,
    allPlayers: [],
    activeplayers: [],
    fixedPairs: [],
    PlayedCount: new Map(),
    restCount: new Map(),
    restQueue: new Map(),
    PlayerScoreMap: new Map(),
    playedTogether: new Map(),
    fixedMap: new Map(),
    roundIndex: 0,
    pairPlayedSet: new Set(),
    opponentMap: new Map(), // 🆕 per-player opponent tracking
	markingWinnerMode: false,
};



let courts = 1;

function updateCourtDisplay() {
  document.getElementById("num-courts").textContent = courts;
  updateCourtButtons(); // update both + and -
  goToRounds(); // auto trigger

  const totalPlayers = activeplayers.length;
  const numPlayersPerRound = courts * 4;
  const numResting = Math.max(totalPlayers - numPlayersPerRound, 0);

  if (numResting >= numPlayersPerRound) {
    resetRest = true;
  } else {
    resetRest = false;
  }
	
}

// PLUS button
document.getElementById("courtPlus").onclick = () => {
  const totalPlayers = schedulerState.activeplayers.length;
  const allowedCourts = Math.floor(totalPlayers / 4);

  if (courts < allowedCourts) {
    courts++;
    updateCourtDisplay();
  }
};

// MINUS button
document.getElementById("courtMinus").onclick = () => {
  if (courts > 1) {
    courts--;
    updateCourtDisplay();
  }
};

// Enable / disable buttons
function updateCourtButtons() {
  const totalPlayers = schedulerState.activeplayers.length;
  const allowedCourts = Math.floor(totalPlayers / 4);

  const plusBtn = document.getElementById("courtPlus");
  const minusBtn = document.getElementById("courtMinus");

  // PLUS disable logic
  if (courts >= allowedCourts) {
    plusBtn.disabled = true;
    plusBtn.classList.add("disabled-btn");
  } else {
    plusBtn.disabled = false;
    plusBtn.classList.remove("disabled-btn");
  }

  // MINUS disable logic
  if (courts <= 1) {
    minusBtn.disabled = true;
    minusBtn.classList.add("disabled-btn");
  } else {
    minusBtn.disabled = false;
    minusBtn.classList.remove("disabled-btn");
  }
}


function goToRounds() {
  const numCourtsInput = parseInt(document.getElementById("num-courts").textContent);
  //const numCourtsInput = parseInt(document.getElementById('num-courts').value);
  const totalPlayers = schedulerState.activeplayers.length;
  if (!totalPlayers) {
    alert('Please add players first!');
    return;
  }

  if (!numCourtsInput) {
    alert('Please enter no of Courts!');
    return;
  }  
  // Auto-calculate courts based on player count ÷ 4
  let autoCourts = Math.floor(totalPlayers / 4);
  if (autoCourts < 1) autoCourts = 1;
  // Use the smaller of user-input or calculated courts
  const numCourts = numCourtsInput
    ? Math.min(numCourtsInput, autoCourts)
    : autoCourts;
  if (!numCourts) {
    alert('Number of courts could not be determined!');
    return;
  }
  if (allRounds.length <= 1) {
    initScheduler(numCourts);
    allRounds = [AischedulerNextRound(schedulerState)];
    currentRoundIndex = 0;
    showRound(0);
  } else {   
      schedulerState.numCourts = numCourts;      
      schedulerState.fixedMap = new Map();
      let highestRestCount = -Infinity;
      updateScheduler();      
      schedulerState.roundIndex = allRounds.length - 1;
      currentRoundIndex = schedulerState.roundIndex;
      const newRound = AischedulerNextRound(schedulerState);
      allRounds[allRounds.length - 1] = newRound;
       showRound(currentRoundIndex);
    }  
  /*
  document.getElementById('page1').style.display = 'none';
  document.getElementById('page2').style.display = 'block';
  isOnPage2 = true;
  */
}

function goBack() {
  updatePlayerList();
  document.getElementById('page1').style.display = 'block';
  document.getElementById('page2').style.display = 'none';
  isOnPage2 = false;
  const btn = document.getElementById('goToRoundsBtn');
  btn.disabled = false;
}

function nextRound() {
  if (currentRoundIndex + 1 < allRounds.length) {
    currentRoundIndex++;
    showRound(currentRoundIndex);
  } else {
    updSchedule(allRounds.length - 1, schedulerState); // pass schedulerState
    const newRound = AischedulerNextRound(schedulerState); // do NOT wrap in []
    allRounds.push(newRound);
    currentRoundIndex = allRounds.length - 1;
    showRound(currentRoundIndex);
  }
}
function prevRound() {
  if (currentRoundIndex > 0) {
    currentRoundIndex--;
    showRound(currentRoundIndex);
  }
}

function initScheduler(numCourts) {
  schedulerState.numCourts = numCourts;  
  schedulerState.restCount = new Map(schedulerState.activeplayers.map(p => [p, 0]));
 //schedulerState.restQueue = new Map(schedulerState.activeplayers.map(p => [p, 0]));
    
  schedulerState.PlayedCount = new Map(schedulerState.activeplayers.map(p => [p, 0]));
  schedulerState.PlayerScoreMap = new Map(schedulerState.activeplayers.map(p => [p, 0]));
  schedulerState.playedTogether = new Map();
  schedulerState.fixedMap = new Map();
  schedulerState.pairPlayedSet = new Set();
  schedulerState.roundIndex = 0;
  // 🆕 Initialize opponentMap — nested map for opponent counts
  schedulerState.opponentMap = new Map();
  for (const p1 of schedulerState.activeplayers) {
    const innerMap = new Map();
    for (const p2 of schedulerState.activeplayers) {
      if (p1 !== p2) innerMap.set(p2, 0); // start all counts at 0
    }
    schedulerState.opponentMap.set(p1, innerMap);
  }
  // Map each fixed pair for quick lookup
  schedulerState.fixedPairs.forEach(([a, b]) => {
    schedulerState.fixedMap.set(a, b);
    schedulerState.fixedMap.set(b, a);
  });
    schedulerState.restQueue = createRestQueue();
    
}
function updateScheduler() {
   schedulerState.opponentMap = new Map();
  for (const p1 of schedulerState.activeplayers) {
    const innerMap = new Map();
    for (const p2 of schedulerState.activeplayers) {
      if (p1 !== p2) innerMap.set(p2, 0); // start all counts at 0
    }
    schedulerState.opponentMap.set(p1, innerMap);
  }
    schedulerState.restQueue = rebuildRestQueue(
    schedulerState.restQueue );  // initial queue
    
}

/* ================================
   🔁 1-3-2-4 QUEUE REORDER (GUARDED)
================================ */

function reorder1324(queue) {
  const total = queue.length;
  const quarter = Math.floor(total / 4);

  const q1 = queue.slice(0, quarter);
  const q2 = queue.slice(quarter, quarter * 2);
  const q3 = queue.slice(quarter * 2, quarter * 3);
  const q4 = queue.slice(quarter * 3);

  return [...q1, ...q3, ...q2, ...q4];
}

// 🔍 check if ALL pairs exhausted
function allPairsExhausted(queue, pairPlayedSet) {
  for (let i = 0; i < queue.length; i++) {
    for (let j = i + 1; j < queue.length; j++) {
      const key = [queue[i], queue[j]].sort().join("&");
      if (!pairPlayedSet.has(key)) return false;
    }
  }
  return true;
}



function updSchedule(roundIndex, schedulerState) {
  const data = allRounds[roundIndex];
  if (!data) return;

  const { games, resting } = data;
  const {
    restCount,
    PlayedCount,
    PlayerScoreMap,
    opponentMap,
    pairPlayedSet,
    playedTogether, // <<-- Missing in your version
  } = schedulerState;

  // 1️⃣ Update rest count
  for (const p of resting) {
    const playerName = p.split('#')[0];
    restCount.set(playerName, (restCount.get(playerName) || 0) + 1);
  }
   
// Helper → base name
const base = p => p.split('#')[0];

// 1️⃣ COPY restQueue first (so we don't modify during loop)
let newQueue = schedulerState.restQueue.slice();

// 2️⃣ FULL REMOVE: strip any players whose base name matches resting
for (const r of resting) {
  const b = base(r);
  newQueue = newQueue.filter(q => base(q) !== b);
}

// Replace restQueue after ALL removals done
schedulerState.restQueue = newQueue;

// 3️⃣ FULL ADD: now add base names of ALL resting at once
for (const r of resting) {
  schedulerState.restQueue.push(base(r));
}    

  // 2️⃣ Update PlayedCount
  for (const game of games) {
    const allPlayers = [...game.pair1, ...game.pair2];
    for (const p of allPlayers) {
      PlayedCount.set(p, (PlayedCount.get(p) || 0) + 1);
    }
  }

  // 3️⃣ Update opponentMap & PlayerScoreMap
  for (const game of games) {
    const { pair1, pair2 } = game;

    // Ensure maps exist (prevents null errors)
    for (const a of [...pair1, ...pair2]) {
      if (!opponentMap.has(a)) opponentMap.set(a, new Map());
    }

    // Opponent tracking
    for (const a of pair1) {
      for (const b of pair2) {
        opponentMap.get(a).set(b, (opponentMap.get(a).get(b) || 0) + 1);
        opponentMap.get(b).set(a, (opponentMap.get(b).get(a) || 0) + 1);
      }
    }

    // Score calculation (new opponents bonus)
    for (const group of [pair1, pair2]) {
      for (const player of group) {
        let newOpponents = 0;
        const rivals = group === pair1 ? pair2 : pair1;

        for (const r of rivals) {
          if (opponentMap.get(player).get(r) === 1) newOpponents++;
        }

        const score = newOpponents === 2 ? 2 : newOpponents === 1 ? 1 : 0;
        PlayerScoreMap.set(player, (PlayerScoreMap.get(player) || 0) + score);
      }
    }
  }

  // 4️⃣ Track pairs played together (with round info)
  for (const game of games) {
    for (const pr of [game.pair1, game.pair2]) {
      const key = pr.slice().sort().join("&");
      pairPlayedSet.add(key);
      playedTogether.set(key, roundIndex); // <<-- IMPORTANT FIX
    }
  }

	// ✅ EXECUTE ONLY WHEN BOTH CONDITIONS ARE TRUE
if ( resetRest === true &&
  allPairsExhausted(schedulerState.restQueue, pairPlayedSet)
) {
  schedulerState.restQueue = reorder1324(schedulerState.restQueue);

  // optional: prevent repeated execution
  schedulerState.resetRest = false;
}
}

function createRestQueue() {
  // Simply return active players in their current order
  return [...schedulerState.activeplayers];
}

function rebuildRestQueue(restQueue) {
  const newQueue = [];
  const active = schedulerState.activeplayers;

  // 1. Add active players based on the order in old restQueue
  for (const p of restQueue) {
    if (active.includes(p)) {
      newQueue.push(p);
    }
  }

  // 2. Add any newly active players not found in old restQueue
  for (const p of active) {
    if (!newQueue.includes(p)) {
      newQueue.push(p);
    }
  }

  return newQueue;
}




  

function RefreshRound() {
    schedulerState.roundIndex = allRounds.length - 1;
    currentRoundIndex = schedulerState.roundIndex;
    const newRound = AischedulerNextRound(schedulerState);
    allRounds[allRounds.length - 1] = newRound;
    showRound(currentRoundIndex);
}
function report() {
  const container = document.getElementById("reportContainer");
  container.innerHTML = ""; // Clear old cards

  // ⭐ Add title header row
  const header = document.createElement("div");
  header.className = "report-header";
  header.innerHTML = `
    <div class="header-rank" data-i18n="rank">Rank</div>
    <div class="header-name" data-i18n="name">Name</div>
    <div class="header-played" data-i18n="played">Played</div>
    <div class="header-rested" data-i18n="rested">Rested</div>
  `;
  container.appendChild(header);

  // Sort & add players
  const sortedPlayers = [...schedulerState.allPlayers].sort((a, b) => {
    const playedA = schedulerState.PlayedCount.get(a.name) || 0;
    const playedB = schedulerState.PlayedCount.get(b.name) || 0;
    return playedB - playedA;
  });

  sortedPlayers.forEach((p, index) => {
    const played = schedulerState.PlayedCount.get(p.name) || 0;
    const rest = schedulerState.restCount.get(p.name) || 0;

    const card = document.createElement("div");
    card.className = "player-card";
    card.innerHTML = `
      <div class="rank">#${index + 1}</div>
      <div class="name">${p.name.replace(/^\d+\.?\s*/, "")}</div>
      <div class="stat played" style="border-color:${getPlayedColor(played)}">${played}</div>
      <div class="stat rest" style="border-color:${getRestColor(rest)}">${rest}</div>
    `;
    container.appendChild(card);
  });

  // ⭐ Important: Apply translation to new elements
  setLanguage(currentLang);
}








 
