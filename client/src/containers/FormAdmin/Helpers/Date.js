import React from 'react';

import EleComp from '../Builder/EleComp';
import { CONSTS, typeCheck } from '../../../utils';

const date = ({ type, changed, dateType }) => {
    if (!typeCheck.isDate(type)) return null;

    const selectOptions = Object.keys(CONSTS.DATE_TYPE).map(key => {
        return {
            value: key,
            display: CONSTS.DATE_TYPE[key]
        };
    });

    return (
        <EleComp
            type="select"
            name="format"
            displayName="Date Format"
            options={selectOptions}
            onChange={changed}
            default={true}
            init={dateType === '' ? null : dateType}
        />
    );
};

export default date;
