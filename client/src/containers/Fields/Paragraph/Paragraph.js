import React from 'react';

import './Paragraph.css';

const paragraph = props => {
    //dynamically decides how many rows
    let steps = 50;

    if (window.innerWidth > 1000) {
        steps = 60;
    }

    if (window.innerWidth < 1000) {
        steps = 40;
    }

    if (window.innerWidth < 900) {
        steps = 35;
    }

    if (window.innerWidth < 700) {
        steps = 30;
    }

    if (window.innerWidth < 500) {
        steps = 25;
    }

    const rows = Math.ceil(props.value.trim().length / steps);

    return (
        <textarea
            className="Paragraph"
            value={props.value}
            rows={rows}
            onChange={event => props.onChange(event.target.value)}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
        />
    );
};

export default paragraph;
