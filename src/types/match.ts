export interface Match {
    name: string,
    number: number,
    field: number,
    red: Alliance,
    blue: Alliance,
    state: string,
}

export type Alliance = QualsAlliance | ElimsAlliance;

export interface QualsAlliance {
    team1: number,
    team2: number,
}

export interface ElimsAlliance {
    captain: number,
    pick1: number,
    pick2: number,
}
