import React from 'react';
import './CButton.css';

//possible style = info (blue), warning (red)

const button = ({ context, children, clicked }) => {
    let classNames = ['ContextButton'];

    if (context) classNames.push(context);

    classNames = classNames.join(' ');

    return (
        <button onClick={clicked} className={classNames}>
            {children}
        </button>
    );
};

export default button;
