import axios  from 'axios';

import competitions from '../competitions.js';
import routes from './routes.js';

import * as matches from '../db/matches.js';
import * as parseHTML from './parseHTML.js';
import * as playByPlay from './playByPlay.js';
import * as shots from './shots.js';
import * as stats from './stats.js';
import * as utils from '../utils.js';

const getAPIMatchData = async (gamecode, competition, season) => {
  try {
      const url = routes.header+'?gamecode='+gamecode+'&seasoncode='+competition+season
      return await axios.get(url)
  } catch (error) {
      console.error(error)
  }
}

const getHtmlMatchData = async (gamecode, competition, season) => {
  try {
    const route = competitions.getByAbr(competition) === competitions.EUROLEAGUE ? routes.match.el : routes.match.ec
    const url = route+'?gamecode='+gamecode+'&seasoncode='+competition+season
    return await axios.get(url)
  } catch (error) {
    console.error(error)
  }
}

export const processMatchData = async (gamecode, competition, season) => {
  const matchKey = "match_"+gamecode+"_"+competition+season
  console.time(matchKey)
  let match = {}
  const nameCompetition = competitions.getByAbr(competition)
  const matchDB = await matches.getMatch(gamecode, nameCompetition, season)
  if (matchDB === null) {
    const response = await getAPIMatchData(gamecode, competition, season)
    const data = response.data
    const html = await getHtmlMatchData(gamecode, competition, season)
    if (html !== undefined) {
      const byQuarters = parseHTML.getMatchDataByQuarters(html.data)
      if (data !== '') {
        match = {
          gamecode: gamecode,
          competition: nameCompetition,
          season: season,
          date: utils.parseDate(data.Date, data.Hour),
          round: data.Round,
          phase: data.Phase.trim(),
          stadium: data.Stadium.trim(),
          local: { name: data.TeamA, code: data.CodeTeamA, points: parseInt(data.ScoreA), byQuarters: byQuarters.local},
          visitor: { name: data.TeamB, code: data.CodeTeamB, points: parseInt(data.ScoreB), byQuarters: byQuarters.visitor},
        }
        await setBoxScore(match, gamecode, competition, season)
      } else {
        match = parseHTML.getMatchData(html.data, gamecode, nameCompetition, season, byQuarters)
      }
    } else {
      console.error(matchKey+" NOT OBTAINED")
    }
    await setPlayByPlay(match, gamecode, competition, season)
    await setShotChart(match, gamecode, competition, season)
    matches.insertOne(match)
  } else {
    console.log (matchKey+" already in DB")
  }
  console.timeEnd(matchKey)
  return "OK"
}

const setBoxScore = async (match, gamecode, competition, season) => {
  const response = await stats.getAPIMatchStats(gamecode, competition, season)
    if (response.data !== '') {
      const matchStats = stats.getMatchStats(response.data)
      match.local.stats = matchStats.local
      match.visitor.stats = matchStats.visitor
    }
}

const setPlayByPlay = async (match, gamecode, competition, season) => {
  const response = await playByPlay.getAPIPlayByPlay(gamecode, competition, season)
  if (response.data != '') {
    match.pbp = playByPlay.getPlayByPlay(response.data)
  }
}

const setShotChart = async (match, gamecode, competition, season) => {
  const response = await shots.getAPIShots(gamecode, competition, season)
  if (response.data != '') {
    match.shotChart = shots.getShotChart(response.data)
  }
}

export const getNumMatches = async (season, competition) => {
  return await matches.getNumMatches(season, competition)
}