import React from 'react';

import './Details.css';

const row = ({ identifier, data }) => {
    return (
        <div className="Details__Row">
            <span className="Row__ID">{identifier}: </span>
            <span>{data}</span>
        </div>
    );
};

export default row;
