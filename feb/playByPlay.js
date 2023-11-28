import * as api from './api.js';
import * as utils from '../utils.js';

const textos = {
  anotado: "ANOTADO",
  fallado: "FALLADO",
  tiroLibre: "Tiros libres",
  entra: "Sustitución: (Entra)",
  sale: "Sustitución: (Sale)",
  perdida: "Pérdida",
  robo: " Robo ",
  tapon: " Bloqueo ",
  tiroSuspension: "Tiro en suspensión",
  triple: "3Pts Tiro",
  mate: " Mate ",
  asistencia: "Asistencias",
  rebote: "TotReb.",
  falta: " Personal ",
  faltaAtaque: " Ofensiva",
  antideportiva: "Antideportiva",
  tecnica: "Técnica",
  faltaBanquillo: "Coach/Bench",
  inicioCuarto: "Fin del Cuarto",
  finCuarto: "Comienzo del Cuarto",
  tiempoMuerto: "Tiempo"
}

const types = {
  dunk: "DUNK",
  fg2a: "2FGA",
  fg2m: "2FGM",
  fg3a: "3FGA",
  fg3m: "3FGM",
  ftm: "FTM",
  fta: "FTA",
  steal: "ST",
  turnover: "TO",
  assist: "AS",
  block: "FV",
  defReb: "D",
  offReb: "O",
  foulCommited: "CM",
  playerOut: "OUT",
  playerIn: "IN",
  rebound: "R",
  unsportsmanlike: "CMU",
  technical: "CMT",
  coachfoul: "C",
  beginPeriod: "BP",
  endPeriod: "EP",
  timeout: "TOUT"
}

export const getPlayByPlay = async (gamecode) => {
  let pbp = []
  const response = await api.getAPIPlayByPlay(gamecode)
  if (response !== undefined) {
    const data = response.data
    let playByPlay = data["PLAYBYPLAY"]["LINES"]
    const team1 = data["HEADER"]["TEAM"][0]
    const team2 = data["HEADER"]["TEAM"][1]
    const nameTeams = [team1.name, team2.name]
    let players = [] 
    players.push({
      team: data["SCOREBOARD"]["TEAM"][0].clubCode,
      players: data["SCOREBOARD"]["TEAM"][0]["PLAYER"]
    })
    players.push({
      team: data["SCOREBOARD"]["TEAM"][1].clubCode,
      players: data["SCOREBOARD"]["TEAM"][1]["PLAYER"]
    })
    playByPlay.sort(orderPlays)
    //console.log({playByPlay})
    playByPlay.forEach(play => {
      const indexQuarter = parseInt(play.quarter) - 1
      if (indexQuarter >= 0) {
        if (pbp[indexQuarter] === undefined) {
          pbp[indexQuarter] = []
        }
        pbp[indexQuarter].push(...getPlays(play, players, nameTeams))
      } else {
        console.error("Quarter not correct: "+play.quarter)
        console.log({play})
      }
    })
  }
  return pbp
}

const orderPlays = (a, b) => {
  if (a.quarter !== b.quarter) {
    return parseInt(a.quarter) < parseInt(b.quarter) ? -1 : 1
  } else {
    return parseInt(a.num) < parseInt(b.num) ? -1 : 1
  }
}

const getPlays = (play, players, nameTeams) => {
  let plays = []
  const stringPlays = play.text.split(",")
  stringPlays.forEach(strPlay => {
    if (isPlay(strPlay)) {
      for(const nameTeam of nameTeams) {
        strPlay = strPlay.replace("("+nameTeam+")","")
      }
      plays.push(getPlay(strPlay,players, play))
    } else {
      //console.error("is not a play: "+strPlay)
    }
  })
  return plays
}

const isPlay = (strPlay) => {
  for (const [key, value] of Object.entries(textos)) {
    if (strPlay.includes(value)) return true
  }
  return false
}

const getPlay = (strPlay, players, play) => {
  let pbp = {}
  const player = getPlayer(strPlay, players)
  if (play.scoreA !== null) {
    pbp.ptsLocal = play.scoreA
  }
  if (play.scoreA !== null) {
    pbp.ptsVisit = play.scoreB
  }
  pbp.numPlay = parseInt(play.num)
  pbp.type = getTypePlay(strPlay, players, play, player)
  if (player !== null){
    pbp.player = player.id
    pbp.team = player.clubCode
  } else if (pbp.type !== types.rebound && play.team != null) {
    pbp.team = players[parseInt(play.team)-1].team
  }
  pbp.time = utils.timeToSeconds(play.time)
  return pbp
}

const getPlayer = (strPlay, players) => {
  let namePlayer = ''
  if (strPlay.includes(textos.entra) ){
    namePlayer = strPlay.replace(textos.entra,"").trim()
  } else if (strPlay.includes(textos.sale)) {
    namePlayer = strPlay.replace(textos.sale,"").trim()
  } else {
    namePlayer = strPlay.substring(0,strPlay.indexOf(":")).trim()
  }

  if (namePlayer !== '') {
    for (const team of players) {
      const matchingPlayers = team.players.filter(element => element.name.trim() === namePlayer)
      if (matchingPlayers.length === 1) {
        return {
          id: matchingPlayers[0].id,
          clubCode: team.team
        }
      }
    }
    console.error("Player not found: "+ namePlayer)
  } 
  return null
}

const getTypePlay = (strPlay, players, play, player) => {
  let typesPlay = new Map()
  typesPlay.set(textos.entra, types.playerIn)
  typesPlay.set(textos.sale, types.playerOut)
  typesPlay.set(textos.perdida, types.turnover)
  typesPlay.set(textos.robo, types.steal)
  typesPlay.set(textos.tapon, types.block)
  typesPlay.set(textos.asistencia, types.assist)
  typesPlay.set(textos.falta, types.foulCommited)
  typesPlay.set(textos.faltaAtaque, types.foulCommited)
  typesPlay.set(textos.antideportiva, types.unsportsmanlike)
  typesPlay.set(textos.tecnica, types.technical)
  typesPlay.set(textos.faltaBanquillo, types.coachfoul)
  typesPlay.set(textos.inicioCuarto, types.beginPeriod)
  typesPlay.set(textos.finCuarto, types.endPeriod)
  typesPlay.set(textos.tiempoMuerto, types.timeout)

  
  if (strPlay.includes(textos.anotado)) {
    if (strPlay.includes(textos.triple)) {
      return types.fg3m
    }
    if (strPlay.includes(textos.tiroSuspension) || strPlay.includes(textos.mate)) {
      return types.fg2m
    }
    if (strPlay.includes(textos.tiroLibre)) {
      return types.ftm
    } 
    return types.fg2m
  }

  if (strPlay.includes(textos.fallado)) {
    if (strPlay.includes(textos.triple)) {
      return types.fg3a
    }
    if (strPlay.includes(textos.tiroSuspension) || strPlay.includes(textos.mate)) {
      return types.fg2a
    }
    if (strPlay.includes(textos.tiroLibre)) {
      return types.fta
    } 
    return types.fg2a
  }

  if (strPlay.includes(textos.rebote)) {
    if (player !== null) {
      const indexTeam = players.findIndex(element => element.team === player.clubCode)
      return (parseInt(play.team) - 1 === indexTeam) ? types.offReb : types.defReb
    } else {
      return types.rebound
    }
    
  }
  
  for (const [text, type] of typesPlay) {
    if (strPlay.includes(text)) {
      return type
    }
  }

  console.error("Play without type: "+strPlay)

}
