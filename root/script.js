function renderPlayers(players) {
    playersGrid.innerHTML = '';
    const filteredPlayers = players.filter(player => {
        const teamMatch = teamFilter.value === 'all' || player.team === teamFilter.value;
        const scoreMatch = player.score >= parseInt(minScoreFilter.value) || isNaN(parseInt(minScoreFilter.value));
        return teamMatch && scoreMatch;
    });

    if (filteredPlayers.length === 0) {
        playersGrid.innerHTML = '<div class="player-card">No players match the selected filters</div>';
        return;
    }

    filteredPlayers.forEach(player => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.innerHTML = `
            <div class="player-name">${player.name}</div>
            <div class="player-team ${player.homeAway === 'home' ? 'home-team' : 'away-team'}">
                ${player.team} (${player.homeAway === 'home' ? 'Home' : 'Away'})
            </div>
            <div class="player-score">Score: ${player.score}</div>
            <div class="player-stats">
                AVG: ${player.stats.avg} | OBP: ${player.stats.obp}<br>
                SLG: ${player.stats.slg} | OPS: ${player.stats.ops}<br>
                SB: ${player.stats.sb} | SO: ${player.stats.so}
            </div>
        `;
        playersGrid.appendChild(card);
    });

    updateBestBets(players);
}
