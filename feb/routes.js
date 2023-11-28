const pathAPI = "https://intrafeb.feb.es/LiveStats.API/api/v1/"
const path = "https://baloncestoenvivo.feb.es/"

const pathOro = "http://www.leboro.es/Inicio.aspx?tabid=4"
const pathPlata = "http://www.lebplata.es/Inicio.aspx?tabid=4"

const routes = {
  pathAPI: pathAPI,
  matches: {
    oro: pathOro,
    plata: pathPlata
  },
  boxScore: pathAPI+"BoxScore/",
  playByPlay: pathAPI+"KeyFacts/",
  shotChart: pathAPI+"ShotChart/",
  player: path+"jugador/"
}

export default routes