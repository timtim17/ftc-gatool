import Alert from '@cloudscape-design/components/alert';
import AppLayout from '@cloudscape-design/components/app-layout';
import Flashbar from '@cloudscape-design/components/flashbar';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';
// import { TopNavigation } from '@cloudscape-design/components';
import { Mode, applyMode } from '@cloudscape-design/global-styles';
import './App.css';
import Content from './components/Content';
import Navigation from './components/Navigation';
import { RankedTeam, Team } from './types/team';
import React, { useEffect, useMemo, useState } from 'react';
import RankingsTool from './components/RankingsTool';
import TeamInfoCache from './TeamInfoCache';
import MatchCache from './MatchCache';


export const LS_DARK_THEME = 'IsDarkTheme';

function App() {
    const [notifications, setNotifications] = useState<React.ReactNode | undefined>();
    const [activeHref, setActiveHref] = useState('#/field');
    const [rankings, setRankings] = useState<RankedTeam[]>([]);
    const [eventKey, _setEventKey] = useState<string | null>(localStorage.getItem('eventKey'));
    function setEventKey(val: string | null) {
        const currentEvent = eventKey;
        _setEventKey(val);
        if (val) {
            localStorage.setItem('eventKey', val);
        } else {
            localStorage.removeItem('eventKey');
        }
        if (currentEvent != eventKey) refreshEvent();
    }
    const [scorekeeperIp, _setScorekeeperIp] = useState(localStorage.getItem('scorekeeperIp') ?? 'http://localhost');
    function setScorekeeperIp(val: string) {
        if (!val.startsWith('http')) val = 'http://' + val;
        _setScorekeeperIp(val);
        localStorage.setItem('scorekeeperIp', val);
    }
    const [disconnected, setDisconnected] = useState(true);
    const [loading, setLoading] = useState(false);
    const [curQualMatch, setCurQualMatch] = useState(1);
    const [curElimMatch, setCurElimMatch] = useState(1);
    const [modalTeam, _setModalTeam] = useState<Team | null>(null);
    function setModalTeam(val: number | null) {
        if (val == null) {
            _setModalTeam(null);
        } else {
            teamInfoCache.getTeam(val).then(team => _setModalTeam(team));
        }
    }

    useEffect(() => {
        if (!eventKey) return;
        refreshEvent();
        fetch(`${scorekeeperIp}/api/v1/events/${eventKey}/matches/active/`)
            .then(res => res.json())
            .then(data => {
                if (data.matches.length > 0) {
                    setCurQualMatch(data.matches[data.matches.length - 1].matchNumber);
                } else {
                    setCurQualMatch(1);
                }
            });
    }, [eventKey]);

    const teamInfoCache = useMemo(() => new TeamInfoCache(scorekeeperIp, eventKey ?? undefined), [scorekeeperIp, eventKey]);
    const matchCache = useMemo(() => new MatchCache(scorekeeperIp, eventKey!), [scorekeeperIp, eventKey]);

    useEffect(() => applyMode(localStorage.getItem(LS_DARK_THEME) == 'true' ? Mode.Dark : Mode.Light), []);

    function refreshEvent() {
        if (!eventKey) return;

        setLoading(true);
        const promises: Promise<any>[] = [];

        promises.push(refreshRankings());
        matchCache.updateCacheIfEmpty();

        Promise.all(promises).then(() => {
            setDisconnected(false);
            setNotifications(undefined);
        })
        .catch(err => {
            setDisconnected(true);
            setNotifications(<Flashbar
                items={[{
                    header: 'Error',
                    type: 'error',
                    content: err.message,
                    dismissible: true,
                    dismissLabel: 'Dismiss message',
                    onDismiss: () => setNotifications(undefined),
                    id: 'message_err',
                }]} />)
        })
        .then(() => {
            setLoading(false);
        });
    }

    function refreshRankings() {
        return fetch(`${scorekeeperIp}/api/v1/events/${eventKey}/rankings/`)
            .then(res => res.json())
            .then(data => data.rankingList)
            .then(setRankings);
    }

    return (
        <>
            {/* <TopNavigation
                identity={{
                    href: '#',
                    title: 'FIRST Tech Challenge GA Tool'
                }}
                i18nStrings={{
                    overflowMenuTriggerText: 'More',
                    overflowMenuTitleText: 'Menu',
                }} /> */}
            <AppLayout
                content={<Content setNotifications={setNotifications} activeHref={activeHref}
                    eventKey={eventKey} setEventKey={setEventKey} scorekeeperIp={scorekeeperIp}
                    setScorekeeperIp={setScorekeeperIp} loading={loading} disconnected={disconnected}
                    setDisconnected={setDisconnected} refreshEvent={refreshEvent} rankings={rankings}
                    refreshRankings={refreshRankings} curQualMatch={curQualMatch} setCurQualMatch={setCurQualMatch}
                    modalTeam={modalTeam} setModalTeam={setModalTeam} teamInfoCache={teamInfoCache}
                    matchCache={matchCache} curElimMatch={curElimMatch} setCurElimMatch={setCurElimMatch} />}
                navigation={<Navigation activeHref={activeHref} setActiveHref={setActiveHref} />}
                tools={<RankingsTool rankings={rankings} refreshRankings={refreshRankings} setModalTeam={setModalTeam} />}
                notifications={
                    <SpaceBetween size='s'>
                        <Alert visible={disconnected} type="warning" header='Disconnected from FTCLive'>
                            GATool is currently disconnected from the scoring software. Please check
                            your <Link onFollow={(e) => {
                                e.preventDefault();
                                setActiveHref('#/settings');
                            }}>settings</Link> and resync.
                        </Alert>
                        {notifications}
                    </SpaceBetween>
                }
                toolsHide={eventKey == null} />
        </>
    );
}

export default App;
