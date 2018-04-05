import React from 'react';

import FlexInputs from './FlexInputs';

const eleComp = props => {
    switch (props.type) {
        case 'checkbox':
            return (
                <div className="EleCheck">
                    <input
                        id={props.id}
                        type={props.type}
                        name={props.name}
                        value={props.value}
                        onChange={event => props.onCheckboxChange(event)}
                    />
                    <label htmlFor={props.id}>
                        <span />
                        {props.displayName}
                    </label>
                </div>
            );
        case 'input':
            return (
                <div className="EleField">
                    <label>{props.displayName}</label>
                    <input
                        type="text"
                        name={props.name}
                        value={props.value}
                        onChange={event => props.onInputChange(event)}
                    />
                </div>
            );
        case 'flexInput':
            return (
                <div className="EleField">
                    <label>{props.displayName}</label>
                    <FlexInputs {...props} />
                </div>
            );
        default:
            return null;
    }
};

export default eleComp;
