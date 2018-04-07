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
                <Select
                    options={[
                        { value: 'Alo', display: 'Fuck Select!' },
                        { value: 'Miaw', display: 'Fuck Miaw!' },
                        { value: 'Ter', display: 'Fuck Ter!' },
                        { value: 'MShape', display: 'Fuck MShape!' },
                        { value: 'Yous', display: 'Fuck Yous!' },
                        { value: 'Magneto', display: 'Fuck Magneto!' },
                        { value: 'Pacific', display: 'Fuck Pacific!' }
                    ]}
                />
            );
        default:
            return null;
    }
};

export default eleComp;
