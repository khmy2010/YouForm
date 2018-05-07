import React from 'react';

import './Stats.css';

import Stat from './Stat';

const stats = props => {
    return (
        <div className="Responses__Stats">
            <h3>Statistics</h3>
            <div className="Stats__Wrapper">
                <Stat figure="100">Responses</Stat>
                <Stat figure="100">Visits</Stat>
                <Stat figure="100">Completion Rate</Stat>
                <Stat figure="100">Average Time to Complete</Stat>
            </div>
        </div>
    );
};

export default stats;
