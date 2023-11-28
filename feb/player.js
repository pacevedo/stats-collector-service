import axios  from 'axios';

import * as parseHTML from './parseHTML.js';
import routes from './routes.js';

import competitions from '../competitions.js';
import * as players from '../db/players.js';

const getHtmlPlayerData = async (playercode, codeteam) => {
  try {
    const route =  routes.player
    const url = routes.player+codeteam+'/'+playercode
    return await axios.get(url)
  } catch (error) {
    console.error(error)
  }
}

export const savePlayer = async (playercode, codeteam, season, namePlayer) => {
  const playerKey = "player_"+playercode+"_"+codeteam+"_"+season
  console.time(playerKey)
  let player = await players.getPlayer(playercode)
  const newSeason = {season: season, competition: competitions.LEBORO, team: codeteam}
  if (player === null) {
    const html = await getHtmlPlayerData(playercode, codeteam)
    if (html !== undefined) {
      player = parseHTML.getPlayerData(html.data)
      player.playercode = playercode
      if (player.name === undefined) {
        player.name = namePlayer
      }
      player.seasons = [newSeason]
      try {
        await players.insertOne(player)
      } catch (error) {
        console.error("Error inserting playercode: "+playercode+" in season "+season+" namePlayer: "+namePlayer+" team: "+codeteam+". Error: "+error)
      }
    }
  } else {
    const arrSeason = player.seasons.filter(item => (item.season === season && item.competition === competitions.LEBORO && item.team === codeteam))
    // if season is not inserted yet, update player including season
    if (arrSeason.length === 0) {
      const seasons = [...player.seasons, newSeason]
      const modified = await players.updateSeasons(playercode, seasons)
      if (!modified) {
        console.error("Season "+season+" competition: "+competitions.LEBORO+" team: "+codeteam+" not modified for playercode: "+playercode)
      }
    }
  }
  console.timeEnd(playerKey)
}