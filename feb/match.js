

import competitions from '../competitions.js';
import * as febPlayer from './player.js';
import * as api from './api.js';
import * as pbp from './playByPlay.js';
import * as shotChart from './shots.js';
import * as utils from '../utils.js';

import * as matches from '../db/matches.js';

export const processMatchData = async (gamecode, roundNumber, competition, season) => {
    const nameCompetition = competitions.getByAbr(competition)
    const matchDB = await matches.getMatch(gamecode, nameCompetition, season)
    if (matchDB === null) {
        const response = await api.getAPIBoxscore(gamecode)
        if (response !== undefined) {
          const data = response.data
          const match = getBasicMatchData(data, gamecode, season, roundNumber, nameCompetition)
          match.local = getBoxScore(data, season, true)
          match.visitor = getBoxScore(data, season, false)
          match.pbp = await pbp.getPlayByPlay(gamecode)
          match.shotChart = await shotChart.getShotChart(gamecode)
          matches.insertOne(match)
        }
    }
}

const getBasicMatchData = (data, gamecode, season, roundNumber, nameCompetition) => {
  const header = data["HEADER"]
  return {
    gamecode: gamecode,
    competition: nameCompetition,
    season: season,
    date: utils.parseDate(header.starttime),
    round: roundNumber,
    phase: header.round.trim(),
    stadium: header.field
  }
}

const getBoxScore = (data, season, isLocal) => {
  const teams = data["BOXSCORE"]["TEAM"]
  const team = isLocal ? teams[0]:teams[1]
  const dataTeam = team["TOTAL"]
  return {
    name: dataTeam.name,
    code: dataTeam.clubCode,
    idTeam: dataTeam.id,
    points: dataTeam.pts,
    byQuarters: getByQuarters(data, isLocal),
    stats: getStats(team, season)
  }
}

const getByQuarters = (data, isLocal) => {
  const byQuarters = data["HEADER"]["QUARTERS"]["QUARTER"]
  let arrQuarters = []
  byQuarters.forEach(quarter => {
    if (isLocal) {
      arrQuarters.push(quarter.scoreA)
    } else {
      arrQuarters.push(quarter.scoreB)
    }
  })
  return arrQuarters
}

const getStats = (team, season) => {
  const playersStats = team["PLAYER"]
  const totalStats = team["TOTAL"]
  const teamStats = team["TEAMACTIONS"]
  let arrPlayers = []
  playersStats.forEach(player => {
    arrPlayers.push(convertEntity(player, true))
    febPlayer.savePlayer(player.id, teamStats.id, season, player.name)
  })

  return {
    players: arrPlayers,
    team: convertEntity(teamStats,false),
    total: convertEntity(totalStats, false)
  }
}

const convertEntity = (entity, isPlayer) => {
  let returnObj = {
    pts: entity.pts,
    fgm2: entity.p2m,
    fga2: entity.p2a,
    fgm3: entity.p3m,
    fga3: entity.p3a,
    ftm: entity.p1m,
    fta: entity.p1a,
    offrebs: entity.ro,
    defrebs: entity.rd,
    totrebs: entity.rt,
    assists: entity.assist,
    steals: entity.st,
    turnovers: entity.to,
    blkFav: entity.bs,
    blkAga: entity.tc,
    flsCom: entity.pf,
    flsRec: entity.rf,
    val: entity.val
  }
  if (isPlayer) {
    returnObj.code = entity.id,
    returnObj.start = entity.inn,
    returnObj.secs = entity.min
    returnObj.pllss = entity.pllss 
  }
  return returnObj
}

