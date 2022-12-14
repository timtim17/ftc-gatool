import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import { useState } from 'react';
import { RankedTeam } from '../types/team';
import RankingsTable from './RankingsTable';

interface RankingsCardProps {
    rankings: RankedTeam[],
    refreshRankings: () => Promise<any>,
}

export default function RankingsCard({rankings, refreshRankings}: RankingsCardProps) {
    const [loading, setLoading] = useState(false);

    return (
        <Container header={<Header variant='h2'
            actions={<Button onClick={async () => {
                setLoading(true);
                await refreshRankings();
                setLoading(false);
            }} loading={loading} iconName='refresh' />}>
                Rankings
            </Header>
        }>
            <RankingsTable rankings={rankings} refreshRankings={refreshRankings} hideButton />
        </Container>
    )
}
