import axios  from 'axios';

import * as players from '../db/players.js';
import * as viewPlayersTeam from '../db/viewPlayersTeam.js';
import * as parseHTML from './parseHTML.js';

import competitions from '../competitions.js';
import routes from './routes.js';

export const savePlayers = async (codeteam, competitionAbr, season) => {
  const teamPlayers = await viewPlayersTeam.getCodePlayersByTeam(codeteam, competitions.getByAbr(competitionAbr), season)
  for (const playercode of teamPlayers) {
    savePlayer(playercode, codeteam, competitionAbr, season)
  }
  return JSON.stringify(teamPlayers)
}

export const setViewPlayersTeam = async () => {
  return await viewPlayersTeam.setViewPlayersTeam()
}

const getHtmlPlayerData = async (playercode, competition, season) => {
  try {
    const route = competitions.getByAbr(competition) === competitions.EUROLEAGUE ? routes.player.el : routes.player.ec
    const url = route+'?pcode='+playercode+'&seasoncode='+competition+season
    return await axios.get(url, {withCredentials: true})
  } catch (error) {
    console.error(error)
  }
}

export const savePlayer = async (playercode, codeteam, competitionAbr, season) => {
  const playerKey = "player_"+playercode+"_"+codeteam+"_"+competitionAbr+season
  console.time(playerKey)
  let player = await players.getPlayer(playercode)
  const newSeason = {season: season, competition: competitions.getByAbr(competitionAbr), team: codeteam}
  if (player === null) {
    const html = await getHtmlPlayerData(playercode, competitionAbr, season)
    player = parseHTML.getPlayerData(html.data)
    player.playercode = playercode
    player.seasons = [newSeason] 
    try {
      await players.insertOne(player)
    } catch (error) {
      console.error("Error inserting playercode: "+playercode+" in season "+season+" competition: "+competitionAbr+" team: "+codeteam+". Error: "+error)
    }
  } else {
    const arrSeason = player.seasons.filter(item => (item.season === season && item.competition === competitions.getByAbr(competitionAbr) && item.team === codeteam))
    // if season is not inserted yet, update player including season
    if (arrSeason.length === 0) {
      const seasons = [...player.seasons, newSeason]
      const modified = await players.updateSeasons(playercode, seasons)
      if (!modified) {
        console.error("Season "+season+" competition: "+competitionAbr+" team: "+codeteam+" not modified for playercode: "+playercode)
      }
    }
  }
  console.timeEnd(playerKey)
}