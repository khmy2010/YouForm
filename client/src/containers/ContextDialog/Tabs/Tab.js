import React from 'react';

import './Tabs.css';

const tab = props => {
    let classNames = ['Tab'];
    if (props.active) classNames.push('Tab__Active');

    classNames = classNames.join(' ');

    return (
        <div
            className={classNames}
            onClick={props.clicked}
            data-tab={props.children}
        >
            {props.children}
        </div>
    );
};

export default tab;
