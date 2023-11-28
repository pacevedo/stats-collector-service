import * as api from './api.js';
import * as utils from '../utils.js';

export const getShotChart = async (gamecode) => {
  let shotChart = []
  const response = await api.getAPIShots(gamecode)
  if (response !== undefined) {
    const data = response.data
    const shots = data["SHOTCHART"]["SHOTS"]
    let players = [] 
    players.push({
      team: data["SHOTCHART"]["TEAM"][0].clubCode,
      players: data["SHOTCHART"]["TEAM"][0]["PLAYER"]
    })
    players.push({
      team: data["SHOTCHART"]["TEAM"][1].clubCode,
      players: data["SHOTCHART"]["TEAM"][1]["PLAYER"]
    })
    shots.forEach(shot => {
      const indexQuarter = parseInt(shot.quarter) - 1
      if (indexQuarter >= 0) {
        if (shotChart[indexQuarter] === undefined) {
          shotChart[indexQuarter] = []
        }
        shotChart[indexQuarter].push(getShot(shot, players))
      } else {
        console.error("Quarter not correct: "+shot.quarter)
        console.log({shot})
      }
    })
    shotChart.forEach(quarterShots => {
      quarterShots.sort(orderShotChart)
    })
  }
  return shotChart
}

const getShot = (shot, players) => {
  let itemShot = {}
  if (parseInt(shot.team)<0 || parseInt(shot.team)>1) {
    console.error("Team not correct")
    console.log({shot})
    return itemShot
  }
  itemShot.team = players[parseInt(shot.team)].team
  itemShot.player = getPlayerByNumber(shot.player, players[parseInt(shot.team)].players)
  itemShot.action = getAction(shot.m)
  itemShot.x = shot.x
  itemShot.y = shot.y
  itemShot.time = utils.timeToSeconds(shot.t)
  return itemShot
}

const getPlayerByNumber = (number, players) => {
  const result = players.filter(player => player.no === number)
  if (result.length === 0) {
    console.error("Player with "+number+" number not found")
    console.log({players})
    return null
  } else if (result.length > 1){
    console.error("Multiple players with "+number+" number found")
    console.log({result})
    return null
  } 
  return result[0].id
}

const getAction = action => {
  if (action === "0") {
    return "Attempted"
  }
  if (action === "1") {
    return "Made"
  }
  console.error("Action not found: "+action)
  return null
}

const orderShotChart = (a, b) => {
    return parseInt(a.time) > parseInt(b.time) ? -1 : 1
}