import Header from '@cloudscape-design/components/header';
import HelpPanel from '@cloudscape-design/components/help-panel';
import { RankedTeam } from '../types/team';
import RankingsTable from './RankingsTable';

interface RankingsToolProps {
    rankings: RankedTeam[],
    refreshRankings: () => Promise<any>,
}

export default function RankingsTool({rankings, refreshRankings}: RankingsToolProps) {
    return (
        <HelpPanel header={<Header variant='h2'>Rankings</Header>}>
            <RankingsTable rankings={rankings} refreshRankings={refreshRankings} />
        </HelpPanel>
    )
}
