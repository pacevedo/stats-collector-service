import axios  from 'axios';
import routes from './routes.js';
import * as utils from '../utils.js';

export const getAPIShots = async (gamecode, competition, season) => {
  try {
    const url = routes.points+'?gamecode='+gamecode+'&seasoncode='+competition+season
    return await axios.get(url)
  } catch (error) {
    console.error(error)
  }
}

export const getShotChart = data => {
  const arrShots = []
  for (const shot of data.Rows) {
    const numQuarter = getQuarterByMinute(shot.MINUTE)
    const shotLine = {
      numShot: shot.NUM_ANOT,
      team: shot.TEAM.trim(),
      player: shot.ID_PLAYER.trim(),
      action: shot.ID_ACTION.trim(),
      x: shot.COORD_X,
      y: shot.COORD_Y,
      zone: shot.ZONE,
      fastbreak: shot.FASTBREAK,
      secondChance: shot.SECOND_CHANCE,
      ptsOffTurnover: shot.POINTS_OFF_TURNOVER,
      time: utils.timeToSeconds(shot.CONSOLE),
    }
    if (shot.POINTS_A !== null || shot.POINTS_B !== null) {
      shotLine.ptsLocal = shot.POINTS_A !== null ? shot.POINTS_A : 0
      shotLine.ptsVisit = shot.POINTS_B !== null ? shot.POINTS_B : 0
    }
    if (arrShots[numQuarter] === undefined) {
      arrShots[numQuarter] = []
    }
    arrShots[numQuarter].push(shotLine)
  }
  arrShots.sort(compare)
  return arrShots
}

const getQuarterByMinute = minute => {
  if (minute <= 40) {
    return Math.trunc((minute-1) / 10)
  } else {
    return Math.trunc((minute-41)/ 5) + 4
  }
}

function compare( a, b ) {
  return a.numShot < b.numShot
}