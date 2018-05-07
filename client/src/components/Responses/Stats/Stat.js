import React from 'react';

import './Stats.css';

const stat = ({ children, figure }) => (
    <div className="Stats__Stat">
        <div className="Stats__Title">{children}</div>
        <div className="Stats__Figure">{figure}</div>
    </div>
);

export default stat;
