export interface Match {
    name: string,
    number: number,
    field: number,
    red: Alliance,
    blue: Alliance,
    state: string,
}

export type TeamNumber = number;

export type Alliance = QualsAlliance | TeamNumber[];

export interface QualsAlliance {
    team1: TeamNumber,
    team2: TeamNumber,
}
