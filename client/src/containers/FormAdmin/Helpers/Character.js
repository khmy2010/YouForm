import React from 'react';

import EleComp from '../Builder/EleComp';
import { VBUILD } from '../Builder/Validate';
import { typeCheck } from '../../../utils';

const character = ({ type, changed, min, max }) => {
    if (!typeCheck.isText(type)) return null;

    return (
        <React.Fragment>
            <EleComp
                type="inlineInput"
                name="minCharCount"
                displayName="Minimum Character Count:"
                onInputChange={changed}
                value={min}
                vbuild={[VBUILD.MIN_CHAR, VBUILD.NUM].join(' ')}
                vfield
            />
            <EleComp
                type="inlineInput"
                name="maxCharCount"
                displayName="Maximum Character Count:"
                onInputChange={changed}
                value={max}
                vbuild={[VBUILD.MAX_CHAR, VBUILD.NUM].join(' ')}
                vfield
            />
        </React.Fragment>
    );
};

export default character;
