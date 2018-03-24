import React from 'react';

//form component imports
import Text from './Text/Text';
import Email from './Email/Email';

//const imports
import { CONSTS } from '../../utils';

const render = ({ type, title, description, validation }) => {
    switch (type) {
        case CONSTS.TYPE.SHORT_TEXT:
            return (
                <Text
                    title={title}
                    description={description}
                    validation={validation}
                />
            );
        case CONSTS.TYPE.EMAIL:
            return (
                <Email
                    title={title}
                    description={description}
                    validation={validation}
                />
            );
        default:
            return null;
    }
};

export default render;
