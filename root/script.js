// script.js (uses real MLB Stats API - limited by CORS in browser)
document.addEventListener("DOMContentLoaded", async () => {
  const playersGrid = document.getElementById("players-grid");
  const playersLoading = document.getElementById("players-loading");
  const bestBetsContent = document.getElementById("best-bets-content");
  const errorDisplay = document.getElementById("players-error");

  async function fetchTodayGameTeamIDs() {
    const today = new Date().toISOString().split("T")[0];
    const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${today}`;
    const res = await fetch(url);
    const data = await res.json();
    const teams = new Set();
    data.dates.forEach(d => {
      d.games.forEach(g => {
        teams.add(g.teams.away.team.id);
        teams.add(g.teams.home.team.id);
      });
    });
    return Array.from(teams);
  }

  async function fetchRoster(teamId) {
    const res = await fetch(`https://statsapi.mlb.com/api/v1/teams/${teamId}/roster`);
    const data = await res.json();
    return data.roster.map(p => p.person);
  }

  async function fetchPlayerStats(personId) {
    const res = await fetch(`https://statsapi.mlb.com/api/v1/people/${personId}/stats?stats=season`);
    const data = await res.json();
    return data.stats?.[0]?.splits?.[0]?.stat || null;
  }

  function calculateScore(stat) {
    let score = 0;
    const avg = parseFloat(stat.avg || 0);
    const obp = parseFloat(stat.obp || 0);
    const slg = parseFloat(stat.slg || 0);
    const ops = parseFloat(stat.ops || 0);
    const sb = parseInt(stat.stolenBases || 0);
    const so = parseInt(stat.strikeOuts || 999);

    if (avg > 0.3) score += 4;
    else if (avg > 0.27) score += 3;
    else if (avg > 0.25) score += 2;
    if (obp > 0.35) score += 2;
    if (slg > 0.45) score += 2;
    if (ops > 0.8) score += 2;
    if (sb > 5) score += 1;
    if (so < 50) score += 2;

    return score;
  }

  try {
    const teamIds = await fetchTodayGameTeamIDs();
    const allPlayers = [];
    for (const id of teamIds) {
      const roster = await fetchRoster(id);
      for (const p of roster) {
        const stat = await fetchPlayerStats(p.id);
        if (stat) {
          const score = calculateScore(stat);
          allPlayers.push({
            name: p.fullName,
            team: id,
            stats: stat,
            score,
            homeAway: "home" // Placeholder, can enhance with more data
          });
        }
      }
    }

    allPlayers.sort((a, b) => b.score - a.score);
    bestBetsContent.innerHTML = allPlayers.slice(0, 5).map(p => \`
      <div style="margin-bottom: 10px; padding: 10px; background: white; border-radius: 5px;">
        <strong>\${p.name}</strong> - Team \${p.team}
        <div style="color: #2980b9; font-weight: bold;">Score: \${p.score}</div>
      </div>
    \`).join("");

    playersGrid.innerHTML = allPlayers.map(p => \`
      <div class="player-card">
        <div class="player-name">\${p.name}</div>
        <div class="player-team">\${p.team} (\${p.homeAway})</div>
        <div class="player-score">Score: \${p.score}</div>
        <div class="player-stats">
          AVG: \${p.stats.avg} | OBP: \${p.stats.obp}<br>
          SLG: \${p.stats.slg} | OPS: \${p.stats.ops}<br>
          SB: \${p.stats.stolenBases} | SO: \${p.stats.strikeOuts}
        </div>
      </div>
    \`).join("");

    playersLoading.style.display = "none";
    playersGrid.style.display = "grid";

  } catch (err) {
    console.error(err);
    errorDisplay.textContent = "Failed to fetch or process live data.";
    errorDisplay.style.display = "block";
    playersLoading.style.display = "none";
  }
});
