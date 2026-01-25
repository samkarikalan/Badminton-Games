const AUTO_SAVE = () => saveAppState();

window.onerror = function (msg, src, line, col, err) {
  localStorage.setItem("CLUB_SCHEDULER_LAST_ERROR", JSON.stringify({
    msg, src, line, col,
    stack: err?.stack || null,
    time: new Date().toISOString()
  }));
  saveAppState();
};

document.addEventListener("DOMContentLoaded", () => {
  if (restoreAppState()) {
    updateCourtDisplay();
    showRound(currentRoundIndex);
    if (isOnPage2) showPage('page2');
  }
});

function serializeMap(map) {
  return Array.from(map.entries());
}

function deserializeMap(arr) {
  return new Map(arr);
}

function serializeSet(set) {
  return Array.from(set.values());
}

function deserializeSet(arr) {
  return new Set(arr);
}

function saveAppState() {
  try {
    const snapshot = {
      // primitives
      courts,
      currentRoundIndex,
      isOnPage2,
      resetRest,

      // arrays
      allRounds,
      lastRound,

      // schedulerState (sanitized)
      schedulerState: {
        numCourts: schedulerState.numCourts,
        allPlayers: schedulerState.allPlayers,
        activeplayers: schedulerState.activeplayers,
        fixedPairs: schedulerState.fixedPairs,
        roundIndex: schedulerState.roundIndex,
        markingWinnerMode: schedulerState.markingWinnerMode,

        PlayedCount: serializeMap(schedulerState.PlayedCount),
        restCount: serializeMap(schedulerState.restCount),
        PlayerScoreMap: serializeMap(schedulerState.PlayerScoreMap),
        playedTogether: serializeMap(schedulerState.playedTogether),
        fixedMap: serializeMap(schedulerState.fixedMap),
        opponentMap: serializeMap(
          Array.from(schedulerState.opponentMap.entries()).map(
            ([k, v]) => [k, serializeMap(v)]
          )
        ),

        restQueue: schedulerState.restQueue,
        pairPlayedSet: serializeSet(schedulerState.pairPlayedSet),
        gamesMap: serializeSet(schedulerState.gamesMap),
      }
    };

    localStorage.setItem("CLUB_SCHEDULER_STATE", JSON.stringify(snapshot));
  } catch (e) {
    console.error("State save failed", e);
  }
}


function restoreAppState() {
  const raw = localStorage.getItem("CLUB_SCHEDULER_STATE");
  if (!raw) return false;

  try {
    const data = JSON.parse(raw);

    courts = data.courts;
    currentRoundIndex = data.currentRoundIndex;
    isOnPage2 = data.isOnPage2;
    resetRest = data.resetRest;

    allRounds = data.allRounds || [];
    lastRound = data.lastRound || [];

    const s = data.schedulerState;
    if (s) {
      schedulerState.numCourts = s.numCourts;
      schedulerState.allPlayers = s.allPlayers || [];
      schedulerState.activeplayers = s.activeplayers || [];
      schedulerState.fixedPairs = s.fixedPairs || [];
      schedulerState.roundIndex = s.roundIndex || 0;
      schedulerState.markingWinnerMode = s.markingWinnerMode || false;

      schedulerState.PlayedCount = deserializeMap(s.PlayedCount || []);
      schedulerState.restCount = deserializeMap(s.restCount || []);
      schedulerState.PlayerScoreMap = deserializeMap(s.PlayerScoreMap || []);
      schedulerState.playedTogether = deserializeMap(s.playedTogether || []);
      schedulerState.fixedMap = deserializeMap(s.fixedMap || []);
      schedulerState.pairPlayedSet = deserializeSet(s.pairPlayedSet || []);
      schedulerState.gamesMap = deserializeSet(s.gamesMap || []);
      schedulerState.restQueue = s.restQueue || [];

      schedulerState.opponentMap = new Map(
        (s.opponentMap || []).map(
          ([k, v]) => [k, deserializeMap(v)]
        )
      );
    }

    return true;
  } catch (e) {
    console.error("State restore failed", e);
    return false;
  }
}



