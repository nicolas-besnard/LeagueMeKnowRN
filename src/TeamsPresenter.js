class TeamsPresenter {
  constructor(matches) {
    this.matches = matches
  }

  teams() {
    const teams = this.matches.reduce((hash, match) => {
      hash[match.team1.code] = match.team1
      hash[match.team2.code] = match.team2
      return hash
    }, {})

    return Object.values(teams)
  }
}

export default TeamsPresenter
