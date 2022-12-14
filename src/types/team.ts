export interface RankedTeam {
    team: number,
    teamName: string
    ranking: number
    leagueRanking: number
    rankingPoints: string
    tbp1: string
    tbp2: string
    matchesPlayed: number
    highestScore: number
    wins: number
    losses: number
    ties: number,
}

export interface Team {
    number: number,
    name: string,
    country: string,
    affiliation: string,
    city: string,
    state: string,
    rookie: number,
}
