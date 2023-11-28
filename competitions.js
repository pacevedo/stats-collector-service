const competitions = {
  EUROLEAGUE: "Euroleague",
  EUROCUP: "Eurocup",
  LEBORO: "LEBOro",
  LEBPLATA: "LEBPlata",
  getByAbr(abr) {
    switch (abr) {
      case 'E':
        return competitions.EUROLEAGUE
      case 'U':
        return competitions.EUROCUP
      case '1':
        return competitions.LEBORO
      case '2':
        return competitions.LEBPLATA
      default:
        return ''
    }
  },
  getAbr(competition) {
    switch (competition) {
      case competitions.EUROLEAGUE:
        return 'E'
      case competitions.EUROCUP:
        return 'U'
      case competitions.LEBORO:
        return '1'
      case competitions.LEBPLATA:
        return '2'
      default:
        return ''
    }
  },
  getId(competition){
    switch (competition) {
      case competitions.LEBORO:
        return '115'
      case competitions.LEBPLATA:
        return '118'
      default:
        return ''
    }
  }
}

export default competitions