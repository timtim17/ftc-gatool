import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header'
import SpaceBetween from '@cloudscape-design/components/space-between';
import Spinner from '@cloudscape-design/components/spinner';
import TeamInfoCache from '../TeamInfoCache';

const loadingPlaceholder = <Container><Box textAlign='center'><Spinner size='large' /></Box></Container>;

interface AllianceSelectionCardProps {
    teamInfoCache: TeamInfoCache,
    setModalTeam: (val: number | null) => void,
}

export default function AllianceSelectionCardProps({teamInfoCache, setModalTeam}: AllianceSelectionCardProps) {
    if (teamInfoCache.allTeams().length == 0) return loadingPlaceholder;
    return (
        <Container header={<Header variant='h2'>Teams</Header>}>
            <SpaceBetween direction='horizontal' size='s'>
                {teamInfoCache.allTeams().map((team, idx) => <Button key={idx} onClick={() => setModalTeam(team)}>{team}</Button>)}
            </SpaceBetween>
        </Container>
    );
}
