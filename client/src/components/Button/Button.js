import React from 'react';

import './Button.css';

const button = props => {
    let classNames = ['EleButton'];

    if (props.className) classNames.push(props.className);

    classNames = classNames.join(' ');

    return (
        <button
            className={classNames}
            onClick={props.clicked}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    );
};

export default button;
