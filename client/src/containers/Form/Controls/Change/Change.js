import React from 'react';

import './Change.css';

const change = ({ status }) => {
    let text = null;

    switch (status) {
        case 'pending':
            text = 'Waiting for changes.';
            break;
        case 'saving':
            text = 'Saving changes...';
            break;
        case 'saved':
            text = 'All changes saved locally.';
            break;
        default:
            text = 'All changes saved locally.';
            break;
    }

    return <p className="Form__Change">{text}</p>;
};

export default change;
