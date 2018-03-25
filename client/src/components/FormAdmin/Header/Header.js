import React from 'react';

import './Header.css';
import Button from '../../Button/Button';

const header = props => {
    console.log('FIX MEEEEEEEE!!!!!', props);

    const checkFileNameInput = ({ charCode, target }) => {
        const keyPressed = charCode;
        const fileName = target.value;

        if (charCode === 13 && fileName.trim().length !== 0) {
            props.onSaveFileName(fileName);
            //TODO: BLUR the input and call it a day.
        }
    };

    return (
        <div className="FormAdmin__Header">
            <input
                className="FormAdmin__Name"
                type="text"
                value={props.fileName}
                onChange={event => props.onChange(event)}
                onKeyPress={event => checkFileNameInput(event)}
            />

            <div>
                <Button>File</Button>
                <Button>Go to Dashboard</Button>
            </div>
        </div>
    );
};

export default header;
