import React from 'react';

import './Welcome.css';
import ContextButton from '../../ContextButton/CButton';

/*
    Expected Props:
    1. Title
    2. Description
    3. Button Text
    4. Number of Questions
    5. CSS Mode (Dev / Real)
*/
const welcome = props => {
    let className = 'Welcome';

    //make everything smaller in inspection mode
    //hide number of questions
    if (props.mode === 'dev') {
        className = 'Welcome__Demo';
    }

    return (
        <div className={className}>
            <h1>{props.title}</h1>
            <p>{props.description}</p>
            <ContextButton>
                {props.buttonText ? props.buttonText : 'Enter'}
            </ContextButton>
        </div>
    );
};

export default welcome;
