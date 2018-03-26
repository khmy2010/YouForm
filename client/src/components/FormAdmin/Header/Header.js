import React from 'react';

import './Header.css';
import Button from '../../Button/Button';

const header = props => {
    console.log('FIX MEEEEEEEE!!!!!', props);
    let fileNameInput = null;

    const checkFileNameInput = ({ charCode, target }) => {
        const fileName = target.value;

        if (charCode === 13 && fileName.trim().length !== 0) {
            props.onSaveFileName(fileName);
            fileNameInput.blur();
        }
    };

    return (
        <div className="FormAdmin__Header">
            <input
                className="FormAdmin__Name"
                ref={input => {
                    fileNameInput = input;
                }}
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
