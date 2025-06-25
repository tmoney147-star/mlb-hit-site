const mockPlayers = [
    {
        id: 1,
        name: "Mike Trout",
        team: "LAA",
        homeAway: "home",
        stats: {
            avg: ".307",
            obp: ".418",
            slg: ".603",
            ops: "1.021",
            sb: "5",
            so: "45"
        },
        score: 12,
        parkFactor: 1.1
    },
    {
        id: 2,
        name: "Mookie Betts",
        team: "LAD",
        homeAway: "away",
        stats: {
            avg: ".292",
            obp: ".387",
            slg: ".547",
            ops: ".934",
            sb: "10",
            so: "55"
        },
        score: 10,
        parkFactor: 0.9
    },
    {
        id: 3,
        name: "Aaron Judge",
        team: "NYY",
        homeAway: "home",
        stats: {
            avg: ".285",
            obp: ".392",
            slg: ".600",
            ops: ".992",
            sb: "2",
            so: "100"
        },
        score: 9,
        parkFactor: 1.1
    },
    {
        id: 4,
        name: "Freddie Freeman",
        team: "LAD",
        homeAway: "home",
        stats: {
            avg: ".330",
            obp: ".410",
            slg: ".520",
            ops: ".930",
            sb: "3",
            so: "60"
        },
        score: 11,
        parkFactor: 1.1
    },
    {
        id: 5,
        name: "Ronald Acuña Jr.",
        team: "ATL",
        homeAway: "away",
        stats: {
            avg: ".310",
            obp: ".390",
            slg: ".540",
            ops: ".930",
            sb: "25",
            so: "70"
        },
        score: 13,
        parkFactor: 0.9
    }
];

const playersGrid = document.getElementById('players-grid');
const playersLoading = document.getElementById('players-loading');
const playersError = document.getElementById('players-error');
const bestBetsContent = document.getElementById('best-bets-content');
const teamFilter = document.getElementById('team-filter');
const minScoreFilter = document.getElementById('min-score');
const refreshBtn = document.getElementById('refresh-btn');

function init() {
    try {
        const players = mockPlayers;
        populateTeamFilter(players);
        renderPlayers(players);
        setTimeout(() => {
            playersLoading.style.display = 'none';
            playersGrid.style.display = 'grid';
        }, 1000);
    } catch (error) {
        showError("Failed to load player data. Please try again later.");
        console.error(error);
    }
}

function populateTeamFilter(players) {
    const teams = [...new Set(players.map(player => player.team))];
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        teamFilter.appendChild(option);
    });
}

function renderPlayers(players) {
    playersGrid.innerHTML = '';
    const filteredPlayers = players.filter(player => {
        const teamMatch = teamFilter.value === 'all' || player.team === teamFilter.value;
        const scoreMatch = player.score >= parseInt(minScoreFilter.value);
        return teamMatch && scoreMatch;
    });

    if (filteredPlayers.length === 0) {
        playersGrid.innerHTML = '<div class="player-card">No players match the selected filters</div>';
        return;
    }

    filteredPlayers.forEach(player => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.innerHTML = \`
            <div class="player-name">\${player.name}</div>
            <div class="player-team \${player.homeAway === 'home' ? 'home-team' : 'away-team'}">
                \${player.team} (\${player.homeAway === 'home' ? 'Home' : 'Away'})
            </div>
            <div class="player-score">Score: \${player.score}</div>
            <div class="player-stats">
                AVG: \${player.stats.avg} | OBP: \${player.stats.obp}<br>
                SLG: \${player.stats.slg} | OPS: \${player.stats.ops}<br>
                SB: \${player.stats.sb} | SO: \${player.stats.so}
            </div>
        \`;
        playersGrid.appendChild(card);
    });

    updateBestBets(players);
}

function updateBestBets(players) {
    const topPlayers = [...players].sort((a, b) => b.score - a.score).slice(0, 5);
    bestBetsContent.innerHTML = '';
    topPlayers.forEach(player => {
        const betItem = document.createElement('div');
        betItem.className = 'best-bet-item';
        betItem.style.marginBottom = '10px';
        betItem.style.padding = '10px';
        betItem.style.backgroundColor = '#fff';
        betItem.style.borderRadius = '5px';
        betItem.innerHTML = \`
            <strong>\${player.name}</strong> - \${player.team} (\${player.homeAway === 'home' ? 'Home' : 'Away'})
            <div style="color: #2980b9; font-weight: bold; margin-top: 5px;">Score: \${player.score}</div>
        \`;
        bestBetsContent.appendChild(betItem);
    });
}

function showError(message) {
    playersLoading.style.display = 'none';
    playersError.textContent = message;
    playersError.style.display = 'block';
}

teamFilter.addEventListener('change', () => renderPlayers(mockPlayers));
minScoreFilter.addEventListener('change', () => renderPlayers(mockPlayers));
refreshBtn.addEventListener('click', init);

init();
