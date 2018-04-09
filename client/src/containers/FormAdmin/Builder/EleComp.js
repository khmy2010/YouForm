import React from 'react';

import FlexInputs from './FlexInputs';
import Select from '../../../components/Select/Select';

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
                        onChange={event =>
                            props.onInputChange(event, props.vbuild)
                        }
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
        case 'inlineInput':
            return (
                <div className="EleField EleInline">
                    <label>{props.displayName}</label>
                    <input
                        name={props.name}
                        type="text"
                        value={props.value}
                        onChange={event =>
                            props.onInputChange(
                                event,
                                props.vbuild,
                                props.vfield
                            )
                        }
                    />
                </div>
            );

        case 'select':
            return (
                <div className="EleField">
                    <label>{props.displayName}</label>
                    <Select
                        options={props.options}
                        clicked={props.onChange}
                        default={true}
                    />
                </div>
            );
        default:
            return null;
    }
};

export default eleComp;
