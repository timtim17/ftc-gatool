import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Flashbar from '@cloudscape-design/components/flashbar';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Select from '@cloudscape-design/components/select';
import SpaceBetween from '@cloudscape-design/components/space-between';
import React, { useEffect, useState } from 'react';

interface SettingsCardProps {
    scorekeeperIp: string,
    setScorekeeperIp: (val: string) => void,
    eventKey: string | null,
    setEventKey: (val: string | null) => void,
    setDisconnected: (val: boolean) => void,
    setEventName: (val: string) => void,
}

export default function SettingsCard({scorekeeperIp, setScorekeeperIp, eventKey, setEventKey, setDisconnected, setEventName}: SettingsCardProps) {
    const [eventNames, _setEventNames] = useState<Record<string, string>>(JSON.parse(localStorage.getItem('eventNames') ?? '{}'));
    function setEventNames(val: Record<string, string>) {
        _setEventNames(val);
        localStorage.setItem('eventNames', JSON.stringify(val));
    }
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<React.ReactNode | undefined>();
    const [localScorekeeperIp, setLocalScoreKeeperIp] = useState(scorekeeperIp);
    useEffect(() => setLocalScoreKeeperIp(scorekeeperIp), [scorekeeperIp]);

    function refreshEvents() {
        setScorekeeperIp(localScorekeeperIp);
        setLoading(true);
        const promises: Promise<any>[] = [];
        const eventNames: Record<string, string> = {};

        promises.push(fetch(`${scorekeeperIp}/api/v1/events/`)
            .then(res => res.json())
            .then(data => Promise.all(data.eventCodes.map(
                (key: string) => fetch(`${scorekeeperIp}/api/v1/events/${key}/`)
                    .then(res => res.json())
                    .then(data => eventNames[key] = data.name)
            )))
        );

        Promise.all(promises).then(() => {
            setEventNames(eventNames);
            setDisconnected(false);
            setNotifications(<Flashbar
                items={[{
                    type: 'success',
                    content: 'Sync complete!',
                    dismissible: true,
                    dismissLabel: 'Dismiss message',
                    onDismiss: () => setNotifications(undefined),
                    id: 'message_success',
                }]} />)
            if (eventKey && !Object.keys(eventNames).includes(eventKey)) {
                setEventKey(null);
                setEventName('FIRST Tech Challenge');
            }
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

    return (
        <Container>
            <SpaceBetween size='m'>
                <FormField
                    label='Scorekeeper IP'
                    description='IP address of the scoring server.'
                    secondaryControl={<Button onClick={refreshEvents} loading={loading}>Sync events</Button>}>
                    <Input
                        value={localScorekeeperIp}
                        onChange={event => setLocalScoreKeeperIp(event.detail.value)} />
                </FormField>

                {notifications}

                <FormField label='Event'>
                    <Select
                        selectedOption={eventKey ? { label: eventNames[eventKey], value: eventKey } : null}
                        onChange={({detail}) => {
                            setEventKey(detail.selectedOption.value!);
                            setEventName(detail.selectedOption.label!);
                        }}
                        options={Object.entries(eventNames).map(([key, name]) => ({ label: name, value: key }))}
                        empty='No events found' />
                </FormField>
            </SpaceBetween>
        </Container>
    );
}
