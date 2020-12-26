import axios  from 'axios';
import cheerio  from 'cheerio';

import competitions from '../competitions.js';
import * as match from './match.js';
import routes from './routes.js';

const getHtmlRoundData = async (round, phase, competition, season) => {
  try {
    const route = competitions.getByAbr(competition) === competitions.EUROLEAGUE ? routes.matches.el : routes.matches.ec
    const url = route+'?gamenumber='+round+'&phasetypecode='+phase+'&seasoncode='+competition+season
    return await axios.get(url)
  } catch (error) {
    console.error(error)
  }
}

const getMatchesFromRound = (html) => {
  const $ = cheerio.load(html)
  const idsMatches = []
  $(".wp-module-asidegames .game").each(function(){
    if (isPlayed($(this))) {
      const code = $(this).attr("data-code")
      const aux = code.split("_")
      if (aux.length === 2) {
        idsMatches.push(aux[1])
      } else {
        console.error("data-code: "+code)
      }
    }
  })
  return idsMatches
}

const isPlayed = element => {
  return element.attr("data-played") === "1"
}

export const processRound = async (round, phase, competition, season) => {
  const html = await getHtmlRoundData(round, phase, competition, season)
  const idsMatches = getMatchesFromRound(html.data)
  for (const gamecode of idsMatches) {
    match.processMatchData(gamecode, competition, season)
  }
  return idsMatches
}