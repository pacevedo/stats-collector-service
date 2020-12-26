import * as db from './db.js'

export const setViewPlayersTeam = async () => {
  const collection = await db.getCollection('matches')
  collection.mapReduce(
    function () {
      const local = this.local.code
      const visitor = this.visitor.code
      for (const player of this.local.stats.players) {
        const localKey = local + "_" + this.competition + "_" + this.season
        emit(localKey, player.code)
      }
      for (const player of this.visitor.stats.players) {
        const visitorKey = visitor + "_" + this.competition + "_" + this.season
        emit(visitorKey, player.code)
      }
    },
    function (key, values) {
      var players = []
      values.forEach(function (v) {
        if (!players.includes(v))
          players.push(v)
      })
      return players
    },
    { out: "viewPlayersTeam" },
  );
}

export const getCodePlayersByTeam = async (codeteam, competition, season) => {
  const collection = await db.getCollection('viewPlayersTeam')
  const cursorKey = codeteam+"_"+competition+"_"+season
  const cursor = collection.find({_id: {$eq: cursorKey}},{_id: 0, value: 1})
  const allValues = await cursor.toArray();
  return allValues.length > 0 ? allValues[0].value : []
}

export const getTeamsBySeason = async (season, competition) => {
  const collection = await db.getCollection('viewPlayersTeam')
  const regex = competition+'_'+season+'$'
  const cursor = collection.find({_id: new RegExp(regex)})
  return await cursor.toArray()
}