function renderExportRounds() {
  const exportRoot = document.getElementById('export');
  exportRoot.innerHTML = '';

  allRounds.forEach((data) => {

    /* ───────── Round Container ───────── */
    const roundDiv = document.createElement('div');
    roundDiv.className = 'export-round';

    /* ───────── Round Title ───────── */
    const title = document.createElement('div');
    title.className = 'export-round-title';
    title.textContent = data.round; // existing variable
    roundDiv.appendChild(title);

    /* ───────── Matches ───────── */
    data.games.forEach(game => {
      const match = document.createElement('div');
      match.className = 'export-match';

      const leftTeam = document.createElement('div');
      leftTeam.className = 'export-team';
      leftTeam.innerHTML = game.pair1.join('<br>');

      const vs = document.createElement('div');
      vs.className = 'export-vs';
      vs.textContent = 'VS';

      const rightTeam = document.createElement('div');
      rightTeam.className = 'export-team';
      rightTeam.innerHTML = game.pair2.join('<br>');

      match.append(leftTeam, vs, rightTeam);
      roundDiv.appendChild(match);
    });

    /* ───────── Sitting Out Section ───────── */
    const restTitle = document.createElement('div');
    restTitle.className = 'export-rest-title';
    restTitle.textContent = t('sittingOut'); // ✅ translated
    roundDiv.appendChild(restTitle);

    const restBox = document.createElement('div');
    restBox.className = 'export-rest-box';

    if (!data.resting || data.resting.length === 0) {
      restBox.textContent = t('none'); // ✅ translated
    } else {
      restBox.innerHTML = data.resting.join(', ');
    }

    roundDiv.appendChild(restBox);

    exportRoot.appendChild(roundDiv);
  });
}
