import * as db from './db.js'

export const insertOne = async (match) => {
  const collection = await db.getCollection('matches')
  collection.insertOne(match)
}

export const getMatch = async (gamecode, competition, season) => {
  const collection = await db.getCollection('matches')
  return await collection.findOne({
    gamecode: gamecode,
    season: season,
    competition: competition
  })
}

export const getNameTeamByCodeTeam = async (codeteam, season) => {
  const collection = await db.getCollection('matches')
  const element = await collection.findOne({season: season, "local.code": codeteam},{"local.name": 1})
  return element !== null ? element.local.name : null
}

export const getNumMatches = async (season, competition) => {
  const collection = await db.getCollection('matches')
  const cursor = await collection.aggregate([
    { $match: { season: season, competition: competition } } ,
    { $group : {
          _id: {
              "phase": "$phase",
              "round": "$round"
          },
          count: { $sum: 1 }
       } 
    },
    { $sort: { "_id.phase": 1, "_id.round": 1 } }
 ])
 return cursor.toArray()
}