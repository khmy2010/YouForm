import React from 'react';

import './Stats.css';

import Stat from './Stat';

const stats = ({ responses, desktop, mobile }) => {
    // const countCompletionRate = () => {
    //     const total = desktop + mobile;
    //     if (total === 0 || responses === 0) return 0;
    //     const ratio = Math.floor(responses / total);
    //     return ratio * 100;
    // };

    return (
        <div className="Responses__Stats">
            <h3>Statistics</h3>
            <div className="Stats__Wrapper">
                <Stat figure={responses}>Responses</Stat>
                <Stat figure={desktop}>Desktop Visits</Stat>
                <Stat figure={mobile}>Mobile Visits</Stat>
            </div>
        </div>
    );
};

export default stats;
