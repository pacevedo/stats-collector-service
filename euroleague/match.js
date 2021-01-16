import axios  from 'axios';

import competitions from '../competitions.js';
import routes from './routes.js';

import * as matches from '../db/matches.js';
import * as parseHTML from './parseHTML.js';
import * as playByPlay from './playByPlay.js';
import * as shots from './shots.js';

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
    const html = await getHtmlMatchData(gamecode, competition, season)
    if (html !== undefined) {
      const byQuarters = parseHTML.getMatchDataByQuarters(html.data)
      match = parseHTML.getMatchData(html.data, gamecode, nameCompetition, season, byQuarters)
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