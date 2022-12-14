import Button from '@cloudscape-design/components/button';
import Table from '@cloudscape-design/components/table';
import { useState } from 'react';
import { RankedTeam } from '../types/team';

interface RankingsTableProps {
    rankings: RankedTeam[],
    refreshRankings: () => Promise<any>,
    hideButton?: boolean,
}

export default function RankingsTable({rankings, refreshRankings, hideButton = false}: RankingsTableProps) {
    const [loading, setLoading] = useState(false);

    return (
        <>
            {!hideButton && <Button onClick={async () => {
                setLoading(true);
                await refreshRankings();
                setLoading(false);
            }} loading={loading}>Refresh</Button>}
            <Table stripedRows
                columnDefinitions={[
                    {
                        header: 'Rank',
                        cell: e => e.ranking,
                    },
                    {
                        header: 'Team',
                        cell: e => e.team,
                    },
                    {
                        header: 'Name',
                        cell: e => e.teamName,
                    },
                    {
                        header: 'RP',
                        cell: e => e.rankingPoints,
                    },
                    {
                        header: 'TBP1',
                        cell: e => e.tbp1,
                    },
                    {
                        header: 'TBP2',
                        cell: e => e.tbp2,
                    },
                    {
                        header: 'Matches Played',
                        cell: e => e.matchesPlayed,
                    },
                    {
                        header: 'Highest Score',
                        cell: e => e.highestScore,
                    },
                    {
                        header: 'WLT',
                        cell: e => `${e.wins}-${e.losses}-${e.ties}`,
                    },
                ]}
                items={rankings}
                variant='embedded' />
        </>
    )
}
