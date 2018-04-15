import React from 'react';

import EleComp from '../Builder/EleComp';
import { VBUILD } from '../Builder/Validate';
import { typeCheck } from '../../../utils';

const choices = props => {
    if (!typeCheck.isExtendedChoice(props.type)) return null;

    let minMaxValidation = null;

    if (typeCheck.isMultipleChoice(props.type)) {
        minMaxValidation = (
            <React.Fragment>
                <EleComp
                    type="inlineInput"
                    name="minChoice"
                    displayName="Minimum Choices:"
                    onInputChange={props.inputChanged}
                    value={props.minChoice}
                    vbuild={[VBUILD.MIN, VBUILD.NUM].join(' ')}
                    vfield
                />
                <EleComp
                    type="inlineInput"
                    name="maxChoice"
                    displayName="Maximum Choices:"
                    onInputChange={props.inputChanged}
                    value={props.maxChoice}
                    vbuild={[VBUILD.MAX, VBUILD.NUM].join(' ')}
                    vfield
                />
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <EleComp
                type="flexInput"
                name="options"
                displayName="Options"
                options={props.options}
                onAdd={props.addFlexInput}
                onRemove={props.removeFlexInput}
                onChange={props.changeFlexInput}
                latestFlex={props.latestFlex}
                editable={typeCheck.isYesNo(props.type) ? false : true}
            />
            {minMaxValidation}
        </React.Fragment>
    );
};

export default choices;
