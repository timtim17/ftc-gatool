import { Team } from "./types/team";

export default class TeamInfoCache {
    private readonly scorekeeperIp: string;
    private readonly eventKey?: string;
    private cache: Record<number, Team> = {};
    private teams: number[] = [];

    constructor(scorekeeperIp: string, eventKey?: string) {
        this.scorekeeperIp = scorekeeperIp;
        this.eventKey = eventKey;
        this.fillTeams();
    }

    async getTeam(team: number): Promise<Team> {
        if (team <= 0) {
            return {
                number: team,
                name: 'Placeholder Team',
                country: 'USA',
                affiliation: 'FIRST',
                city: 'Manchester',
                state: 'NH',
                rookie: 0,
            }
        }
        if (this.cache.hasOwnProperty(team)) {
            return this.cache[team];
        }
        const result = await fetch(`${this.scorekeeperIp}/api/v1/${this.eventKey ? `events/${this.eventKey}/` : ''}teams/${team}/`, {
            headers: {
                'Origin': location.href,
            },
        })
            .then(res => res.json())
            .then(data => ({
                number: data.number,
                name: data.name,
                country: data.country,
                affiliation: data.school,
                city: data.city,
                state: data.state,
                rookie: data.rookie,
            }));
        this.cache[team] = result;
        return result;
    }

    fillTeams() {
        fetch(`${this.scorekeeperIp}/api/v1/events/${this.eventKey}/teams/`, {
            headers: {
                'Origin': location.href,
            },
        })
            .then(res => res.json())
            .then(data => this.teams = data.teamNumbers);
    }

    allTeams() {
        return this.teams;
    }
}
