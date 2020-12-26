import * as db from './db.js'

export const insertOne = async (player) => {
  const collection = await db.getCollection('players')
  collection.insertOne(player)
}

export const getPlayer = async (playercode) => {
  const collection = await db.getCollection('players')
  return collection.findOne({
    playercode: playercode
  })
}

export const getCodePlayersBySeasonCompetitionTeam = async (codeteam, competition, season) => {
  const collection = await db.getCollection('players')
  const cursor = collection.find({seasons: {season:season, competition: competition, team: codeteam}}, {_id: 0, playercode:1})
  const allValues = await cursor.toArray()
  return allValues.map(element => element.playercode)
}

export const updateSeasons = async (playercode, seasons) => {
  const collection = await db.getCollection('players')
  const status = collection.updateOne(
    {playercode: playercode},
    { $set: { seasons: seasons}}
  )
  return (await status).modifiedCount
}