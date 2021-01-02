import axios  from 'axios';
import routes from './routes.js';
import * as utils from '../utils.js';

export const getAPIPlayByPlay = async (gamecode, competition, season) => {
  try {
    const url = routes.playByPlay+'?gamecode='+gamecode+'&seasoncode='+competition+season
    return await axios.get(url)
  } catch (error) {
    console.error(error)
  }
}

const getPlayByPlayQuarter = plays => {
  const arrPlays = []
  for (const play of plays) {
    arrPlays.push(getPlayLine(play))
  }
  // Order by numPlay
  arrPlays.sort(compare)
  return arrPlays
}

const getPlayByPlayExtraTime = plays => {
  const arrPlays = []
  for (const play of plays) {
    let numQuarter = getQuarterETByMinute(play.MINUTE)
    if (play.PLAYTYPE.trim() === "EG" || play.PLAYTYPE.trim() === "EP") {
      numQuarter--
    }
    if (arrPlays[numQuarter] === undefined) {
      arrPlays[numQuarter] = []
    }
    arrPlays[numQuarter].push(getPlayLine(play))
  }
  // Order by numPlay
  arrPlays.sort(compare)
  return arrPlays
}

const getQuarterETByMinute = minute => {
  return Math.trunc((minute - 41) / 5)
}

const getPlayLine = play => {
  let playLine = {
    numPlay: play.NUMBEROFPLAY,
    type: play.PLAYTYPE.trim(),
  }
  if (play.CODETEAM.trim() !== "") {
    playLine.team = play.CODETEAM.trim()
  }
  if (play.PLAYER_ID.trim() !== "") {
    playLine.player = play.PLAYER_ID.trim()
  }
  if (play.MARKERTIME.trim() !== "") {
    playLine.time = utils.timeToSeconds(play.MARKERTIME.trim())
  }
  if (play.POINTS_A !== null || play.POINTS_B !== null) {
    playLine.ptsLocal = play.POINTS_A !== null ? play.POINTS_A : 0
    playLine.ptsVisit = play.POINTS_B !== null ? play.POINTS_B : 0
  }
  
  return playLine
}

export const getPlayByPlay = data => {
  let pbp = []
  pbp.push(getPlayByPlayQuarter(data.FirstQuarter))
  pbp.push(getPlayByPlayQuarter(data.SecondQuarter))
  pbp.push(getPlayByPlayQuarter(data.ThirdQuarter))
  pbp.push(getPlayByPlayQuarter(data.ForthQuarter))
  if (data.ExtraTime !== null && data.ExtraTime.length > 0) {
    pbp = [...pbp, ...getPlayByPlayExtraTime(data.ExtraTime)]
  }
  return pbp
}

function compare( a, b ) {
  return a.numPlay < b.numPlay
}

