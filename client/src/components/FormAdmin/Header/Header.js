import React from 'react';

import './Header.css';
import Button from '../../Button/Button';
import { NavLink } from 'react-router-dom';

const header = props => {
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
                <Button>
                    <NavLink to="/app/dashboard">Go to Dashboard</NavLink>
                </Button>
            </div>
        </div>
    );
};

export default header;
