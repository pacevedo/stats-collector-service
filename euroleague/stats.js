import axios  from 'axios';
import routes from './routes.js';
import * as utils from '../utils.js';


export const getAPIMatchStats = async (gamecode, competition, season) => {
  try {
    const url = routes.boxScore+'?gamecode='+gamecode+'&seasoncode='+competition+season
    return await axios.get(url)
  } catch (error) {
    console.error(error)
  }
}

const getPlayersStats = playersStats => {
  const players = []
  for (const playerStat of playersStats) {
    players.push(getStatLine(playerStat, true))
  }
  return players
}

const getStatLine = (stats, isPlayer) => {
  const statLine = {   
    pts: parseInt(stats.Points),
    fgm2: parseInt(stats.FieldGoalsMade2),
    fga2: parseInt(stats.FieldGoalsAttempted2),
    fgm3: parseInt(stats.FieldGoalsMade3),
    fga3: parseInt(stats.FieldGoalsAttempted3),
    ftm: parseInt(stats.FreeThrowsMade),
    fta: parseInt(stats.FreeThrowsAttempted),
    offrebs: parseInt(stats.OffensiveRebounds),
    defrebs: parseInt(stats.DefensiveRebounds),
    totrebs: parseInt(stats.TotalRebounds),
    assists: parseInt(stats.Assistances),
    steals: parseInt(stats.Steals),
    turnovers: parseInt(stats.Turnovers),
    blksFav: parseInt(stats.BlocksFavour),
    blksAga: parseInt(stats.BlocksAgainst),
    flsCom: parseInt(stats.FoulsCommited),
    flsRec: parseInt(stats.FoulsReceived),
    val: parseInt(stats.Valuation),
  }

  if (isPlayer) {
    statLine.code = utils.parsePlayerCode(stats.Player_ID.trim())
    statLine.start = stats.IsStarter
    try {
      statLine.secs =  utils.timeToSeconds(stats.Minutes)
    } catch (exception) {
      statLine.secs = 0
      console.error("Stats - "+exception+" | team: "+stats.Team+ " player: "+statLine.code)
    }
  }
    
  return statLine
}

export const getMatchStats = data => {
  const localStats = data.Stats[0]
  const visitorStats = data.Stats[1]
  const stats = {
    local: { 
      players: getPlayersStats(localStats.PlayersStats), 
      team: getStatLine(localStats.tmr, false), 
      total: getStatLine(localStats.totr, false) 
    }, 
    visitor: { 
      players: getPlayersStats(visitorStats.PlayersStats), 
      team: getStatLine(visitorStats.tmr, false),
      total: getStatLine(visitorStats.totr, false)
    }
  }
  return stats   
}

