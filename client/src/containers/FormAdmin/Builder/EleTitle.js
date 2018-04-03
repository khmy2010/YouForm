import React from 'react';

import { CONSTS } from '../../../utils';

const eleTitle = ({ type, sequence }) => {
    let rendered = null;

    if (sequence === undefined) {
        sequence = 1;
    }

    switch (type) {
        case CONSTS.TYPE.SHORT_TEXT:
            rendered = `${sequence}. New Short Text Question`;
            break;
        case CONSTS.TYPE.EMAIL:
            rendered = `${sequence}. New Email Question`;
            break;
        case CONSTS.TYPE.NUMBER:
            rendered = `${sequence}. New Number Question`;
            break;
        case CONSTS.TYPE.CURRENCY:
            rendered = `${sequence}. New Currency Question`;
            break;
        case 'EDITING':
            rendered = 'Edit Question';
            break;
        default:
            break;
    }

    return <div className="EleTitle">{rendered}</div>;
};

export default eleTitle;
