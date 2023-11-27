import Autosuggest from '@cloudscape-design/components/autosuggest';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header'
import SpaceBetween from '@cloudscape-design/components/space-between';
import Spinner from '@cloudscape-design/components/spinner';
import TeamInfoCache from '../TeamInfoCache';
import { useState } from 'react';

const loadingPlaceholder = <Container><Box textAlign='center'><Spinner size='large' /></Box></Container>;

interface AllianceSelectionCardProps {
    teamInfoCache: TeamInfoCache,
    setModalTeam: (val: number | null) => void,
}

export default function AllianceSelectionCard({teamInfoCache, setModalTeam}: AllianceSelectionCardProps) {
    if (teamInfoCache.allTeams().length == 0) return loadingPlaceholder;
    return (
        <Container header={<Header variant='h2'>Teams</Header>}>
            <SpaceBetween direction='vertical' size='s'>
                <TeamAutocomplete teamInfoCache={teamInfoCache} setModalTeam={setModalTeam} />
                <SpaceBetween direction='horizontal' size='s'>
                    {teamInfoCache.allTeams().map((team, idx) => <Button key={idx} onClick={() => setModalTeam(team)}>{team}</Button>)}
                </SpaceBetween>
            </SpaceBetween>
        </Container>
    );
}

function TeamAutocomplete({teamInfoCache, setModalTeam}: AllianceSelectionCardProps) {
    const [value, setValue] = useState('');
    return (
        <Autosuggest onChange={({detail}) => setValue(detail.value)}
            value={value}
            options={teamInfoCache.allTeams().map(team => ({value: team.toString()}))}
            placeholder='Team number'
            onSelect={({detail}) => {
                setModalTeam(parseInt(detail.value));
                setValue('');
            }}
            ariaLabel='Team number'
            enteredTextLabel={value => `Use: "${value}"`}
        />
    );
}
