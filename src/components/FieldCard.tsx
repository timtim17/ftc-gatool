import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header'
import Pagination from '@cloudscape-design/components/pagination';
import SegmentedControl from '@cloudscape-design/components/segmented-control';
import Spinner from '@cloudscape-design/components/spinner';
import { useEffect, useState } from 'react';
import MatchCache from '../MatchCache';
import TeamInfoCache from '../TeamInfoCache';
import { Match, QualsAlliance, TeamNumber } from '../types/match';
import { Team } from '../types/team';
import { AllianceColor, MatchType, PositionNumber } from '../types/util';

interface FieldCardProps {
    curQualMatch: number,
    setCurQualMatch: (val: number) => void,
    setModalTeam: (val: number | null) => void,
    matchCache: MatchCache,
    teamInfoCache: TeamInfoCache,
    curElimMatch: number,
    setCurElimMatch: (val: number) => void,
    matchType: MatchType,
    setMatchType: (val: MatchType) => void,
}

const loadingPlaceholder = <Box textAlign='center'><Spinner size='large' /></Box>;

export default function FieldCard({curQualMatch, setCurQualMatch, curElimMatch, setCurElimMatch,
    setModalTeam, matchCache, teamInfoCache, matchType, setMatchType}: FieldCardProps) {
    const match = matchCache.getMatch(matchType == 'quals' ? curQualMatch : curElimMatch, matchType);
    return (
        <Container
            id='field-card'
            header={
                <Header variant='h2' description={`Field ${match?.field}`}
                    actions={<SegmentedControl selectedId={matchType}
                                onChange={({ detail }) => setMatchType(detail.selectedId as MatchType)}
                                label='Match type'
                                options={[
                                    {text: 'Qualifications', id: 'quals',},
                                    {text: 'Eliminations', id: 'elims', disabled: matchCache.totalElims()  == 0,},
                                ]} />}>
                    Match {matchType == 'quals' ? curQualMatch : curElimMatch} of {matchType == 'quals' ? matchCache.totalQuals() : matchCache.totalElims()}
                    {matchType == 'elims' && ' (' + match?.name + ')'}
                </Header>
            }
            footer={<Pagination currentPageIndex={matchType == 'quals' ? curQualMatch : curElimMatch}
                pagesCount={matchType == 'quals' ? matchCache.totalQuals() : matchCache.totalElims()}
                onChange={({detail}) => (matchType == 'quals' ? setCurQualMatch : setCurElimMatch)(detail.currentPageIndex)} />}>
            {matchType == 'quals' ? <QualsTable match={match} teamInfoCache={teamInfoCache} setModalTeam={setModalTeam} />
                                   : <ElimsTable match={match} teamInfoCache={teamInfoCache} setModalTeam={setModalTeam} />}
        </Container>
    );
}

interface MatchTableProps {
    match: Match | null,
    setModalTeam: (val: number | null) => void,
    teamInfoCache: TeamInfoCache,
}

function QualsTable({match, setModalTeam, teamInfoCache}: MatchTableProps) {
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
        <ColumnLayout columns={2}>
            <TeamBox allianceColor='red' team={teams.red['1']!} setModalTeam={setModalTeam} />
            <TeamBox allianceColor='blue' team={teams.blue['1']!} setModalTeam={setModalTeam} />
            <TeamBox allianceColor='red' team={teams.red['2']!} setModalTeam={setModalTeam} />
            <TeamBox allianceColor='blue' team={teams.blue['2']!} setModalTeam={setModalTeam} />
        </ColumnLayout>
    );
}

function ElimsTable({match, setModalTeam, teamInfoCache}: MatchTableProps) {
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
    let teamBoxes: JSX.Element[] = [];
    let i = 0;
    for (; i < teams.red.length; i++) {
        teamBoxes.push(<TeamBox key={i * 2} allianceColor='red' team={teams.red[i]!} setModalTeam={setModalTeam} />);
        teamBoxes.push(i < teams.blue.length ? <TeamBox key={i * 2 + 1} allianceColor='blue' team={teams.blue[i]!} setModalTeam={setModalTeam} /> : <div key={i * 2 + 1} />);
    }
    for (; i < teams.blue.length; i++) {
        teamBoxes.push(<div key={i * 2} />);
        teamBoxes.push(<TeamBox key={i * 2 + 1} allianceColor='blue' team={teams.blue[i]!} setModalTeam={setModalTeam} />);
    }
    return (
        <ColumnLayout columns={2}>
            {teamBoxes}
        </ColumnLayout>
    );
}

interface TeamBoxProps {
    team: Team,
    setModalTeam: (val: number | null) => void,
    allianceColor: AllianceColor
}

function TeamBox({team, setModalTeam, allianceColor}: TeamBoxProps) {
    return (
        <div style={{backgroundColor: allianceColor,}} className='team-card' onClick={() => setModalTeam(team.number)}>
            <h3>{team.number}</h3>
            <h4>{team.name}</h4>
            <h5>{team.city}, {team.state}, {team.country}</h5>
        </div>
    );
}
