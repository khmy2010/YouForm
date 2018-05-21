import React from 'react';

import './Tabs.css';
import Tab from './Tab';

const TABS = ['Welcome Screen', 'Thanks Screen'];

const tabs = props => {
    const renderedTabs = TABS.map(tab => {
        let active = null;
        if (tab === props.activeTab) active = true;
        return (
            <Tab key={tab} active={active} clicked={props.clicked}>
                {tab}
            </Tab>
        );
    });
    return <div className="Tabs__Menu">{renderedTabs}</div>;
};

export default tabs;
