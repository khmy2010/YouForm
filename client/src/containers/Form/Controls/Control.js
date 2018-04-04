import React from 'react';

import './Controls.css';

const control = ({ text, clicked, name }) => {
    const styles = ['Controls__Button'];

    if (name) {
        styles.push(name);
    }

    const renderedStyle = styles.join(' ');

    return (
        <button className={renderedStyle} onClick={clicked}>
            {text}
        </button>
    );
};

export default control;
