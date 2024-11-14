import AnnouncerReportCard from './AnnouncerReportCard';
import FieldCard from './FieldCard';
import SettingsCard from './SettingsCard';

import Badge from '@cloudscape-design/components/badge';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useState } from 'react';
import RankingsCard from './RankingsCard';
import { RankedTeam, Team } from '../types/team';
import TeamModal from './TeamModal';
import TeamInfoCache from '../TeamInfoCache';
import MatchCache from '../MatchCache';
import AllianceSelectionCard from './AllianceSelectionCard';
import { MatchType } from '../types/util';
import FirstMatchCard from './FirstMatchCard';

interface ContentProps {
    setNotifications: (node: React.ReactNode | undefined) => void,
    activeHref: string,
    eventKey: string | null,
    setEventKey: (val: string | null) => void,
    scorekeeperIp: string,
    setScorekeeperIp: (val: string) => void,
    loading: boolean,
    disconnected: boolean,
    setDisconnected: (val: boolean) => void,
    refreshEvent: () => void,
    rankings: RankedTeam[],
    refreshRankings: () => Promise<any>,
    curQualMatch: number,
    setCurQualMatch: (val: number) => void,
    modalTeam: Team | null,
    setModalTeam: (val: number | null) => void,
    teamInfoCache: TeamInfoCache,
    matchCache: MatchCache,
    curElimMatch: number,
    setCurElimMatch: (val: number) => void,
}

export default function Content({activeHref, eventKey, setEventKey, scorekeeperIp, setScorekeeperIp,
    loading, disconnected, setDisconnected, refreshEvent, rankings, refreshRankings, curQualMatch,
    setCurQualMatch, modalTeam, setModalTeam, teamInfoCache, matchCache, curElimMatch, setCurElimMatch}: ContentProps) {
    const [eventName, _setEventName] = useState<string>(localStorage.getItem('eventName') ?? 'FIRST Tech Challenge');
    function setEventName(val: string) {
        _setEventName(val);
        localStorage.setItem('eventName', val);
    }
    const [matchType, setMatchType] = useState<MatchType>('quals');

    return (
        <ContentLayout headerVariant='high-contrast'
            header={
                <Box margin={{ top: 's' }}>
                    <Header
                        variant='h1'
                        actions={
                            <Button onClick={refreshEvent} loading={loading} disabled={eventKey == null}>Refresh</Button>
                        }>
                            <SpaceBetween size='s' direction='horizontal'>
                                {eventKey ? eventName : <><em>FIRST</em> Tech Challenge</>}
                                {disconnected && <Badge color='red'>Disconnected</Badge>}
                            </SpaceBetween>
                    </Header>
                </Box>
            }>
                <SpaceBetween size='l'>
                    {activeHref == '#/field' && <FieldCard curQualMatch={curQualMatch} setCurQualMatch={setCurQualMatch}
                                                    setModalTeam={setModalTeam} matchCache={matchCache} teamInfoCache={teamInfoCache}
                                                    curElimMatch={curElimMatch} setCurElimMatch={setCurElimMatch}
                                                    matchType={matchType} setMatchType={setMatchType} />}
                    {activeHref == '#/announcer' && <AnnouncerReportCard curQualMatch={curQualMatch} setCurQualMatch={setCurQualMatch}
                                                        matchCache={matchCache} teamInfoCache={teamInfoCache} eventKey={eventKey}
                                                        curElimMatch={curElimMatch} setCurElimMatch={setCurElimMatch}
                                                        matchType={matchType} setMatchType={setMatchType} />}
                    {(activeHref == '#/field' || activeHref == '#/announcer') && matchType == 'quals' && <FirstMatchCard matchCache={matchCache} teamInfoCache={teamInfoCache} curQualMatch={curQualMatch} />}
                    {(activeHref == '#/alliance' || activeHref == '#/awards') && <AllianceSelectionCard teamInfoCache={teamInfoCache} setModalTeam={setModalTeam} />}
                    {(activeHref == '#/rankings' || activeHref == '#/alliance') && <RankingsCard rankings={rankings} refreshRankings={refreshRankings} setModalTeam={setModalTeam} />}
                    {activeHref == '#/settings' && <SettingsCard
                                                        scorekeeperIp={scorekeeperIp}
                                                        setScorekeeperIp={setScorekeeperIp}
                                                        eventKey={eventKey}
                                                        setEventKey={setEventKey}
                                                        setDisconnected={setDisconnected}
                                                        setEventName={setEventName} />}
                </SpaceBetween>
                <TeamModal team={modalTeam} setTeam={setModalTeam} />
        </ContentLayout>
    );
}
