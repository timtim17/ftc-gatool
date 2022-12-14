import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Header from '@cloudscape-design/components/header';
import Modal from '@cloudscape-design/components/modal';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { Team } from '../types/team';

interface TeamModalProps {
    team: Team | null,
    setTeam: (team: number | null) => void,
}

export default function TeamModal({team, setTeam}: TeamModalProps) {
    return (
        <Modal
            visible={team != null}
            onDismiss={() => setTeam(null)}
            closeAriaLabel='Close modal'
            size='large'
            header={<Header variant='h2'>Team {team?.number}</Header>}
            footer={
                <Box float='right'>
                    <Button variant='primary' onClick={() => setTeam(null)}>Close</Button>
                </Box>
            }>
                <SpaceBetween size='s'>
                    <div>
                        <Box variant="awsui-key-label">Team name</Box>
                        <div>{team?.name}</div>
                    </div>
                    <div>
                        <Box variant="awsui-key-label">Affiliation</Box>
                        <div>{team?.affiliation}</div>
                    </div>
                    <ColumnLayout columns={4}>
                        <div>
                            <Box variant="awsui-key-label">City</Box>
                            <div>{team?.city}</div>
                        </div>
                        <div>
                            <Box variant="awsui-key-label">State</Box>
                            <div>{team?.state}</div>
                        </div>
                        <div>
                            <Box variant="awsui-key-label">Country</Box>
                            <div>{team?.country}</div>
                        </div>
                        <div>
                            <Box variant="awsui-key-label">Rookie year</Box>
                            <div>{team?.rookie}</div>
                        </div>
                    </ColumnLayout>
                </SpaceBetween>
        </Modal>
    );
}
