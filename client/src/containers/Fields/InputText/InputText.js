import React from 'react';

import './InputText.css';

/*
Possible Props:
1. value
2. onChange()
3. onFocus()
4. onBlur()
5. errorStatus
6. type
*/

const inputText = props => {
    //perform view logic such as errors and error message

    let classes = ['Input__Text'];

    if (props.errorStatus) {
        classes.push('Text-Error');
    }

    classes = classes.join(' ');

    return (
        <input
            className={classes}
            value={props.value}
            onChange={event => props.onChange(event.target.value)}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
        />
    );
};

export default inputText;
