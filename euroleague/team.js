import * as matches from '../db/matches.js';
import * as players from '../db/players.js';
import * as viewPlayersTeam from '../db/viewPlayersTeam.js';

export const getPendingTeams = async (season, competition) => {
  const teamsArray = await viewPlayersTeam.getTeamsBySeason(season, competition)
  const pendingTeams = []
  for (const team of teamsArray) {
    const codeteam = team._id.split("_")[0]
    const playersSaved = await players.getCodePlayersBySeasonCompetitionTeam(codeteam, competition, season)
    if (!areAllPlayersSaved(playersSaved, team.value)){
      const nameTeam = await matches.getNameTeamByCodeTeam(codeteam, season)
      if (nameTeam !== null) {
        const pendingTeam = {name: nameTeam, codeteam: codeteam}
        pendingTeams.push(pendingTeam)
      } else {
        console.error("Team not found: "+codeteam+ " season "+season)
      }
    }
  }
  return pendingTeams
}

export const areAllPlayersSaved = (playersSaved, playersTeam) => {
  for (const player of playersTeam) {
    if (!playersSaved.includes(player)) {
      return false
    }
  }
  return true
}