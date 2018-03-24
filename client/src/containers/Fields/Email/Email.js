import React from 'react';

//possible props:
//1. value
const email = props => {
    //perform view logic such as errors and error message

    let classes = ['_text'];
    let errorMsg = '';

    if (props.errorStatus) {
        classes.push('Text-Error');
        errorMsg = <p className="Text-ErrorMsg">This field is required.</p>;
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

export default email;
