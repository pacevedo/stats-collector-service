import cheerio  from 'cheerio';
import * as utils from '../utils.js';


export const getMatchDataByQuarters = html => {
  const localQuarters = []
  const visitorQuarters = []
  try {
    const $ = cheerio.load(html)
    const selectorByQuarter = ".PartialsStatsByQuarterContainer table tr"
    const trLocal = $(selectorByQuarter).get(1)
    const trVisitor = $(selectorByQuarter).get(2)
    $(trLocal).children().each(function(index, element) {
      const value = $(this).text().trim()
      if (index > 0 && !isNaN(value)) {
        localQuarters[index-1] = parseInt(value)
      }
    })
    $(trVisitor).children().each(function(index, element) {
      const value = $(this).text().trim()
      if (index > 0 && !isNaN(value)) {
        visitorQuarters[index-1] = parseInt(value)
      }
    })
    
  } catch (error) {
      console.error(error)
  }
  return {
    local: localQuarters,
    visitor: visitorQuarters
  }
}

export const getMatchData = (html, gamecode, nameCompetition, season, byQuarters) => {
  let match = {}
  try {
    const data = getBasicMatchData(html)
    match = {
      gamecode: gamecode,
        competition: nameCompetition,
        season: season,
        date: data.date,
        round: data.round,
        phase: data.phase,
        stadium: data.stadium,
    }
    const teams = getTeams(html)
    match.local = { name: teams.local.name, code: teams.local.code, points: teams.local.points, byQuarters: byQuarters.local};
    match.visitor = { name: teams.visitor.name, code: teams.visitor.code, points: teams.visitor.points, byQuarters: byQuarters.visitor}
    const stats = getBoxScoreData(html)
    match.local.stats = stats.local
    match.visitor.stats = stats.visitor
  } catch (error) {
    console.error(error)
  }
  return match
}

export const getPlayerData = html => {
  let player = {}
  const $ = cheerio.load(html)
  const name = $(".player-data .name")
  const first = $(".summary-first span span")
  const second = $(".summary-second span")
  const positionContainer = first[1] !== undefined ? first[1] : first[0]
  player.name = name.text().trim()
  
  if (positionContainer !== undefined) {
    player.position = positionContainer.children[0].data.trim()
  }
  const height = getHeight(second)
  if (height !== null) {
    player.height = height
  } else {
    console.error("No height for "+player.name)
  }

  const born = getDateOfBirth(second)
  if (born !== null) {
    player.born = born
  } else {
    console.error("No date of birth for "+player.name)
  }

  const nationality = getNationality(second)
  if (nationality !== null) {
    player.nationality = nationality
  } else {
    console.error("No nationality for "+player.name)
  }
  return player
}

const getHeight = elements => {
  const arrIndex = [0,1,2]
  for (const index of arrIndex) {
    if (elements[index] !== undefined) {
      const element = elements[index]
      if (element.children[0] !== undefined && element.children[0].data.includes("Height")) {
        return parseFloat(element.children[0].data.replace("Height: ",""))
      }
    }
  }
  return null
}

const getDateOfBirth = elements => {
  const arrIndex = [0,1,2]
  for (const index of arrIndex) {
    if (elements[index] !== undefined) {
      const element = elements[index]
      if (element.children[0] !== undefined && element.children[0].data.includes("Born")) {
        return new Date(element.children[0].data.replace("Born: ","")+" 12:00:00")
      }
    }
  }
  return null
}

const getNationality = elements => {
  const arrIndex = [0,1,2]
  for (const index of arrIndex) {
    if (elements[index] !== undefined) {
      const element = elements[index]
      if (element.children[0] !== undefined && element.children[0].data.includes("Nationality")) {
        return element.children[0].data.replace("Nationality: ","")
      }
    }
  }
  return null
}

const getBasicMatchData = html => {
  let data = {}
  try {
    const $ = cheerio.load(html)
    const info = $(".gc-title span")
    data = {
      phase: info[1].children[0].data.trim().toUpperCase(),
      round: info[2].children[0].data.replace("Round ",""),
      stadium: $(".dates .stadium").text().trim(),
      date: new Date($(".dates .date").text().trim().replace("CET: ",""))
    }

  } catch (error) {
    console.error(error)
  }
  return data
}

const getTeams = html => {
  let teams = {}
  try {
    const $ = cheerio.load(html)
    const selectorLocal = ".game-score .local"
    const selectorVisitor = ".game-score .road"
    const linkLocal = $(selectorLocal+" a" )[0]
    const linkVisitor = $(selectorVisitor+" a" )[0]
    
    teams.local = {
      code: getCodeItemByLink(linkLocal.attribs['href'], "clubcode="),
      name: $(selectorLocal+" .name")[0].children[0].data.trim().toUpperCase(),
      points: parseInt($(selectorLocal+" .score").text())
    }
    teams.visitor = {
      code: getCodeItemByLink(linkVisitor.attribs['href'], "clubcode="),
      name: $(selectorVisitor+" .name")[0].children[0].data.trim().toUpperCase(),
      points: parseInt($(selectorVisitor+" .score").text())
    }
  } catch (error) {
    console.error(error)
  }
  return teams
}

const getBoxScoreData = html => {
  let stats = {local: {players: [], team: {}, total: {}}, visitor: {players: [], team: {}, total: {}}}
  try {
    const $ = cheerio.load(html)
    const selectorLocal = ".LocalClubStatsContainer #tblPlayerPhaseStatistics"
    const selectorVisitor = ".RoadClubStatsContainer #tblPlayerPhaseStatistics"
    const trsLocal = $(selectorLocal+" tbody tr")
    const trsVisitor = $(selectorVisitor+" tbody tr")
    const trsTotalLocal = $(selectorLocal+" tfoot tr")
    const trsTotalVisitor = $(selectorVisitor+" tfoot tr")
    
    trsLocal.each(function(){
      const isPlayerLocal = !$(this).hasClass('team')
      const rowLocal = getBoxScoreDataRow($(this), isPlayerLocal)
      if (!isPlayerLocal) {
        stats.local.team = rowLocal
      } else {
        stats.local.players.push(rowLocal)
      }
    })

    trsVisitor.each(function(){
      const isPlayerVisitor = !$(this).hasClass('team')
      const rowVisitor = getBoxScoreDataRow($(this), isPlayerVisitor)
      if (!isPlayerVisitor) {
        stats.visitor.team = rowVisitor
      } else {
        stats.visitor.players.push(rowVisitor)
      }
    })

    stats.local.total = getBoxScoreDataRow($(trsTotalLocal[0]), false)
    stats.visitor.total = getBoxScoreDataRow($(trsTotalVisitor[0]), false)

  } catch (error) {
    console.error(error)
  }
  return stats
}

const getBoxScoreDataRow = (element, isPlayer) => {
  const statLine = {}
  element.children().each(function(ind, elem){ 
    const value = getValueFromElement(elem)
    let shotInfo
    switch (ind) {
      case 1: 
        if (isPlayer) {
          statLine.code = getCodeItemByLink (elem.children[0].attribs['href'], "pcode=")
          statLine.start = isStarter(elem.children[0].attribs['class']) ? 1 : 0
        }
        break
      case 2: 
        if (isPlayer) {
          statLine.secs = (value === "DNP") ? 0 : utils.timeToSeconds(value)
        }
        break
      case 3:
        statLine.pts = parseValue(value)
        break
      case 4: 
        shotInfo = getShots(value)
        statLine.fgm2 = shotInfo.made
        statLine.fga2 = shotInfo.attempted
        break
      case 5:
        shotInfo = getShots(value)
        statLine.fgm3 = shotInfo.made
        statLine.fga3 = shotInfo.attempted
        break
      case 6:
        shotInfo = getShots(value)
        statLine.ftm = shotInfo.made
        statLine.fta = shotInfo.attempted
        break
      default:
        break
    }
    if (ind > 6 && ind < 18) {
      statLine[getAttrByInd(ind)] = parseValue(value)
    }
  })
  
  return statLine
}

const getValueFromElement = (elem) => {
  let value = ""
  if (elem.children.length > 0) {
    if (elem.children[0].data !== undefined) {
      value = elem.children[0].data
    } else if (elem.children[0].children.length > 0) {
      // Get value from totals (inside of span)
      value = elem.children[0].children[0].data
    }
  }
  return value
}

const parseValue = value => {
  return value.trim() === "" ? 0 : parseInt(value.trim())
}

const getCodeItemByLink = (link, item) => {
  const aux = link.split(item)
  if (aux.length === 2) {
    const aux2 = aux[1].split("&")
    return utils.parsePlayerCode(aux2[0])
  } else {
    console.error("Error parsing code player from link: "+link)
  }
  return ""
}

const isStarter = clazz => {
  return clazz !== undefined && clazz.includes('PlayerStartFive')
}

const getShots = value => {
  const shots = {made: 0, attempted: 0}
  const fgs = (value.trim() === "" || value.trim() === "-") ? "0/0": value.trim()
  const aux = fgs.split("/")
  if (aux.length === 2) {
    shots.made = parseInt(aux[0])
    shots.attempted = parseInt(aux[1])
  } else {
    console.error("Error parsing shots: "+value)
  }
  return shots
}

const getAttrByInd = ind => {
  ind = ind - 7
  const arrAttrs = ['offrebs','defrebs','totrebs','assists','steals','turnovers','blkFav','blkAga','flsCom','flsRec','val']
  return arrAttrs[ind]
}