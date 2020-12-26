const pathAPI = "https://live.euroleague.net/api/"
const pathEL = "https://www.euroleague.net/"
const pathEC = "https://www.eurocupbasketball.com/eurocup/"

const routes = {
  pathAPI: pathAPI,
  matches: {
    el: pathEL+"main/results",
    ec: pathEC+"games/results"
  },
  match: {
    el: pathEL+"main/results/showgame",
    ec: pathEC+"games/results/showgame"
  },
  player: {
    el: pathEL+"competition/players/showplayer",
    ec: pathEC+"competition/players/showplayer"
  },

  header: pathAPI+"Header",
  evolution: pathAPI+"Evolution",
  boxScore: pathAPI+"BoxScore",
  playByPlay: pathAPI+"PlayByPlay",
  points: pathAPI+"Points",
}

export default routes