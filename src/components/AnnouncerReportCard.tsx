import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header'
import Pagination from '@cloudscape-design/components/pagination';
import SegmentedControl from '@cloudscape-design/components/segmented-control';
import Spinner from '@cloudscape-design/components/spinner';
import Table from '@cloudscape-design/components/table';
import { useEffect, useState } from 'react';
import MatchCache from '../MatchCache';
import TeamInfoCache from '../TeamInfoCache';
import { Match, QualsAlliance, TeamNumber } from '../types/match';
import { Team } from '../types/team';
import { AllianceColor, MatchType, PositionNumber } from '../types/util';

const loadingPlaceholder = <Container><Box textAlign='center'><Spinner size='large' /></Box></Container>;

interface AnnouncerReportCardProps {
    curQualMatch: number,
    setCurQualMatch: (val: number) => void,
    matchCache: MatchCache,
    eventKey: string | null,
    teamInfoCache: TeamInfoCache,
    curElimMatch: number,
    setCurElimMatch: (val: number) => void,
    matchType: MatchType,
    setMatchType: (val: MatchType) => void,
}

export default function AnnouncerReportCard({curQualMatch, setCurQualMatch, matchCache, eventKey,
    teamInfoCache, curElimMatch, setCurElimMatch, matchType, setMatchType}: AnnouncerReportCardProps) {
    
    const match = matchCache.getMatch(matchType == 'quals' ? curQualMatch : curElimMatch, matchType);
    if (!match) return loadingPlaceholder;
    return matchType == 'quals' ? <QualsTable match={match} teamInfoCache={teamInfoCache} curMatch={curQualMatch} setCurMatch={setCurQualMatch} matchCache={matchCache} matchType={matchType} setMatchType={setMatchType} />
                                : <ElimsTable match={match} teamInfoCache={teamInfoCache} curMatch={curElimMatch} setCurMatch={setCurElimMatch} matchCache={matchCache} matchType={matchType} setMatchType={setMatchType} />;
}

interface MatchTableProps {
    match: Match | null,
    teamInfoCache: TeamInfoCache,
    curMatch: number,
    setCurMatch: (val: number) => void,
    matchCache: MatchCache,
    matchType: MatchType,
    setMatchType: (val: MatchType) => void,
}

function QualsTable({match, teamInfoCache, curMatch, setCurMatch, matchCache, matchType, setMatchType}: MatchTableProps) {
    const [teams, setTeams] = useState<{[c in AllianceColor]: {[p in PositionNumber]?: Team}} | undefined>();
    useEffect(() => {
        if (!match) return;
        const [redAlliance, blueAlliance] = [match.red as QualsAlliance, match.blue as QualsAlliance];
        Promise.all([teamInfoCache.getTeam(redAlliance.team1), teamInfoCache.getTeam(redAlliance.team2),
                     teamInfoCache.getTeam(blueAlliance.team1), teamInfoCache.getTeam(blueAlliance.team2),])
            .then(data => setTeams({
                red: {'1': data[0], '2': data[1],},
                blue: {'1': data[2], '2': data[3],},
            }));
    }, [match]);
    if (!match || !teams) return loadingPlaceholder;
    return (
        <Table
            id='announcer-table'
            header={<Header variant='h2' description={`Field ${match?.field}`}
                actions={<SegmentedControl selectedId={matchType}
                            onChange={({ detail }) => setMatchType(detail.selectedId as MatchType)}
                            label='Match type'
                            options={[
                                {text: 'Qualifications', id: 'quals',},
                                {text: 'Eliminations', id: 'elims', disabled: matchCache.totalElims()  == 0,},
                            ]} />}>Match {curMatch} of {matchCache.totalQuals()}</Header>}
            footer={<Pagination currentPageIndex={curMatch} pagesCount={matchCache.totalQuals()}
                onChange={({detail}) => setCurMatch(detail.currentPageIndex)} />}
            wrapLines
            columnDefinitions={[
                {
                    header: 'Position',
                    cell: e => e.position,
                },
                {
                    header: 'Team Number',
                    cell: e => e.number,
                },
                {
                    header: 'Name',
                    cell: e => e.name,
                },
                {
                    header: 'Affiliation',
                    cell: e => e.affiliation,
                },
                {
                    header: 'Location',
                    cell: e => e.location,
                },
                {
                    header: 'Rookie Year',
                    cell: e => e.rookie,
                },
            ]}
            items={[
                {
                    position: 'R1',
                    number: teams.red['1']!.number,
                    name: teams.red['1']!.name,
                    affiliation: teams.red['1']!.affiliation,
                    location: teams.red['1']!.city + ', ' + teams.red['1']!.state + ', ' + teams.red['1']!.country,
                    rookie: teams.red['1']!.rookie,
                },
                {
                    position: 'R2',
                    number: teams.red['2']!.number,
                    name: teams.red['2']!.name,
                    affiliation: teams.red['2']!.affiliation,
                    location: teams.red['2']!.city + ', ' + teams.red['2']!.state + ', ' + teams.red['2']!.country,
                    rookie: teams.red['2']!.rookie,
                },
                {
                    position: 'B1',
                    number: teams.blue['1']!.number,
                    name: teams.blue['1']!.name,
                    affiliation: teams.blue['1']!.affiliation,
                    location: teams.blue['1']!.city + ', ' + teams.blue['1']!.state + ', ' + teams.blue['1']!.country,
                    rookie: teams.blue['1']!.rookie,
                },
                {
                    position: 'B2',
                    number: teams.blue['2']!.number,
                    name: teams.blue['2']!.name,
                    affiliation: teams.blue['2']!.affiliation,
                    location: teams.blue['2']!.city + ', ' + teams.blue['2']!.state + ', ' + teams.blue['2']!.country,
                    rookie: teams.blue['2']!.rookie,
                },
            ]} />
    );
}

function ElimsTable({match, teamInfoCache, curMatch, setCurMatch, matchCache, matchType, setMatchType}: MatchTableProps) {
    const [teams, setTeams] = useState<{[c in AllianceColor]: Team[]} | undefined>();
    useEffect(() => {
        if (!match) return;
        const [redAlliance, blueAlliance] = [match.red as TeamNumber[], match.blue as TeamNumber[]];
        Promise.all([
            Promise.all(redAlliance.map(teamNumber => teamInfoCache.getTeam(teamNumber))),
            Promise.all(blueAlliance.map(teamNumber => teamInfoCache.getTeam(teamNumber))),
        ])
            .then(data => setTeams({
                red: data[0],
                blue: data[1],
            }));
    }, [match]);
    if (!match || !teams) return loadingPlaceholder;
    return (
        <Table
            id='announcer-table-elims'
            header={<Header variant='h2' description={`Field ${match?.field}`}
                actions={<SegmentedControl selectedId={matchType}
                            onChange={({ detail }) => setMatchType(detail.selectedId as MatchType)}
                            label='Match type'
                            options={[
                                {text: 'Qualifications', id: 'quals',},
                                {text: 'Eliminations', id: 'elims', disabled: matchCache.totalElims()  == 0,},
                            ]} />}>Match {curMatch} of {matchCache.totalElims()}</Header>}
            footer={<Pagination currentPageIndex={curMatch} pagesCount={matchCache.totalElims()}
                onChange={({detail}) => setCurMatch(detail.currentPageIndex)} />}
            wrapLines
            columnDefinitions={[
                {
                    header: 'Position',
                    cell: e => e.position,
                },
                {
                    header: 'Team Number',
                    cell: e => e.number,
                },
                {
                    header: 'Name',
                    cell: e => e.name,
                },
                {
                    header: 'Affiliation',
                    cell: e => e.affiliation,
                },
                {
                    header: 'Location',
                    cell: e => e.location,
                },
                {
                    header: 'Rookie Year',
                    cell: e => e.rookie,
                },
            ]}
            items={[
                ...teams.red.map((team, idx) => ({
                    position: `R${idx + 1}`,
                    number: team.number,
                    name: team.name,
                    affiliation: team.affiliation,
                    location: team.city + ', ' + team.state + ', ' + team.country,
                    rookie: team.rookie,
                })),
                ...teams.blue.map((team, idx) => ({
                    position: `B${idx + 1}`,
                    number: team.number,
                    name: team.name,
                    affiliation: team.affiliation,
                    location: team.city + ', ' + team.state + ', ' + team.country,
                    rookie: team.rookie,
                })),
            ]} />
    );
}
