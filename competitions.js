const competitions = {
  EUROLEAGUE: "Euroleague",
  EUROCUP: "Eurocup",
  getByAbr(abr) {
    switch (abr) {
      case 'E':
        return competitions.EUROLEAGUE
      case 'U':
        return competitions.EUROCUP
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
      default:
        return ''
    }
  }
}

export default competitions