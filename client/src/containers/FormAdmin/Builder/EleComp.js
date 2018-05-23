import React from 'react';

import FlexInputs from './FlexInputs';
import Select from '../../../components/Select/Select';
import CheckBox from '../../../components/CheckBox/CheckBox';

const eleComp = props => {
    switch (props.type) {
        case 'bigHelp':
            return <div className="EleBigHelp">{props.children}</div>;
        case 'checkbox':
            return (
                <CheckBox
                    label={props.displayName}
                    changed={props.onCheckboxChange}
                    init={props.value}
                />
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
                        disabled={props.disabled ? true : false}
                    />
                    <small className="EleField__Help">
                        {props.helpText ? props.helpText : null}
                    </small>
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
                        default={props.default}
                        init={props.init}
                    />
                </div>
            );
        case 'skippingSelect':
            return (
                <div className="EleField">
                    <label>Skipping Logic:</label>
                    <small>LOGIC #1</small>
                    <div className="Flex__SpaceBetween">
                        <span>IF</span>
                        <Select options={props.options} />
                    </div>
                </div>
            );
        default:
            return null;
    }
};

export default eleComp;
