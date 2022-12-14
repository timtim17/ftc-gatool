import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Spinner from "@cloudscape-design/components/spinner";
import * as awsui from '@cloudscape-design/design-tokens';
import { useEffect, useState } from "react";
import MatchCache from "../MatchCache";
import TeamInfoCache from "../TeamInfoCache";
import { Match, QualsAlliance } from "../types/match";

interface FirstMatchCardProps {
    matchCache: MatchCache,
    teamInfoCache: TeamInfoCache,
    curQualMatch: number,
}

export default function FirstMatchCard({matchCache, teamInfoCache, curQualMatch,}: FirstMatchCardProps) {
    const [firstMatch, setFirstMatch] = useState<{ team: number, match: number, }[]>();
    useEffect(() => {
        // jank alert!
        new Promise<void>(res => {
            const int = setInterval(() => {
                if (teamInfoCache.allTeams().length > 0) {
                    clearInterval(int);
                    res();
                }
            }, 500);
        })
        .then(() => {
            const allTeams = teamInfoCache.allTeams();
            const allMatches = matchCache.allQuals();
            const matchNumbers = [...new Array(matchCache.totalQuals())].map((_, i) => i + 1);
            setFirstMatch(allTeams.map(teamNumber => ({
                team: teamNumber,
                match: matchNumbers.find(matchNumber => {
                    const match: Match = allMatches[matchNumber];
                    const redAlliance = match.red as QualsAlliance;
                    const blueAlliance = match.blue as QualsAlliance;
                    return redAlliance.team1 == teamNumber || redAlliance.team2 == teamNumber ||
                        blueAlliance.team1 == teamNumber || blueAlliance.team2 == teamNumber;
                })!,
            })));
        });
    }, [matchCache, teamInfoCache,]);
    return (
        <Container
            header={<Header variant='h2'>First Appearances</Header>}>
            {firstMatch ? <SpaceBetween size='s' direction='horizontal'>
                    {firstMatch.map(((team, idx) => <Pill key={idx} team={team} curQualMatch={curQualMatch} />))}
                </SpaceBetween> : <Spinner />}
        </Container>
    );
}

interface PillProps {
    team: { team: number, match: number, },
    curQualMatch: number,
}

function Pill({team, curQualMatch,}: PillProps) {
    return (
        <div style={{
            borderRadius: awsui.borderRadiusButton,
            borderColor: team.match == curQualMatch ? awsui.colorChartsRed500 : awsui.colorBackgroundButtonPrimaryDefault,
            borderStyle: 'solid',
            borderWidth: '2px',
            overflow: 'hidden',
            transition: 'all 100ms ease-in-out',
            fontWeight: team.match == curQualMatch ? 'bold' : 'normal',
        }}>
            <span style={{
                backgroundColor: team.match == curQualMatch ? awsui.colorChartsRed500 : awsui.colorBackgroundButtonPrimaryDefault,
                display: 'inline-block',
                color: 'white',
                padding: '0 8px',
                transition: 'all 100ms ease-in-out',
            }}>{team.team}</span>
            <span style={{
                color: team.match == curQualMatch ? awsui.colorChartsRed500 : awsui.colorBackgroundButtonPrimaryDefault,
                padding: '0 8px',
                transition: 'all 100ms ease-in-out',
            }}>{team.match}</span>
        </div>
    );
}

