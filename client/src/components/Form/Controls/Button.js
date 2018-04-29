import React from 'react';

import './Controls.css';

/*
    1. I am idiot button, I just render what I am told
    Possible Props:
    1. Button Text
    2. ClassName
    3. Disabled?

    Do I need to be a button?
*/
const button = ({ text, type, clicked, state }) => {
    let className = ['Form__Controls__Button'];

    if (type) className.push(type);
    if (state === false) className.push('Form__Controls__Disabled');

    className = className.join(' ');

    return (
        <button className={className} onClick={clicked} disabled={!state}>
            {text}
        </button>
    );
};

export default button;
