import { Match } from "./types/match";
import { MatchType } from "./types/util";

export default class MatchCache {
    private readonly scorekeeperIp: string;
    private readonly eventKey: string;
    private qualsCache: Record<number, Match> = {};
    private elimsCache: Record<number, Match> = {};

    constructor(scorekeeperIp: string, eventKey: string) {
        this.scorekeeperIp = scorekeeperIp;
        this.eventKey = eventKey;
        this.fillCache();
    }

    getMatch(matchNum: number, matchType: MatchType = 'quals'): Match | null {
        const cache = matchType == 'quals' ? this.qualsCache : this.elimsCache;
        if (cache.hasOwnProperty(matchNum)) {
            return cache[matchNum];
        }
        return null;
    }

    updateCacheIfEmpty() {
        if (Object.keys(this.qualsCache).length == 0) {
            this.fillCache();
        }
        if (Object.keys(this.elimsCache).length == 0) {
            this.fillElimsCache();
        }
    }

    fillCache() {
        fetch(`${this.scorekeeperIp}/api/v1/events/${this.eventKey}/matches/?cacheBust=${Math.random()}`, {
            headers: {
                'Origin': location.href,
            },
        })
            .then(res => res.json())
            .then(data => data.matches.forEach((m: any) => {
                this.qualsCache[m.matchNumber] = {
                    name: m.matchName,
                    number: m.matchNumber,
                    field: m.field,
                    red: {
                        team1: m.red.team1,
                        team2: m.red.team2,
                    },
                    blue: {
                        team1: m.blue.team1,
                        team2: m.blue.team2,
                    },
                    state: m.matchState,
                };
            }));
    }

    fillElimsCache() {
        fetch(`${this.scorekeeperIp}/api/v2/events/${this.eventKey}/elims/?cacheBust=${Math.random()}`, {
            headers: {
                'Origin': location.href,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error();
                return res;
            })
            .then(res => res.json())
            .then(data => data.matches.forEach((m: any) => {
                this.elimsCache[m.matchNumber] = {
                    name: m.matchName,
                    number: m.matchNumber,
                    field: m.field,
                    red: {
                        captain: m.red.captain,
                        pick1: m.red.pick1,
                        pick2: m.red.pick2
                    },
                    blue: {
                        captain: m.blue.captain,
                        pick1: m.blue.pick1,
                        pick2: m.blue.pick2
                    },
                    state: m.matchState,
                };
            }))
            .catch(() => { /* ignored */ });
    }

    totalQuals() {
        return Object.keys(this.qualsCache).length;
    }

    totalElims() {
        return Object.keys(this.elimsCache).length;
    }

    allQuals(): Record<number, Match> {
        return structuredClone(this.qualsCache);
    }
}
