import SideNavigation from '@cloudscape-design/components/side-navigation';

interface NavigationProps {
    activeHref: string,
    setActiveHref: (val: string) => void,
}

export default function Navigation({activeHref, setActiveHref}: NavigationProps) {
    return (
        <SideNavigation
            activeHref={activeHref}
            header={{ text: 'FTC GA Tool', href: '#/field' }}
            onFollow={event => {
                if (!event.detail.external) {
                    event.preventDefault();
                    setActiveHref(event.detail.href);
                }
            }}
            items={[
                { type: 'link', text: 'Field View', href: '#/field' },
                { type: 'link', text: 'Announcer Report', href: '#/announcer'},
                { type: 'link', text: 'Rankings', href: '#/rankings'},
                { type: 'link', text: 'Alliance Selection', href: '#/alliance'},
                { type: 'link', text: 'Awards', href: '#/awards'},
                { type: 'link', text: 'Settings', href: '#/settings'},
            ]} />
    );
}
