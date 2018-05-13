import React from 'react';
import './CButton.css';

//possible style = info (blue), warning (red)

const button = ({ context, children, clicked, state }) => {
    let classNames = ['ContextButton'];

    if (context) classNames.push(context);

    classNames = classNames.join(' ');

    let disabled = false;
    if (state && state === true) disabled = true;

    return (
        <button onClick={clicked} className={classNames} disabled={disabled}>
            {children}
        </button>
    );
};

export default button;
